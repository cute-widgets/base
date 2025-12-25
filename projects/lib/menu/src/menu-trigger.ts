/**
 * @license Apache-2.0
 *
 * Copyright (c) 2025 CuteWidgets Team. All Rights Reserved.
 *
 * You may not use this file except in compliance with the License
 * that can be found at http://www.apache.org/licenses/LICENSE-2.0
 *
 * This code is a modification of the `@angular/material` original
 * code licensed under MIT-style License (https://angular.dev/license).
 */
import {
    FocusMonitor,
    FocusOrigin,
    isFakeMousedownFromScreenReader,
    isFakeTouchstartFromScreenReader,
} from '@angular/cdk/a11y';
import {Direction, Directionality} from '@angular/cdk/bidi';
import {ENTER, LEFT_ARROW, RIGHT_ARROW, SPACE} from '@angular/cdk/keycodes';
import {
    FlexibleConnectedPositionStrategy,
    HorizontalConnectionPos,
    Overlay,
    OverlayConfig,
    OverlayRef,
    ScrollStrategy,
    VerticalConnectionPos,
} from '@angular/cdk/overlay';
import {TemplatePortal} from '@angular/cdk/portal';
import {
    AfterContentInit,
    ChangeDetectorRef,
    Directive,
    ElementRef,
    EventEmitter,
    inject,
    Inject,
    InjectionToken,
    Input, isDevMode,
    NgZone,
    OnDestroy,
    Optional,
    Output,
    Self,
    ViewContainerRef,
} from '@angular/core';
import {normalizePassiveListenerOptions} from '@angular/cdk/platform';
import {asapScheduler, merge, Observable, of as observableOf, Subscription} from 'rxjs';
import {delay, filter, take, takeUntil} from 'rxjs/operators';
import {CuteMenu, MenuCloseReason} from './menu';
import {throwCuteMenuRecursiveError} from './menu-errors';
import {CuteMenuItem} from './menu-item';
import {CUTE_MENU_PANEL, CuteMenuPanel} from './menu-panel';
import {MenuPositionX, MenuPositionY} from './menu-positions';

/** Injection token that determines the scroll handling while the menu is open. */
export const CUTE_MENU_SCROLL_STRATEGY = new InjectionToken<() => ScrollStrategy>(
    'cute-menu-scroll-strategy',
);

/** @docs-private */
export function CUTE_MENU_SCROLL_STRATEGY_FACTORY(overlay: Overlay): () => ScrollStrategy {
    return () => overlay.scrollStrategies.reposition();
}

/** @docs-private */
export const CUTE_MENU_SCROLL_STRATEGY_FACTORY_PROVIDER = {
    provide: CUTE_MENU_SCROLL_STRATEGY,
    deps: [Overlay],
    useFactory: CUTE_MENU_SCROLL_STRATEGY_FACTORY,
};

/** Options for binding a passive event listener. */
const passiveEventListenerOptions = normalizePassiveListenerOptions({passive: true});

/** Directive applied to an element that should trigger a `cute-menu`. */
@Directive({
    selector: `[cuteMenuTriggerFor]`,
    exportAs: 'cuteMenuTrigger',
    host: {
        'class': 'cute-menu-trigger',
        '[attr.aria-haspopup]': 'menu ? "menu" : null',
        '[attr.aria-expanded]': 'menuOpen',
        '[attr.aria-controls]': 'menuOpen ? menu.panelId : null',
        '(click)': '_handleClick($event)',
        '(mousedown)': '_handleMousedown($event)',
        '(keydown)': '_handleKeydown($event)',
    },
    standalone: true,
})
export class CuteMenuTrigger implements AfterContentInit, OnDestroy {
    private _portal: TemplatePortal | null = null;
    private _overlayRef: OverlayRef | null = null;
    private _menuOpen: boolean = false;
    private _closingActionsSubscription = Subscription.EMPTY;
    private _hoverSubscription = Subscription.EMPTY;
    private _menuCloseSubscription = Subscription.EMPTY;
    private readonly _scrollStrategy: () => ScrollStrategy;
    private _changeDetectorRef = inject(ChangeDetectorRef);

