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
  FocusTrap,
  FocusTrapFactory,
  InteractivityChecker,
} from '@angular/cdk/a11y';
import {Directionality} from '@angular/cdk/bidi';
import {BooleanInput, coerceBooleanProperty} from '@angular/cdk/coercion';
import {ESCAPE, hasModifierKey} from '@angular/cdk/keycodes';
import {Platform} from '@angular/cdk/platform';
import {CdkScrollable, ScrollDispatcher, ViewportRuler} from '@angular/cdk/scrolling';
import {
  AfterContentInit,
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ContentChild,
  ContentChildren,
  DoCheck,
  ElementRef,
  EventEmitter,
  InjectionToken,
  Input, isDevMode,
  NgZone,
  OnDestroy,
  Output,
  QueryList,
  ViewChild,
  ViewEncapsulation,
  DOCUMENT, inject, Injector, afterNextRender, signal
} from '@angular/core';
import {merge, Observable, Subject} from 'rxjs';
import {
  debounceTime,
  filter,
  map,
  startWith,
  take,
  takeUntil,
} from 'rxjs/operators';
import {_animationsDisabled} from "@cute-widgets/base/core/animation";
import {CuteLayoutControl, Expandable} from "@cute-widgets/base/abstract";

/**
 * Throws an exception when two CuteDrawer are matching the same position.
 */
export function throwCuteDuplicatedDrawerError(position: string) {
  throw Error(`A drawer was already declared for 'position="${position}"'`);
}

/** Options for where to set focus to automatically on dialog open */
export type AutoFocusTarget = 'dialog' | 'first-tabbable' | 'first-heading';

/** Result of the toggle promise that indicates the state of the drawer. */
export type CuteDrawerToggleResult = 'open' | 'close';

/** Drawer and SideNav display modes. */
export type CuteDrawerMode = 'over' | 'push' | 'side';

/** Configures whether drawers should use auto sizing by default. */
export const CUTE_DRAWER_DEFAULT_AUTOSIZE = new InjectionToken<boolean>(
  'CUTE_DRAWER_DEFAULT_AUTOSIZE',
  {
    providedIn: 'root',
    factory: () => false,
  },
);

/**
 * Used to provide a drawer container to a drawer while avoiding circular references.
 */
export const CUTE_DRAWER_CONTAINER = new InjectionToken('CUTE_DRAWER_CONTAINER');

/**
 * The main content of the 'cute-drawer' component.
 */
