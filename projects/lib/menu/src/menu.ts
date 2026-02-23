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
  AfterContentInit,
  ChangeDetectionStrategy,
  Component,
  ContentChild,
  ContentChildren,
  ElementRef,
  EventEmitter,
  InjectionToken,
  Input,
  OnDestroy,
  Output,
  TemplateRef,
  QueryList,
  ViewChild,
  ViewEncapsulation,
  OnInit,
  ChangeDetectorRef,
  booleanAttribute, isDevMode, inject, Injector, AfterRenderRef, afterNextRender, signal,
} from '@angular/core';
import {FocusKeyManager, FocusOrigin} from '@angular/cdk/a11y';
import {Direction} from '@angular/cdk/bidi';
import {
  ESCAPE,
  LEFT_ARROW,
  RIGHT_ARROW,
  DOWN_ARROW,
  UP_ARROW,
  hasModifierKey,
} from '@angular/cdk/keycodes';
import {merge, Observable, Subject} from 'rxjs';
import {startWith, switchMap} from 'rxjs/operators';
import {CuteMenuItem} from './menu-item';
import {CuteMenuPanel, CUTE_MENU_PANEL} from './menu-panel';
import {MenuPositionX, MenuPositionY} from './menu-positions';
import {throwCuteMenuInvalidPositionX, throwCuteMenuInvalidPositionY} from './menu-errors';
import {CuteMenuContent, CUTE_MENU_CONTENT} from './menu-content';
import {_animationsDisabled} from '@cute-widgets/base/core';
import {CdkMenu} from "@angular/cdk/menu";

let menuPanelUid = 0;

export type MenuShadowElevation = 0|1|2|3;

/** Reason why the menu was closed. */
export type MenuCloseReason = void | 'click' | 'keydown' | 'tab';

/** Default `cute-menu` options that can be overridden. */
export interface CuteMenuDefaultOptions {
  /** The x-axis position of the menu. */
  xPosition: MenuPositionX;

  /** The y-axis position of the menu. */
  yPosition: MenuPositionY;

  /** Whether the menu should overlap the menu trigger. */
  overlapTrigger: boolean;

  /** Class to be applied to the menu's backdrop. */
  backdropClass: string;

  /** Class or list of classes to be applied to the menu's overlay panel. */
  overlayPanelClass?: string | string[];

  /** Whether the menu has a backdrop. */
  hasBackdrop?: boolean;
}

/** Injection token to be used to override the default options for `mat-menu`. */
export const CUTE_MENU_DEFAULT_OPTIONS = new InjectionToken<CuteMenuDefaultOptions>(
  'cute-menu-default-options',
  {
    providedIn: 'root',
    factory: () => ({
      overlapTrigger: false,
      xPosition: 'after',
      yPosition: 'below',
      backdropClass: 'cdk-overlay-transparent-backdrop',
    }),
  },
);

/** Name of the enter animation `@keyframes`. */
const ENTER_ANIMATION = '_cute-menu-enter';

/** Name of the exit animation `@keyframes`. */
const EXIT_ANIMATION = '_cute-menu-exit';

@Component({
  selector: 'cute-menu',
  templateUrl: './menu.html',
  styleUrls: ['./menu.scss'],
  exportAs: 'cuteMenu',
  host: {
    'class': 'cute-menu',
    '[attr.aria-label]': 'null',
    '[attr.aria-labelledby]': 'null',
    '[attr.aria-describedby]': 'null',
  },
  providers: [{provide: CUTE_MENU_PANEL, useExisting: CuteMenu}],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  hostDirectives: [CdkMenu]
})
export class CuteMenu implements CuteMenuPanel<CuteMenuItem>, AfterContentInit, OnInit, OnDestroy {
  private _elementRef = inject<ElementRef<HTMLElement>>(ElementRef);
  private _changeDetectorRef = inject(ChangeDetectorRef);
  private _injector = inject(Injector);

  private _keyManager: FocusKeyManager<CuteMenuItem> | undefined;
  private _xPosition: MenuPositionX;
  private _yPosition: MenuPositionY;
  private _firstItemFocusRef?: AfterRenderRef;
  private _exitFallbackTimeout: ReturnType<typeof setTimeout> | undefined;

  private _previousElevation: string | undefined;
  private _elevationPrefix = 'shadow';
  private _baseElevation: MenuShadowElevation = 1;

  protected _animationsDisabled = _animationsDisabled();

  /** All items inside the menu. Includes items nested inside another menu. */
  @ContentChildren(CuteMenuItem, {descendants: true}) _allItems: QueryList<CuteMenuItem> | undefined;

  /** Only the direct descendant menu items. */
  _directDescendantItems = new QueryList<CuteMenuItem>();