    /**
     * We're specifically looking for a `CuteMenu` here since the generic `CuteMenuPanel`
     * interface lacks some functionality around nested menus and animations.
     */
    private readonly _parentCuteMenu: CuteMenu | undefined;

    /**
     * Cached value of the padding of the parent menu panel.
     * Used to offset submenus to compensate for the padding.
     */
    private _parentInnerPadding: number | undefined;

    /**
     * Handles touch start events on the trigger.
     * Needs to be an arrow function, so we can easily use addEventListener and removeEventListener.
     */
    private _handleTouchStart = (event: TouchEvent) => {
        if (!isFakeTouchstartFromScreenReader(event)) {
            this._openedBy = 'touch';
        }
    };

    // Tracking input type is necessary, so it's possible to only autofocus
    // the first item of the list when the menu is opened via the keyboard
    _openedBy: Exclude<FocusOrigin, 'program' | null> | undefined = undefined;

    /** References the menu instance that the trigger is associated with. */
    @Input('cuteMenuTriggerFor')
    get menu(): CuteMenuPanel | null { return this._menu; }
    set menu(menu: CuteMenuPanel | null) {
        if (menu === this._menu) {
            return;
        }

        this._menu = menu;
        this._menuCloseSubscription.unsubscribe();

        if (menu) {
            if (menu === this._parentCuteMenu && isDevMode()) {
                throwCuteMenuRecursiveError();
            }

            this._menuCloseSubscription = menu.closed.subscribe((reason: MenuCloseReason) => {
                this._destroyMenu(reason);

                // If a click closed the menu, we should close the entire chain of nested menus.
                if ((reason === 'click' || reason === 'tab') && this._parentCuteMenu) {
                    this._parentCuteMenu.closed.emit(reason);
                }
            });
        }

        this._menuItemInstance?._setTriggersSubmenu(this.triggersSubmenu());
    }
    private _menu: CuteMenuPanel | null = null;

    /** Data to be passed along to any lazily rendered content. */
    @Input('cuteMenuTriggerData') menuData: any;

    /**
     * Whether focus should be restored when the menu is closed.
     * Note that disabling this option can have accessibility implications, and
     * it's up to you to manage focus if you decide to turn it off.
     */
    @Input('cuteMenuTriggerRestoreFocus') restoreFocus: boolean = true;

    /** Event emitted when the associated menu is opened. */
    @Output() readonly menuOpened: EventEmitter<void> = new EventEmitter<void>();

    /** Event emitted when the associated menu is closed. */
    @Output() readonly menuClosed: EventEmitter<void> = new EventEmitter<void>();

    constructor(
        overlay: Overlay,
        element: ElementRef<HTMLElement>,
        viewContainerRef: ViewContainerRef,
        scrollStrategy: any,
        parentMenu: CuteMenuPanel,
        menuItemInstance: CuteMenuItem,
        dir: Directionality,
        focusMonitor: FocusMonitor,
        ngZone: NgZone,
    );

    /**
     * @deprecated `focusMonitor` will become a required parameter.
     * @breaking-change 8.0.0
     */
    constructor(
        overlay: Overlay,
        element: ElementRef<HTMLElement>,
        viewContainerRef: ViewContainerRef,
        scrollStrategy: any,
        parentMenu: CuteMenuPanel,
        menuItemInstance: CuteMenuItem,
        dir: Directionality,
        focusMonitor?: FocusMonitor | null,
    );

    /**
     * @deprecated `ngZone` will become a required parameter.
     * @breaking-change 15.0.0
     */
    constructor(
        overlay: Overlay,
        element: ElementRef<HTMLElement>,
        viewContainerRef: ViewContainerRef,
        scrollStrategy: any,
        parentMenu: CuteMenuPanel,
        menuItemInstance: CuteMenuItem,
        dir: Directionality,
        focusMonitor: FocusMonitor,
    );