@Component({
  selector: 'cute-drawer-content',
  template: '<ng-content></ng-content>',
  host: {
    'class': 'cute-drawer-content',
    '[class.cute-drawer-content-hidden]': '_shouldBeHidden()',
    '[style.margin-left.px]': '_container._contentMargins.left',
    '[style.margin-right.px]': '_container._contentMargins.right',
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  providers: [
    {
      provide: CdkScrollable,
      useExisting: CuteDrawerContent,
    },
  ],
  standalone: true,
})
export class CuteDrawerContent extends CdkScrollable implements AfterContentInit {
  private _platform = inject(Platform);
  private _changeDetectorRef = inject(ChangeDetectorRef);
  _container = inject(CuteDrawerContainer);

  constructor(...args: unknown[]);
  constructor() {
    const elementRef = inject<ElementRef<HTMLElement>>(ElementRef);
    const scrollDispatcher = inject(ScrollDispatcher);
    const ngZone = inject(NgZone);

    super(elementRef, scrollDispatcher, ngZone);
  }

  ngAfterContentInit() {
    this._container._contentMarginChanges
      .pipe(takeUntil(this._destroyed))
      .subscribe(() => {
        this._changeDetectorRef.markForCheck();
      });
  }

  /** Determines whether the content element should be hidden from the user. */
  protected _shouldBeHidden(): boolean {
    // In some modes the content is pushed based on the width of the opened sidenavs, however on
    // the server we can't measure the sidenav so the margin is always zero. This can cause the
    // content to jump around when it's rendered on the server and hydrated on the client. We
    // avoid it by hiding the content on the initial render and then showing it once the sidenav
    // has been measured on the client.
    if (this._platform.isBrowser) {
      return false;
    }

    const {start, end} = this._container;
    return (
      (start != null && start.mode !== 'over' && start.opened) ||
      (end != null && end.mode !== 'over' && end.opened)
    );
  }

}

/**
 * This component corresponds to a drawer that can be opened on the drawer container.
 */
@Component({
  selector: 'cute-drawer',
  exportAs: 'cuteDrawer',
  templateUrl: './drawer.html',
  host: {
    'class': 'cute-drawer',
    // must prevent the browser from aligning text based on value
    '[attr.align]': 'null',
    '[class.cute-drawer-end]': 'position === "end"',
    '[class.cute-drawer-over]': 'mode === "over"',
    '[class.cute-drawer-push]': 'mode === "push"',
    '[class.cute-drawer-side]': 'mode === "side"',
    // The styles that render the sidenav off-screen come from the drawer container. Prior to #30235
    // this was also done by the animations module which some internal tests seem to depend on.
    // Simulate it by toggling the `hidden` attribute instead.
    '[style.visibility]': '(!_container && !opened) ? "hidden" : null',    // The sidenav container should not be focused on when used in side mode. See b/286459024 for
    // reference. Updates tabIndex of drawer/container to default to null if in side mode.
    '[attr.tabIndex]': '(mode !== "side") ? "-1" : null',
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  imports: [CdkScrollable]
})
export class CuteDrawer extends CuteLayoutControl implements Expandable, AfterViewInit, OnDestroy {
  private _focusTrapFactory = inject(FocusTrapFactory);
  private _focusMonitor = inject(FocusMonitor);
  private _platform = inject(Platform);
  private _ngZone = inject(NgZone);
  private readonly _interactivityChecker = inject(InteractivityChecker);
  private _doc = inject(DOCUMENT);
  _container? = inject<CuteDrawerContainer>(CUTE_DRAWER_CONTAINER, {optional: true});

  private _focusTrap: FocusTrap | undefined;
  private _elementFocusedBeforeDrawerWasOpened: HTMLElement | null = null;
  private _eventCleanups: (() => void)[] = [];

  /** Whether the view of the component has been attached. */
  private _isAttached: boolean = false;

  /** Anchor node used to restore the drawer to its initial position. */
  private _anchor: Comment | null = null;

  /** Subject that emits when the component has been destroyed. */
  protected readonly _destroyed = new Subject<void>();

  /** The side that the drawer is attached to. */
  @Input()
  get position(): 'start' | 'end' { return this._position; }
  set position(value: 'start' | 'end') {
    // Make sure we have a valid value.
    value = value === 'end' ? 'end' : 'start';
    if (value !== this._position) {
      // Static inputs in Ivy are set before the element is in the DOM.
      if (this._isAttached) {
        this._updatePositionInParent(value);
      }

      this._position = value;
      this.onPositionChanged.emit();
    }
  }
  private _position: 'start' | 'end' = 'start';

  /** Mode of the drawer; one of 'over', 'push' or 'side'. */
  @Input()
  get mode(): CuteDrawerMode { return this._mode; }
  set mode(value: CuteDrawerMode) {
    this._mode = value;
    this._updateFocusTrapState();
    this._modeChanged.next();
  }
  private _mode: CuteDrawerMode = 'over';

  /** Whether the drawer can be closed with the escape key or by clicking on the backdrop. */
  @Input()
  get disableClose(): boolean { return this._disableClose; }
  set disableClose(value: BooleanInput) {
    this._disableClose = coerceBooleanProperty(value);
  }
  private _disableClose: boolean = false;

  /**
   * Whether the drawer should focus the first focusable element automatically when opened.
   * Defaults to false in when `mode` is set to `side`, otherwise defaults to `true`. If explicitly
   * enabled, focus will be moved into the sidenav in `side` mode as well.
   * @breaking-change 14.0.0 Remove boolean option from autoFocus. Use string or AutoFocusTarget
   * instead.
   */
  @Input()
  get autoFocus(): AutoFocusTarget | string | boolean {
    const value = this._autoFocus;

    // Note that usually we don't allow autoFocus to be set to `first-tabbable` in `side` mode,
    // because we don't know how the sidenav is being used, but in some cases it still makes
    // sense to do it. The consumer can explicitly set `autoFocus`.
    if (value == null) {
      if (this.mode === 'side') {
        return 'dialog';
      } else {
        return 'first-tabbable';
      }
    }
    return value;
  }
  set autoFocus(value: AutoFocusTarget | string | BooleanInput) {
    if (value === 'true' || value === 'false' || value == null) {
      value = coerceBooleanProperty(value);
    }
    this._autoFocus = value;
  }
  private _autoFocus: AutoFocusTarget | string | boolean | undefined;

  /**
   * Whether the drawer is opened. We overload this because we trigger an event when it
   * starts or ends.
   */
  @Input()
  get opened(): boolean { return this._opened(); }
  set opened(value: BooleanInput) {
    this.toggle(coerceBooleanProperty(value));
  }
  private _opened = signal(false);

  /** How the sidenav was opened (keypress, mouse click etc.) */
  private _openedVia: FocusOrigin | null = null;

  /** Emits whenever the drawer has started animating. */
  readonly _animationStarted = new Subject();

  /** Emits whenever the drawer is done animating. */
  readonly _animationEnd = new Subject();

  /** Event emitted when the drawer open state is changed. */
  @Output() readonly openedChange: EventEmitter<boolean> =
    // Note this has to be async to avoid some issues with two-bindings (see #8872).
    new EventEmitter<boolean>(/* isAsync */ true);

  /** Event emitted when the drawer has been opened. */
  @Output('opened')
  readonly _openedStream: Observable<void> = this.openedChange.pipe(
    filter(o => o),
    map(() => {}),
  );

  /** Event emitted when the drawer has started opening. */
  @Output()
  readonly openedStart: Observable<void> = this._animationStarted.pipe(
    filter(() => this.opened),
    map(() => undefined),
  );

  /** Event emitted when the drawer has been closed. */
  @Output('closed')
  readonly _closedStream = this.openedChange.pipe(
    filter(o => !o),
    map(() => {}),
  );

  /** Event emitted when the drawer has started closing. */
  @Output()
  readonly closedStart: Observable<void> = this._animationStarted.pipe(
    filter(() => !this.opened),
    map(()=> undefined),
  );

  /** Event emitted when the drawer's position changes. */
  @Output('positionChanged') readonly onPositionChanged = new EventEmitter<void>();

  /** Reference to the inner element that contains all the content. */
  @ViewChild('content') _content: ElementRef<HTMLElement> | undefined;

  /** Implementation of `Expandable` interface */
  get expanded(): boolean { return this.opened; }

  /**
   * An observable that emits when the drawer mode changes. This is used by the drawer container to know
   * when to when the mode changes, so it can adapt the margins on the content.
   */
  readonly _modeChanged = new Subject<void>();

  private _injector = inject(Injector);

  protected generateId(): string {
    return "";
  }

  constructor(...args: unknown[]);
  constructor() {
    super();
    this.openedChange.pipe(takeUntil(this._destroyed)).subscribe((opened: boolean) => {
      if (opened) {
        this._elementFocusedBeforeDrawerWasOpened = this._doc.activeElement as HTMLElement;
        this._takeFocus();
      } else if (this._isFocusWithinDrawer()) {
        this._restoreFocus(this._openedVia || 'program');
      }
    });

    /**
     * Listen to `keydown` events outside the zone so that change detection is not run every
     * time a key is pressed. Instead, we re-enter the zone only if the `ESC` key is pressed,
     * and we don't have a close disabled.
     */
    this._eventCleanups = this._ngZone.runOutsideAngular(() => {
      const renderer = this._renderer;
      const element = this._elementRef.nativeElement;

      return [
        renderer.listen(element, 'keydown', (event: KeyboardEvent) => {
          if (event.keyCode === ESCAPE && !this.disableClose && !hasModifierKey(event)) {
            this._ngZone.run(() => {
              this.close();
              event.stopPropagation();
              event.preventDefault();
            });
          }
        }),
        renderer.listen(element, 'transitionrun', this._handleTransitionEvent),
        renderer.listen(element, 'transitionend', this._handleTransitionEvent),
        renderer.listen(element, 'transitioncancel', this._handleTransitionEvent),
      ];
    });

    this._animationEnd.subscribe(() => {
      this.openedChange.emit(this.opened);
    });
  }

  /**
   * Focuses the provided element. If the element is not focusable, it will add a tabIndex
   * attribute to forcefully focus it. The attribute is removed after focus is moved.
   * @param element The element to focus.
   * @param options
   */
  private _forceFocus(element: HTMLElement, options?: FocusOptions) {
    if (!this._interactivityChecker.isFocusable(element)) {
      element.tabIndex = -1;
      // The tabindex attribute should be removed to avoid navigating to that element again
      this._ngZone.runOutsideAngular(() => {
        const callback = () => {
          cleanupBlur();
          cleanupMousedown();
          element.removeAttribute('tabindex');
        };

        const cleanupBlur = this._renderer.listen(element, 'blur', callback);
        const cleanupMousedown = this._renderer.listen(element, 'mousedown', callback);
      });
    }
    element.focus(options);
  }

  /**
   * Focuses the first element that matches the given selector within the focus trap.
   * @param selector The CSS selector for the element to set focus to.
   * @param options
   */
  private _focusByCssSelector(selector: string, options?: FocusOptions) {
    let elementToFocus = this._elementRef.nativeElement.querySelector(
      selector,
    ) as HTMLElement | null;
    if (elementToFocus) {
      this._forceFocus(elementToFocus, options);
    }
  }

  /**
   * Moves focus into the drawer. Note that this works even if
   * the focus trap is disabled in `side` mode.
   */
  private _takeFocus() {
    if (!this._focusTrap) {
      return;
    }

    const element = this._elementRef.nativeElement;

    // When autoFocus is not on the sidenav, if the element cannot be focused or does
    // not exist, focus the sidenav itself so the keyboard navigation still works.
    // We need to check that `focus` is a function due to Universal.
    switch (this.autoFocus) {
      case false:
      case 'dialog':
        return;
      case true:
      case 'first-tabbable':
        afterNextRender(
          () => {
            const hasMovedFocus = this._focusTrap!.focusInitialElement();
            if (!hasMovedFocus && typeof element.focus === 'function') {
              element.focus();
            }
          },
          {injector: this._injector},
        );
        break;
      case 'first-heading':
        this._focusByCssSelector('h1, h2, h3, h4, h5, h6, [role="heading"]');
        break;
      default:
        this._focusByCssSelector(this.autoFocus!);
        break;
    }
  }

  /**
   * Restores focus to the element that was originally focused when the drawer opened.
   * If no element was focused at that time, the focus will be restored to the drawer.
   */
  private _restoreFocus(focusOrigin: Exclude<FocusOrigin, null>) {
    if (this.autoFocus === 'dialog') {
      return;
    }

    if (this._elementFocusedBeforeDrawerWasOpened) {
      this._focusMonitor.focusVia(this._elementFocusedBeforeDrawerWasOpened, focusOrigin);
    } else {
      this._elementRef.nativeElement.blur();
    }

    this._elementFocusedBeforeDrawerWasOpened = null;
  }

  /** Whether focus is currently within the drawer. */
  private _isFocusWithinDrawer(): boolean {
    const activeEl = this._doc.activeElement;
    return !!activeEl && this._elementRef.nativeElement.contains(activeEl);
  }

  override ngAfterViewInit() {
    super.ngAfterViewInit();

    this._isAttached = true;

    // Only update the DOM position when the sidenav is positioned at
    // the end since we project the sidenav before the content by default.
    if (this._position === 'end') {
      this._updatePositionInParent('end');
    }

    // Needs to happen after the position is updated
    // so the focus trap anchors are in the right place.
    if (this._platform.isBrowser) {
      this._focusTrap = this._focusTrapFactory.create(this._elementRef.nativeElement);
      this._updateFocusTrapState();
    }
  }

  override ngOnDestroy() {
    super.ngOnDestroy();
    this._eventCleanups.forEach(cleanup => cleanup());
    this._focusTrap?.destroy();
    this._anchor?.remove();
    this._anchor = null;
    this._animationStarted.complete();
    this._animationEnd.complete();
    this._modeChanged.complete();
    this._destroyed.next();
    this._destroyed.complete();
  }

  /**
   * Open the drawer.
   * @param openedVia Whether the drawer was opened by a key press, mouse click or programmatically.
   * Used for focus management after the sidenav is closed.
   */
  open(openedVia?: FocusOrigin): Promise<CuteDrawerToggleResult> {
    return this.toggle(true, openedVia);
  }

  /** Close the drawer. */
  close(): Promise<CuteDrawerToggleResult> {
    return this.toggle(false);
  }

  /** Closes the drawer with context that the backdrop was clicked. */
  _closeViaBackdropClick(): Promise<CuteDrawerToggleResult> {
    // If the drawer is closed upon a backdrop click, we always want to restore focus. We
    // don't need to check whether focus is currently in the drawer, as clicking on the
    // backdrop causes to blur the active element.
    return this._setOpen(/* isOpen */ false, /* restoreFocus */ true, 'mouse');
  }

  /**
   * Toggle this drawer.
   * @param isOpen Whether the drawer should be open.
   * @param openedVia Whether the drawer was opened by a key press, mouse click or programmatically.
   * Used for focus management after the sidenav is closed.
   */
  toggle(isOpen: boolean = !this.opened, openedVia?: FocusOrigin): Promise<CuteDrawerToggleResult> {
    // If the focus is currently inside the drawer content, and we are closing the drawer,
    // restore the focus to the initially focused element (when the drawer opened).
    if (isOpen && openedVia) {
      this._openedVia = openedVia;
    }

    const result = this._setOpen(
      isOpen,
      /* restoreFocus */ !isOpen && this._isFocusWithinDrawer(),
      this._openedVia || 'program',
    );

    if (!isOpen) {
      this._openedVia = null;
    }

    return result;
  }

  /**
   * Toggles the opened state of the drawer.
   * @param isOpen Whether the drawer should open or close.
   * @param restoreFocus Whether focus should be restored on close.
   * @param focusOrigin Origin to use when restoring focus.
   */
  private _setOpen(
    isOpen: boolean,
    restoreFocus: boolean,
    focusOrigin: Exclude<FocusOrigin, null>,
  ): Promise<CuteDrawerToggleResult> {
    if (isOpen === this.opened) {
      return Promise.resolve(isOpen ? 'open' : 'close');
    }

    this._opened.set(isOpen);

    if (this._container?._transitionsEnabled) {
      // Note: it's important to set this as early as possible,
      // otherwise the animation can look glitchy in some cases.
      this._setIsAnimating(true);
    } else {
      // Simulate the animation events if animations are disabled.
      setTimeout(() => {
        this._animationStarted.next(undefined);
        this._animationEnd.next(undefined);
      });
    }

    this._elementRef.nativeElement.classList.toggle('cute-drawer-opened', isOpen);

    if (!isOpen && restoreFocus) {
      this._restoreFocus(focusOrigin);
    }

    // Needed to ensure that the closing sequence fires off correctly.
    this._changeDetectorRef.markForCheck();
    this._updateFocusTrapState();

    return new Promise<CuteDrawerToggleResult>(resolve => {
      this.openedChange.pipe(take(1)).subscribe(open => resolve(open ? 'open' : 'close'));
    });
  }

  /** Toggles whether the drawer is currently animating. */
  private _setIsAnimating(isAnimating: boolean) {
    this._elementRef.nativeElement.classList.toggle('cute-drawer-animating', isAnimating);
  }

  _getWidth(): number {
    return this._elementRef.nativeElement ? this._elementRef.nativeElement.offsetWidth || 0 : 0;
  }

  /** Updates the enabled state of the focus trap. */
  private _updateFocusTrapState() {
    if (this._focusTrap) {
      // Trap focus only if the backdrop is enabled. Otherwise, allow end user to interact with the
      // sidenav content.
      this._focusTrap.enabled = this.opened && !!this._container?._isShowingBackdrop();
    }
  }

  /**
   * Updates the position of the drawer in the DOM. We need to move the element around ourselves
   * when it's in the `end` position so that it comes after the content and the visual order
   * matches the tab order. We also need to be able to move it back to `start` if the sidenav
   * started off as `end` and was changed to `start`.
   */
  private _updatePositionInParent(newPosition: 'start' | 'end') {
    // Don't move the DOM node around on the server, because it can throw off hydration.
    if (!this._platform.isBrowser) {
      return;
    }

    const element = this._elementRef.nativeElement;
    const parent = element.parentNode!;

    if (newPosition === 'end') {
      if (!this._anchor) {
        this._anchor = this._doc.createComment('cute-drawer-anchor')!;
        parent.insertBefore(this._anchor!, element);
      }

      parent.appendChild(element);
    } else if (this._anchor) {
      this._anchor.parentNode!.insertBefore(element, this._anchor);
    }
  }

  /** Event handler for animation events. */
  private _handleTransitionEvent = (event: TransitionEvent) => {
    const element = this._elementRef.nativeElement;

    if (event.target === element) {
      this._ngZone.run(() => {
        if (event.type === 'transitionrun') {
          this._animationStarted.next(event);
        } else {
          // Don't toggle the animating state on `transitioncancel` since another animation should
          // start afterward. This prevents the drawer from blinking if an animation is interrupted.
          if (event.type === 'transitionend') {
            this._setIsAnimating(false);
          }

          this._animationEnd.next(event);
        }
      });
    }
  };
}

/**
 * `<cute-drawer-container>` component.
 *
 * This is the parent component to one or two `<cute-drawer>`s that validates the state internally
 * and coordinates the backdrop and content styling.
 */
@Component({
  selector: 'cute-drawer-container',
  exportAs: 'cuteDrawerContainer',
  templateUrl: './drawer-container.html',
  styleUrls: ['./drawer.scss'],
  host: {
    'class': 'cute-drawer-container',
    '[class.cute-drawer-container-explicit-backdrop]': '_backdropOverride',
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  providers: [
    {
      provide: CUTE_DRAWER_CONTAINER,
      useExisting: CuteDrawerContainer,
    },
  ],
  imports: [CuteDrawerContent]
})
export class CuteDrawerContainer extends CuteLayoutControl implements AfterContentInit, DoCheck, OnDestroy {
  private _dir = inject(Directionality, {optional: true});
  private _element = inject<ElementRef<HTMLElement>>(ElementRef);
  private _ngZone = inject(NgZone);
  private _animationDisabled = _animationsDisabled();
  _transitionsEnabled = false;

  /** All drawers in the container. Includes drawers from inside nested containers. */
  @ContentChildren(CuteDrawer, {
    // We need to use `descendants: true`, because Ivy will no longer match
    // indirect descendants if it's left as false.
    descendants: true,
  })
  _allDrawers: QueryList<CuteDrawer> | undefined;

  /** Drawers that belong to this container. */
  _drawers = new QueryList<CuteDrawer>();

  @ContentChild(CuteDrawerContent) _content: CuteDrawerContent | undefined;
  @ViewChild(CuteDrawerContent) _userContent: CuteDrawerContent | undefined;

  /** The drawer child with the `start` position. */
  get start(): CuteDrawer | null {
    return this._start;
  }

  /** The drawer child with the `end` position. */
  get end(): CuteDrawer | null {
    return this._end;
  }

  /**
   * Whether to automatically resize the container whenever
   * the size of its drawers changes.
   *
   * **Use at your own risk!** Enabling this option can cause layout thrashing by measuring
   * the drawers on every change detection cycle. Can be configured globally via the
   * `CUTE_DRAWER_DEFAULT_AUTOSIZE` token.
   */
  @Input()
  get autosize(): boolean { return this._autosize; }
  set autosize(value: BooleanInput) {
    this._autosize = coerceBooleanProperty(value);
  }
  private _autosize: boolean = false;

  /**
   * Whether the drawer container should have a backdrop while one of the `sidenav`s is open.
   * If explicitly set to `true`, the backdrop will be enabled for drawers in the `side`
   * mode as well.
   */
  @Input()
  get hasBackdrop(): boolean {
    return this._drawerHasBackdrop(this._start) || this._drawerHasBackdrop(this._end);
  }
  set hasBackdrop(value: BooleanInput) {
    this._backdropOverride = value == null ? null : coerceBooleanProperty(value);
  }
  _backdropOverride: boolean | null = null;

  /** Event emitted when the drawer backdrop is clicked. */
  @Output() readonly backdropClick: EventEmitter<void> = new EventEmitter<void>();

  /** The drawer at the start/end position, independent of a direction. */
  private _start: CuteDrawer | null = null;
  private _end: CuteDrawer | null = null;

  /**
   * The drawer at the left/right. When a direction changes, these will change as well.
   * They're used as aliases for the above to set the left/right style properly.
   * In LTR, _left == _start and _right == _end.
   * In RTL, _left == _end and _right == _start.
   */
  private _left: CuteDrawer | null = null;
  private _right: CuteDrawer | null = null;

  /** Emits on every ngDoCheck. Used for debouncing reflows. */
  private readonly _doCheckSubject = new Subject<void>();

  /** Subject that emits when the component has been destroyed. */
  private readonly _destroyed = new Subject<void>();

  /**
   * Margins to be applied to the content. These are used to push / shrink the drawer content when a
   * drawer is open. We use margin rather than transform even for push mode because transform breaks
   * fixed position elements inside of the transformed element.
   */
  _contentMargins: {left: number | null; right: number | null} = {left: null, right: null};

  readonly _contentMarginChanges = new Subject<{left: number | null; right: number | null}>();

  /** Reference to the CdkScrollable instance that wraps the scrollable content. */
  get scrollable(): CdkScrollable {
    return (this._userContent || this._content)!;
  }

  protected generateId(): string {
    return "";
  }

  private _injector = inject(Injector);

  constructor(...args: unknown[]);

  constructor() {
    super();

    const platform = inject(Platform);
    const viewportRuler = inject(ViewportRuler);
    const defaultAutosize = inject(CUTE_DRAWER_DEFAULT_AUTOSIZE, {optional: true});
    this._autosize = defaultAutosize ?? false;

    // If a `Dir` directive exists up the tree, listen to direction changes
    // and update the left/right properties to point to the proper start/end.
    this._dir?.change.pipe(takeUntil(this._destroyed)).subscribe(() => {
      this._validateDrawers();
      this.updateContentMargins();
    });

    // Since the minimum width of the sidenav depends on the viewport width,
    // we need to recompute the margins if the viewport changes.
    viewportRuler
      .change()
      .pipe(takeUntil(this._destroyed))
      .subscribe(() => this.updateContentMargins());

    if (!this._animationDisabled && platform.isBrowser) {
      this._ngZone.runOutsideAngular(() => {
        // Enable the animations after a delay in order to skip
        // the initial transition if a drawer is open by default.
        setTimeout(() => {
          this._element.nativeElement.classList.add('cute-drawer-transition');
          this._transitionsEnabled = true;
        }, 200);
      });
    }
  }

  override ngAfterContentInit() {
    super.ngAfterContentInit();
    this._allDrawers?.changes
      .pipe(startWith(this._allDrawers), takeUntil(this._destroyed))
      .subscribe((drawer: QueryList<CuteDrawer>) => {
        this._drawers.reset(drawer.filter(item => !item._container || item._container === this));
        this._drawers.notifyOnChanges();
      });

    this._drawers.changes
      .pipe(startWith(null), takeUntil(this._destroyed))
      .subscribe(() => {
        this._validateDrawers();

        this._drawers.forEach((drawer: CuteDrawer) => {
          this._watchDrawerToggle(drawer);
          this._watchDrawerPosition(drawer);
          this._watchDrawerMode(drawer);
        });

        if (
          !this._drawers.length ||
          this._isDrawerOpen(this._start) ||
          this._isDrawerOpen(this._end)
        ) {
          this.updateContentMargins();
        }

        this._changeDetectorRef.markForCheck();
      });

    // Avoid hitting the NgZone through the debounce timeout.
    this._ngZone.runOutsideAngular(() => {
      this._doCheckSubject
        .pipe(
          debounceTime(10), // Arbitrary debounce time, less than a frame at 60fps
          takeUntil(this._destroyed),
        )
        .subscribe(() => this.updateContentMargins());
    });
  }

  override ngOnDestroy() {
    super.ngOnDestroy();
    this._contentMarginChanges.complete();
    this._doCheckSubject.complete();
    this._drawers.destroy();
    this._destroyed.next();
    this._destroyed.complete();
  }

  /** Calls `open` of both start and end drawers */
  open(): void {
    this._drawers.forEach(drawer => drawer.open());
  }

  /** Calls `close` of both start and end drawers */
  close(): void {
    this._drawers.forEach(drawer => drawer.close());
  }

  /**
   * Recalculates and updates the inline styles for the content. Note that this should be used
   * sparingly, because it causes a reflow.
   */
  updateContentMargins() {
    // 1. For drawers in `over` mode, they don't affect the content.
    // 2. For drawers in `side` mode they should shrink the content. We do this by adding to the
    //    left margin (for left drawer) or right margin (for right the drawer).
    // 3. For drawers in `push` mode they should shift the content without resizing it. We do this by
    //    adding to the left or right margin and simultaneously subtracting the same amount of
    //    margin from the other side.
    let left = 0;
    let right = 0;

    if (this._left && this._left.opened) {
      if (this._left.mode == 'side') {
        left += this._left._getWidth();
      } else if (this._left.mode == 'push') {
        const width = this._left._getWidth();
        left += width;
        right -= width;
      }
    }

    if (this._right && this._right.opened) {
      if (this._right.mode == 'side') {
        right += this._right._getWidth();
      } else if (this._right.mode == 'push') {
        const width = this._right._getWidth();
        right += width;
        left -= width;
      }
    }

    // If either `right` or `left` is zero, don't set a style to the element. This
    // allows users to specify a custom size via CSS class in SSR scenarios where the
    // measured widths will always be zero. Note that we reset to `null` here, rather
    // than below, in order to ensure that the types in the `if` below are consistent.
    left = left || null!;
    right = right || null!;

    if (left !== this._contentMargins.left || right !== this._contentMargins.right) {
      this._contentMargins = {left, right};

      // Pull back into the NgZone since in some cases we could be outside. We need to be careful
      // to do it only when something changed, otherwise we can end up hitting the zone too often.
      this._ngZone.run(() => this._contentMarginChanges.next(this._contentMargins));
    }
  }

  ngDoCheck() {
    // If users opted into autosizing, do a check every change detection cycle.
    if (this._autosize && this._isPushed()) {
      // Run outside the NgZone, otherwise the debouncer will throw us into an infinite loop.
      this._ngZone.runOutsideAngular(() => this._doCheckSubject.next());
    }
  }

  /**
   * Subscribes to drawer events in order to set a class on the main container element when the
   * drawer is open and the backdrop is visible. This ensures any overflow on the container element
   * is properly hidden.
   */
  private _watchDrawerToggle(drawer: CuteDrawer): void {
    drawer._animationStarted.pipe(takeUntil(this._drawers.changes)).subscribe(() => {
      this.updateContentMargins();
      this._changeDetectorRef.markForCheck();
    });

    if (drawer.mode !== 'side') {
      drawer.openedChange
        .pipe(takeUntil(this._drawers.changes))
        .subscribe(() => this._setContainerClass(drawer.opened));
    }
  }

  /**
   * Subscribes to drawer onPositionChanged event in order to
   * re-validate drawers when the position changes.
   */
  private _watchDrawerPosition(drawer: CuteDrawer): void {
    if (!drawer) {
      return;
    }
    // NOTE: We need to wait for the microtask queue to be empty before validating,
    // since both drawers may be swapping positions at the same time.
    drawer.onPositionChanged.pipe(takeUntil(this._drawers.changes)).subscribe(() => {
      afterNextRender({read: () => this._validateDrawers()}, {injector: this._injector});
    });
  }

  /** Subscribes to changes in drawer mode so we can run change detection. */
  private _watchDrawerMode(drawer: CuteDrawer): void {
    drawer._modeChanged
      .pipe(takeUntil(merge(this._drawers.changes, this._destroyed)))
      .subscribe(() => {
        this.updateContentMargins();
        this._changeDetectorRef.markForCheck();
      });
  }

  /** Toggles the 'cute-drawer-opened' class on the main 'cute-drawer-container' element. */
  private _setContainerClass(isAdd: boolean): void {
    const classList = this._element.nativeElement.classList;
    const className = 'cute-drawer-container-has-open';

    if (isAdd) {
      classList.add(className);
    } else {
      classList.remove(className);
    }
  }

  /** Validate the state of the drawer children components. */
  private _validateDrawers() {
    this._start = this._end = null;

    // Ensure that we have at most one start and one end drawer.
    this._drawers.forEach(drawer => {
      if (drawer.position == 'end') {
        if (this._end != null && isDevMode()) {
          throwCuteDuplicatedDrawerError('end');
        }
        this._end = drawer;
      } else {
        if (this._start != null && isDevMode()) {
          throwCuteDuplicatedDrawerError('start');
        }
        this._start = drawer;
      }
    });

    this._right = this._left = null;

    // Detect if we're LTR or RTL.
    if (this._dir && this._dir.value === 'rtl') {
      this._left = this._end;
      this._right = this._start;
    } else {
      this._left = this._start;
      this._right = this._end;
    }
  }

  /** Whether the container is being pushed to the side by one of the drawers. */
  private _isPushed() {
    return (
      (this._isDrawerOpen(this._start) && this._start.mode != 'over') ||
      (this._isDrawerOpen(this._end) && this._end.mode != 'over')
    );
  }

  _onBackdropClicked() {
    this.backdropClick.emit();
    this._closeModalDrawersViaBackdrop();
  }

  _closeModalDrawersViaBackdrop() {
    // Close all open drawers where closing is not disabled and the mode is not `side`.
    [this._start, this._end]
      .filter(drawer => drawer && !drawer.disableClose && this._drawerHasBackdrop(drawer))
      .forEach(drawer => drawer!._closeViaBackdropClick());
  }

  _isShowingBackdrop(): boolean {
    return (
      (this._isDrawerOpen(this._start) && this._drawerHasBackdrop(this._start)) ||
      (this._isDrawerOpen(this._end) && this._drawerHasBackdrop(this._end))
    );
  }

  private _isDrawerOpen(drawer: CuteDrawer | null): drawer is CuteDrawer {
    return drawer != null && drawer.opened;
  }

  // Whether argument drawer should have a backdrop when it opens
  private _drawerHasBackdrop(drawer: CuteDrawer | null) {
    if (this._backdropOverride == null) {
      return !!drawer && drawer.mode !== 'side';
    }

    return this._backdropOverride;
  }

}