  /** Config object to be passed into the menu's ngClass */
  protected _classList: {[key: string]: boolean} = {};

  /** Current state of the panel animation. */
  _panelAnimationState: 'void' | 'enter' = 'void';

  /** Emits whenever an animation on the menu completes. */
  readonly _animationDone = new Subject<'void' | 'enter'>();

  /** Whether the menu is animating. */
  _isAnimating = signal(false);

  /** Parent menu of the current menu panel. */
  parentMenu: CuteMenuPanel | undefined;

  /** Layout direction of the menu. */
  direction: Direction | undefined;

  /** Class or list of classes to be added to the overlay panel. */
  overlayPanelClass: string | string[];

  /** Class to be added to the backdrop element. */
  @Input() backdropClass: string;

  /** aria-label for the menu panel. */
  @Input('aria-label') ariaLabel: string | undefined;

  /** aria-labelledby for the menu panel. */
  @Input('aria-labelledby') ariaLabelledby: string | undefined;

  /** aria-describedby for the menu panel. */
  @Input('aria-describedby') ariaDescribedby: string | undefined;

  /** Position of the menu in the X axis. */
  @Input()
  get xPosition(): MenuPositionX { return this._xPosition; }
  set xPosition(value: MenuPositionX) {
    if (
      value !== 'before' &&
      value !== 'after' &&
      isDevMode()
    ) {
      throwCuteMenuInvalidPositionX();
    }
    this._xPosition = value;
    this.setPositionClasses();
  }

  /** Position of the menu in the Y axis. */
  @Input()
  get yPosition(): MenuPositionY { return this._yPosition; }
  set yPosition(value: MenuPositionY) {
    if (value !== 'above' && value !== 'below' && isDevMode()) {
      throwCuteMenuInvalidPositionY();
    }
    this._yPosition = value;
    this.setPositionClasses();
  }

  /** Whether the menu should overlap its trigger. */
  @Input({transform: booleanAttribute})
  overlapTrigger: boolean;

  /** Whether the menu has a backdrop. */
  @Input({transform: (value: any) => (value == null ? null : booleanAttribute(value))})
  hasBackdrop?: boolean;

  /** @docs-private */
  @ViewChild(TemplateRef)
  templateRef!: TemplateRef<any>;

  /**
   * List of the items inside a menu.
   * @deprecated
   * @breaking-change 8.0.0
   */
  @ContentChildren(CuteMenuItem, {descendants: false})
  items: QueryList<CuteMenuItem> | undefined;

  /**
   * Menu content that will be rendered lazily.
   */
  @ContentChild(CUTE_MENU_CONTENT)
  lazyContent: CuteMenuContent | undefined;

  /**
   * This method takes classes set on the host cute-menu element and applies them on the
   * menu template that displays in the overlay container.  Otherwise, it's difficult
   * to style the containing menu from outside the component.
   * @param classes list of class names
   */
  @Input('class')
  set panelClass(classes: string) {
    const previousPanelClass = this._previousPanelClass;
    const newClassList = {...this._classList};

    if (previousPanelClass && previousPanelClass.length) {
      previousPanelClass.split(' ').forEach((className: string) => {
        newClassList[className] = false;
      });
    }

    this._previousPanelClass = classes;

    if (classes && classes.length) {
      classes.split(' ').forEach((className: string) => {
        newClassList[className] = true;
      });

      this._elementRef.nativeElement.className = '';
    }

    this._classList = newClassList;
  }
  private _previousPanelClass: string | undefined;

  /** Event emitted when the menu is closed. */
  @Output() readonly closed: EventEmitter<MenuCloseReason> = new EventEmitter<MenuCloseReason>();

  readonly panelId = `cute-menu-panel-${menuPanelUid++}`;

  constructor(...args: unknown[]);
  constructor() {
    const defaultOptions = inject<CuteMenuDefaultOptions>(CUTE_MENU_DEFAULT_OPTIONS);
    this.overlayPanelClass = defaultOptions.overlayPanelClass || '';
    this._xPosition = defaultOptions.xPosition;
    this._yPosition = defaultOptions.yPosition;
    this.backdropClass = defaultOptions.backdropClass;
    this.overlapTrigger = defaultOptions.overlapTrigger;
    this.hasBackdrop = defaultOptions.hasBackdrop;
  }

  ngOnInit() {
    this.setPositionClasses();
  }