    constructor(
        private _overlay: Overlay,
        private _element: ElementRef<HTMLElement>,
        private _viewContainerRef: ViewContainerRef,
        @Inject(CUTE_MENU_SCROLL_STRATEGY) scrollStrategy: any,
        @Inject(CUTE_MENU_PANEL) @Optional() parentMenu: CuteMenuPanel,
        // `CuteMenuTrigger` is commonly used in combination with a `CuteMenuItem`.
        // tslint:disable-next-line: lightweight-tokens
        @Optional() @Self() private _menuItemInstance: CuteMenuItem,
        @Optional() private _dir: Directionality,
        private _focusMonitor: FocusMonitor | null,
        private _ngZone?: NgZone,
    ) {
        this._scrollStrategy = scrollStrategy;
        this._parentCuteMenu = parentMenu instanceof CuteMenu ? parentMenu : undefined;

        _element.nativeElement.addEventListener(
            'touchstart',
            this._handleTouchStart,
            passiveEventListenerOptions,
        );
    }

    ngAfterContentInit() {
        this._handleHover();
    }

    ngOnDestroy() {
        if (this._overlayRef) {
            this._overlayRef.dispose();
            this._overlayRef = null;
        }

        this._element.nativeElement.removeEventListener(
            'touchstart', this._handleTouchStart, passiveEventListenerOptions,
        );

        this._menuCloseSubscription.unsubscribe();
        this._closingActionsSubscription.unsubscribe();
        this._hoverSubscription.unsubscribe();
    }

    /** Whether the menu is open. */
    get menuOpen(): boolean {
        return this._menuOpen;
    }

    /** The text direction of the containing app. */
    get dir(): Direction {
        return this._dir && this._dir.value === 'rtl' ? 'rtl' : 'ltr';
    }

    get elementRef(): Readonly<ElementRef<HTMLElement>> {
      return this._element;
    }

    /** Whether the menu triggers a submenu or a top-level one. */
    triggersSubmenu(): boolean {
        return !!(this._menuItemInstance && this._parentCuteMenu && this.menu);
    }

    /** Toggles the menu between the open and closed states. */
    toggleMenu(): void {
        return this._menuOpen ? this.closeMenu() : this.openMenu();
    }

    /** Opens the menu. */
    openMenu(): void {
        const menu = this.menu;

        if (this._menuOpen || !menu) {
            return;
        }

        const overlayRef = this._createOverlay(menu);
        const overlayConfig = overlayRef.getConfig();
        const positionStrategy = overlayConfig.positionStrategy as FlexibleConnectedPositionStrategy;

        this._setPosition(menu, positionStrategy);
        overlayConfig.hasBackdrop =
            menu.hasBackdrop == null ? !this.triggersSubmenu() : menu.hasBackdrop;
        overlayRef.attach(this._getPortal(menu));

        if (menu.lazyContent) {
            menu.lazyContent.attach(this.menuData);
        }

        this._closingActionsSubscription = this._menuClosingActions().subscribe(() => this.closeMenu());
        this._initMenu(menu);

        if (menu instanceof CuteMenu) {
            menu._startAnimation();
            menu._directDescendantItems.changes.pipe(takeUntil(menu.closed)).subscribe(() => {
                // Re-adjust the position without locking when the number of items
                // changes so that the overlay is allowed to pick a new optimal position.
                positionStrategy.withLockedPosition(false).reapplyLastPosition();
                positionStrategy.withLockedPosition(true);
            });
        }
    }

    /** Closes the menu. */
    closeMenu(): void {
        this.menu?.closed.emit();
    }

    /**
     * Focuses the menu trigger.
     * @param origin Source of the menu trigger's focus.
     * @param options Focus options
     */
    focus(origin?: FocusOrigin, options?: FocusOptions) {
        if (this._focusMonitor && origin) {
            this._focusMonitor.focusVia(this._element, origin, options);
        } else {
            this._element.nativeElement.focus(options);
        }
    }

    /**
     * Updates the position of the menu to ensure that it fits all options within the viewport.
     */
    updatePosition(): void {
        this._overlayRef?.updatePosition();
    }

    /** Closes the menu and does the necessary cleanup. */
    private _destroyMenu(reason: MenuCloseReason) {
        if (!this._overlayRef || !this.menuOpen) {
            return;
        }

        const menu = this.menu;
        this._closingActionsSubscription.unsubscribe();
        this._overlayRef.detach();

        // Always restore focus if the user is navigating using the keyboard or the menu was opened
        // programmatically. We don't restore for non-root triggers, because it can prevent focus
        // from making it back to the root trigger when closing a long chain of menus by clicking
        // on the backdrop.
        if (this.restoreFocus && (reason === 'keydown' || !this._openedBy || !this.triggersSubmenu())) {
            this.focus(this._openedBy);
        }

        this._openedBy = undefined;

        if (menu instanceof CuteMenu) {
            menu._resetAnimation();

            if (menu.lazyContent) {
                // Wait for the exit animation to finish before detaching the content.
                menu._animationDone
                    .pipe(
                        filter(event => event.toState === 'void'),
                        take(1),
                        // Interrupt if the content got re-attached.
                        takeUntil(menu.lazyContent._attached),
                    )
                    .subscribe({
                        next: () => menu.lazyContent!.detach(),
                        // No matter whether the content got re-attached, reset the menu.
                        complete: () => this._setIsMenuOpen(false),
                    });
            } else {
                this._setIsMenuOpen(false);
            }
        } else {
            this._setIsMenuOpen(false);
            menu?.lazyContent?.detach();
        }
    }

    /**
     * This method sets the menu state to open and focuses the first item if
     * the menu was opened via the keyboard.
     */
    private _initMenu(menu: CuteMenuPanel): void {
        menu.parentMenu = this.triggersSubmenu() ? this._parentCuteMenu : undefined;
        menu.direction = this.dir;
        this._setMenuElevation(menu);
        menu.focusFirstItem(this._openedBy || 'program');
        this._setIsMenuOpen(true);
    }

    /** Updates the menu elevation based on the amount of parent menus that it has. */
    private _setMenuElevation(menu: CuteMenuPanel): void {
        if (menu.setElevation) {
            let depth = 0;
            let parentMenu = menu.parentMenu;

            while (parentMenu) {
                depth++;
                parentMenu = parentMenu.parentMenu;
            }

            menu.setElevation(depth);
        }
    }

    // set state rather than toggle to support triggers sharing a menu
    private _setIsMenuOpen(isOpen: boolean): void {
        if (isOpen !== this._menuOpen) {
            this._menuOpen = isOpen;
            this._menuOpen ? this.menuOpened.emit() : this.menuClosed.emit();

            if (this.triggersSubmenu()) {
                this._menuItemInstance._setHighlighted(isOpen);
            }

            this._changeDetectorRef.markForCheck();
        }
    }

    /**
     * This method creates the overlay from the provided menu's template and saves its
     * OverlayRef so that it can be attached to the DOM when openMenu is called.
     */
    private _createOverlay(menu: CuteMenuPanel): OverlayRef {
        if (!this._overlayRef) {
            const config = this._getOverlayConfig(menu);
            this._subscribeToPositions(
                menu,
                config.positionStrategy as FlexibleConnectedPositionStrategy,
            );
            this._overlayRef = this._overlay.create(config);

            // Consume the `keydownEvents` in order to prevent them from going to another overlay.
            // Ideally we'd also have our keyboard event logic in here, however doing so will
            // break anybody that may have implemented the `CuteMenuPanel` themselves.
            this._overlayRef.keydownEvents().subscribe();
        }

        return this._overlayRef;
    }