  ngAfterContentInit() {
    this._updateDirectDescendants();
    this._keyManager = new FocusKeyManager(this._directDescendantItems)
      .withWrap()
      .withTypeAhead()
      .withHomeAndEnd();
    this._keyManager.tabOut.subscribe(() => this.closed.emit('tab'));

    // If a user manually (programmatically) focuses a menu item, we need to reflect that focus
    // change back to the key manager. Note that we don't need to unsubscribe here because _focused
    // is internal, and we know that it gets completed on destroying.
    this._directDescendantItems.changes
      .pipe(
        startWith(this._directDescendantItems),
        switchMap(items => merge(...items.map((item: CuteMenuItem) => item._focused))),
      )
      .subscribe(focusedItem => this._keyManager?.updateActiveItem(focusedItem as CuteMenuItem));

    this._directDescendantItems.changes.subscribe((itemsList: QueryList<CuteMenuItem>) => {
      // Move focus to another item if the active item is removed from the list.
      // We need to debounce the callback because multiple items might be removed
      // in quick succession.
      const manager = this._keyManager;

      if (manager && this._panelAnimationState === 'enter' && manager.activeItem?._hasFocus()) {
        const items = itemsList.toArray();
        const index = Math.max(0, Math.min(items.length - 1, manager.activeItemIndex || 0));

        if (items[index] && !items[index].disabled) {
          manager.setActiveItem(index);
        } else {
          manager.setNextItemActive();
        }
      }
    });
  }

  ngOnDestroy() {
    this._keyManager?.destroy();
    this._directDescendantItems.destroy();
    this.closed.complete();
    this._firstItemFocusRef?.destroy();
    clearTimeout(this._exitFallbackTimeout);
  }

  /** Stream that emits whenever the hovered menu item changes. */
  _hovered(): Observable<CuteMenuItem> {
    // Coerce the `changes` property because Angular types it as `Observable<any>`
    const itemChanges = this._directDescendantItems.changes as Observable<QueryList<CuteMenuItem>>;
    return itemChanges.pipe(
      startWith(this._directDescendantItems),
      switchMap(items => merge(...items.map((item: CuteMenuItem) => item._hovered))),
    ) as Observable<CuteMenuItem>;
  }

  /** Handle a keyboard event from the menu, delegating to the appropriate action. */
  _handleKeydown(event: KeyboardEvent) {
    const keyCode = event.keyCode;
    const manager = this._keyManager;

    switch (keyCode) {
      case ESCAPE:
        if (!hasModifierKey(event)) {
          event.preventDefault();
          this.closed.emit('keydown');
        }
        break;
      case LEFT_ARROW:
        if (this.parentMenu && this.direction === 'ltr') {
          this.closed.emit('keydown');
        }
        break;
      case RIGHT_ARROW:
        if (this.parentMenu && this.direction === 'rtl') {
          this.closed.emit('keydown');
        }
        break;
      default:
        if (keyCode === UP_ARROW || keyCode === DOWN_ARROW) {
          manager?.setFocusOrigin('keyboard');
        }

        manager?.onKeydown(event);
        return;
    }

    // Don't allow the event to propagate if we've already handled it, or it may
    // end up reaching other overlays that were opened earlier (see #22694).
    event.stopPropagation();
  }

  /**
   * Handle a mouse event from the menu, delegating to the appropriate action.
   * @param event
   */
  protected onClick(event: MouseEvent) {
    // Prevent menu closing if a user clicks on a divider/separator or beyond of any menu item (margins, for example)
    const el = event.target as HTMLElement;
    if (el.classList.contains("cute-menu-content") || el.role == "separator") {
      event.preventDefault();
      event.stopPropagation();
      return;
    }
    this.closed.emit('click');
  }

  /**
   * Focus the first item in the menu.
   * @param origin Action from which the focus originated. Used to set the correct styling.
   */
  focusFirstItem(origin: FocusOrigin = 'program'): void {
    // Wait for `afterNextRender` to ensure iOS VoiceOver screen reader focuses the first item (#24735).
    this._firstItemFocusRef?.destroy();
    this._firstItemFocusRef = afterNextRender(
      () => {
        const menuPanel = this._resolvePanel();

        // If an item in the menuPanel is already focused, avoid overriding the focus.
        if (!menuPanel || !menuPanel.contains(document.activeElement)) {
          const manager = this._keyManager;
          if (manager) {
            manager.setFocusOrigin(origin).setFirstItemActive();

            // If there's no active item at this point, it means that all the items are disabled.
            // Move focus to the menuPanel panel so keyboard events like Escape still work. Also this will
            // give _some_ feedback to screen readers.
            if (!manager.activeItem && menuPanel) {
              menuPanel.focus();
            }
          }
        }
      },
      {injector: this._injector},
    );
  }

  /**
   * Resets the active item in the menu. This is used when the menu is opened, allowing
   * the user to start from the first option when pressing the down arrow.
   */
  resetActiveItem() {
    this._keyManager?.setActiveItem(-1);
  }