    /**
     * This method builds the configuration object needed to create the overlay, the OverlayState.
     * @returns OverlayConfig
     */
    private _getOverlayConfig(menu: CuteMenuPanel): OverlayConfig {
        return new OverlayConfig({
            positionStrategy: this._overlay
                .position()
                .flexibleConnectedTo(this._element)
                .withLockedPosition()
                .withGrowAfterOpen()
                .withTransformOriginOn('.cute-menu-panel'),
            backdropClass: menu.backdropClass || 'cdk-overlay-transparent-backdrop',
            panelClass: menu.overlayPanelClass,
            scrollStrategy: this._scrollStrategy(),
            direction: this._dir,
        });
    }

    /**
     * Listens to changes in the position of the overlay and sets the correct classes
     * on the menu based on the new position. This ensures the animation origin is always
     * correct, even if a fallback position is used for the overlay.
     */
    private _subscribeToPositions(menu: CuteMenuPanel, position: FlexibleConnectedPositionStrategy) {
        if (menu.setPositionClasses) {
            position.positionChanges.subscribe(change => {
                const posX: MenuPositionX = change.connectionPair.overlayX === 'start' ? 'after' : 'before';
                const posY: MenuPositionY = change.connectionPair.overlayY === 'top' ? 'below' : 'above';

                // @breaking-change 15.0.0 Remove null check for `ngZone`.
                // `positionChanges` fires outside of the `ngZone` and `setPositionClasses` might be
                // updating something in the view, so we need to bring it back in.
                if (this._ngZone) {
                    this._ngZone.run(() => menu.setPositionClasses!(posX, posY));
                } else {
                    menu.setPositionClasses!(posX, posY);
                }
            });
        }
    }

    /**
     * Sets the appropriate positions on a position strategy
     * so the overlay connects with the trigger correctly.
     * @param menu Menu panel
     * @param positionStrategy Strategy whose position is to update.
     */
    private _setPosition(menu: CuteMenuPanel, positionStrategy: FlexibleConnectedPositionStrategy) {
        let [originX, originFallbackX]: HorizontalConnectionPos[] =
            menu.xPosition === 'before' ? ['end', 'start'] : ['start', 'end'];

        let [overlayY, overlayFallbackY]: VerticalConnectionPos[] =
            menu.yPosition === 'above' ? ['bottom', 'top'] : ['top', 'bottom'];

        let [originY, originFallbackY] = [overlayY, overlayFallbackY];
        let [overlayX, overlayFallbackX] = [originX, originFallbackX];
        let offsetY = 0;

        if (this.triggersSubmenu()) {
            // When the menu is a submenu, it should always align itself
            // to the edges of the trigger, instead of overlapping it.
            overlayFallbackX = originX = menu.xPosition === 'before' ? 'start' : 'end';
            originFallbackX = overlayX = originX === 'end' ? 'start' : 'end';

            if (this._parentCuteMenu) {
                if (this._parentInnerPadding == null) {
                    const firstItem = this._parentCuteMenu.items?.first;
                    this._parentInnerPadding = firstItem ? firstItem._getHostElement().offsetTop : 0;
                }

                offsetY = overlayY === 'bottom' ? this._parentInnerPadding : -this._parentInnerPadding;
            }
        } else if (!menu.overlapTrigger) {
            offsetY = 4;
            originY = overlayY === 'top' ? 'bottom' : 'top';
            originFallbackY = overlayFallbackY === 'top' ? 'bottom' : 'top';
        }

        positionStrategy.withPositions([
            {originX, originY, overlayX, overlayY, offsetY},
            {originX: originFallbackX, originY, overlayX: overlayFallbackX, overlayY, offsetY},
            {
                originX,
                originY: originFallbackY,
                overlayX,
                overlayY: overlayFallbackY,
                offsetY: -offsetY,
            },
            {
                originX: originFallbackX,
                originY: originFallbackY,
                overlayX: overlayFallbackX,
                overlayY: overlayFallbackY,
                offsetY: -offsetY,
            },
        ]);
    }

    /** Returns a stream that emits whenever an action that should close the menu occurs. */
    private _menuClosingActions() {
        const backdrop = this._overlayRef!.backdropClick();
        const detachments = this._overlayRef!.detachments();
        const parentClose = this._parentCuteMenu ? this._parentCuteMenu.closed : observableOf();
        const hover = this._parentCuteMenu
            ? this._parentCuteMenu._hovered().pipe(
                filter(active => active !== this._menuItemInstance),
                filter(() => this._menuOpen),
            )
            : observableOf();

        return merge(backdrop, parentClose as Observable<MenuCloseReason>, hover, detachments);
    }

    /** Handles mouse presses on the trigger. */
    _handleMousedown(event: MouseEvent): void {
        if (!isFakeMousedownFromScreenReader(event)) {
            // Since right or middle button clicks won't trigger the `click` event,
            // we shouldn't consider the menu as opened by mouse in those cases.
            this._openedBy = event.button === 0 ? 'mouse' : undefined;

            // Since clicking on the trigger won't close the menu if it opens a submenu,
            // we should prevent focus from moving onto it via click to avoid the
            // highlight from lingering on the menu item.
            if (this.triggersSubmenu()) {
                event.preventDefault();
            }
        }
    }

    /** Handles key presses on the trigger. */
    _handleKeydown(event: KeyboardEvent): void {
        const keyCode = event.keyCode;

        // Pressing enter on the trigger will trigger the click handler later.
        if (keyCode === ENTER || keyCode === SPACE) {
            this._openedBy = 'keyboard';
        }

        if (
            this.triggersSubmenu() &&
            ((keyCode === RIGHT_ARROW && this.dir === 'ltr') ||
                (keyCode === LEFT_ARROW && this.dir === 'rtl'))
        ) {
            this._openedBy = 'keyboard';
            this.openMenu();
        }
    }

    /** Handles click events on the trigger. */
    _handleClick(event: MouseEvent): void {
        if (this.triggersSubmenu()) {
            // Stop event propagation to avoid closing the parent menu.
            event.stopPropagation();
            this.openMenu();
        } else {
            this.toggleMenu();
        }
    }

    /** Handles the cases where the user hovers over the trigger. */
    private _handleHover() {
        // Subscribe to changes in the hovered item in order to toggle the panel.
        if (!this.triggersSubmenu() || !this._parentCuteMenu) {
            return;
        }

        this._hoverSubscription = this._parentCuteMenu
            ._hovered()
            // Since we might have multiple competing triggers for the same menu (e.g. a sub-menu
            // with different data and triggers), we have to delay it by a tick to ensure that
            // it won't be closed immediately after it is opened.
            .pipe(
                filter(active => active === this._menuItemInstance && !active.disabled),
                delay(0, asapScheduler),
            )
            .subscribe(() => {
                this._openedBy = 'mouse';

                // If the same menu is used between multiple triggers, it might still be animating
                // while the new trigger tries to re-open it. Wait for the animation to finish
                // before doing so. Also interrupt if the user moves to another item.
                if (this.menu instanceof CuteMenu && this.menu._isAnimating) {
                    // We need the `delay(0)` here in order to avoid
                    // 'changed after checked' errors in some cases. See #12194.
                    this.menu._animationDone
                        .pipe(take(1), delay(0, asapScheduler), takeUntil(this._parentCuteMenu!._hovered()))
                        .subscribe(() => this.openMenu());
                } else {
                    this.openMenu();
                }
            });
    }

    /** Gets the portal that should be attached to the overlay. */
    private _getPortal(menu: CuteMenuPanel): TemplatePortal {
        // Note that we can avoid this check by keeping the portal on the menu panel.
        // While it would be cleaner, we'd have to introduce another required method on
        // `CuteMenuPanel`, making it harder to consume.
        if (!this._portal || this._portal.templateRef !== menu.templateRef) {
            this._portal = new TemplatePortal(menu.templateRef, this._viewContainerRef);
        }

        return this._portal;
    }
}