  /**
   * Sets the menu panel elevation.
   * @param depth Number of parent menus that come before the menu.
   */
  setElevation(depth: number): void {
    // The elevation starts at the base and increases by one for each level.
    // Capped at 3 because that's the maximum elevation defined in the Bootstrap design spec.
    const elevation = Math.min(this._baseElevation + depth, 3);
    let suffix = "";
    if (elevation == 0) {
      suffix = "-none";
    } else if (elevation == 1) {
      suffix = "-sm";
    }  else if (elevation == 3) {
      suffix = "-lg";
    }
    const newElevation = `${this._elevationPrefix}${suffix}`;
    const customElevation = Object.keys(this._classList).find(className => {
      return className.startsWith(this._elevationPrefix);
    });

    if (!customElevation || customElevation === this._previousElevation) {
      if (this._previousElevation) {
        this._classList[this._previousElevation] = false;
      }

      this._classList[newElevation] = true;
      this._previousElevation = newElevation;

      this._classList = {...this._classList};
    }
  }

  /**
   * Adds classes to the menu panel based on its position. Can be used by
   * consumers to add specific styling based on the position.
   * @param posX Position of the menu along the x-axis.
   * @param posY Position of the menu along the y-axis.
   */
  setPositionClasses(posX: MenuPositionX = this.xPosition, posY: MenuPositionY = this.yPosition) {
    const classes = this._classList;
    classes['cute-menu-before'] = posX === 'before';
    classes['cute-menu-after'] = posX === 'after';
    classes['cute-menu-above'] = posY === 'above';
    classes['cute-menu-below'] = posY === 'below';

    this._changeDetectorRef.markForCheck();
  }

  /** Callback that is invoked when the panel animation completes. */
  _onAnimationDone(state: string) {
    const isExit = state === EXIT_ANIMATION;

    if (isExit || state === ENTER_ANIMATION) {
      if (isExit) {
        clearTimeout(this._exitFallbackTimeout);
        this._exitFallbackTimeout = undefined;
      }
      this._animationDone.next(isExit ? 'void' : 'enter');
      this._isAnimating.set(false);
    }
  }

  _onAnimationStart(state: string) {
    if (state === ENTER_ANIMATION || state === EXIT_ANIMATION) {
      this._isAnimating.set(true);
    }
  }

  _setIsOpen(isOpen: boolean) {
    this._panelAnimationState = isOpen ? 'enter' : 'void';

    if (isOpen) {
      if (this._keyManager?.activeItemIndex === 0) {
        // Scroll the content element to the top as soon as the animation starts. This is necessary,
        // because we move focus to the first item while it's still being animated, which can throw
        // the browser off when it determines the scroll position. Alternatively we can move focus
        // when the animation is done, however moving focus asynchronously will interrupt screen
        // readers which are in the process of reading out the menu already. We take the `element`
        // from the `event` since we can't use a `ViewChild` to access the pane.
        const menuPanel = this._resolvePanel();

        if (menuPanel) {
          menuPanel.scrollTop = 0;
        }
      }
    } else if (!this._animationsDisabled) {
      // Some apps do `* { animation: none !important; }` in tests which will prevent the
      // `animationend` event from firing. Since the exit animation is loading-bearing for
      // removing the content from the DOM, add a fallback timer.
      this._exitFallbackTimeout = setTimeout(() => this._onAnimationDone(EXIT_ANIMATION), 200);
    }

    // Animation events won't fire when animations are disabled so we simulate them.
    if (this._animationsDisabled) {
      setTimeout(() => {
        this._onAnimationDone(isOpen ? ENTER_ANIMATION : EXIT_ANIMATION);
      });
    }

    this._changeDetectorRef.markForCheck();
  }

  /**
   * Sets up a stream that will keep track of any newly-added menu items and will update the list
   * of direct descendants. We collect the descendants this way, because `_allItems` can include
   * items that are part of child menus, and using a custom way of registering items is unreliable
   * when it comes to maintaining the item order.
   */
  private _updateDirectDescendants() {
    this._allItems?.changes
      .pipe(startWith(this._allItems))
      .subscribe((items: QueryList<CuteMenuItem>) => {
        this._directDescendantItems.reset(items.filter(item => item._parentMenu === this));
        this._directDescendantItems.notifyOnChanges();
      });
  }

  /** Gets the menu panel DOM node. */
  private _resolvePanel(): HTMLElement | null {
    let menuPanel: HTMLElement | null = null;

    if (this._directDescendantItems.length) {
      // Because the `cute-menuPanel` is at the DOM insertion point, not inside the overlay, we don't
      // have a nice way of getting a hold of the menuPanel panel. We can't use a `ViewChild` either
      // because the panel is inside an `ng-template`. We work around it by starting from one of
      // the items and walking up the DOM.
      menuPanel = this._directDescendantItems.first!._getHostElement().closest('[role="menu"]');
    }

    return menuPanel;
  }
}
