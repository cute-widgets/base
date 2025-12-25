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
import {LiveAnnouncer} from '@angular/cdk/a11y';
import {BreakpointObserver, Breakpoints} from '@angular/cdk/layout';
import {ComponentType, Overlay, OverlayConfig, OverlayRef} from '@angular/cdk/overlay';
import {
  ComponentRef, DestroyRef, ElementRef,
  EmbeddedViewRef, inject,
  Injectable,
  InjectionToken,
  Injector,
  OnDestroy,
  TemplateRef,
} from '@angular/core';
import {SimpleSnackBar, TextOnlySnackBar} from './simple-snack-bar';
import {CuteSnackBarContainer} from './snack-bar-container';
import {CUTE_SNACK_BAR_DATA, CuteSnackBarConfig} from './snack-bar-config';
import {CuteSnackBarRef} from './snack-bar-ref';
import {ComponentPortal, TemplatePortal} from '@angular/cdk/portal';
import {takeUntil} from 'rxjs/operators';
import {CuteBaseControl} from "@cute-widgets/base/abstract";
import {toTextBgCssClass} from "@cute-widgets/base/core";
import {_animationsDisabled} from '@cute-widgets/base/core/animation';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';

/** Injection token that can be used to specify the default snack bar. */
export const CUTE_SNACK_BAR_DEFAULT_OPTIONS = new InjectionToken<CuteSnackBarConfig>(
  'cute-snack-bar-default-options',
  {
    providedIn: 'root',
    factory: () => new CuteSnackBarConfig(),
  },
);

/**
 * Service to dispatch Cute snack bar messages.
 */
@Injectable({providedIn: 'root'})
export class CuteSnackBar implements OnDestroy {
  private _live = inject(LiveAnnouncer);
  private _injector = inject(Injector);
  private _overlay = inject(Overlay);
  private _breakpointObserver = inject(BreakpointObserver);
  private _parentSnackBar = inject(CuteSnackBar, {optional: true, skipSelf: true});
  private _defaultConfig = inject<CuteSnackBarConfig>(CUTE_SNACK_BAR_DEFAULT_OPTIONS);
  private _animationsDisabled = _animationsDisabled();

  private _destroyRef = inject(DestroyRef);

  /**
   * Reference to the current snack bar in the view *at this level* (in the Angular injector tree).
   * If there is a parent snack-bar service, all operations should delegate to that parent
   * via `_openedSnackBarRef`.
   */
  private _snackBarRefAtThisLevel: CuteSnackBarRef<any> | null = null;

  /** The component that should be rendered as the snack bar's simple component. */
  private _simpleSnackBarComponent = SimpleSnackBar;

  /** The container component that attaches the provided template or component. */
  snackBarContainerComponent = CuteSnackBarContainer;

  /** The CSS class to apply for handset mode. */
  handsetCssClass = 'cute-snack-bar-handset';

  /** Reference to the currently opened snackbar at *any* level. */
  get _openedSnackBarRef(): CuteSnackBarRef<any> | null {
    const parent = this._parentSnackBar;
    return parent ? parent._openedSnackBarRef : this._snackBarRefAtThisLevel;
  }

  set _openedSnackBarRef(value: CuteSnackBarRef<any> | null) {
    if (this._parentSnackBar) {
      this._parentSnackBar._openedSnackBarRef = value;
    } else {
      this._snackBarRefAtThisLevel = value;
    }
  }

  constructor(...args: unknown[]);
  constructor() {}

  /**
   * Creates and dispatches a snack bar with a custom component for the content, removing any
   * currently opened snack bars.
   *
   * @param component Component to be instantiated.
   * @param config Extra configuration for the snack bar.
   */
  openFromComponent<T, D = any>(
    component: ComponentType<T>,
    config?: CuteSnackBarConfig<D>,
  ): CuteSnackBarRef<T> {
    return this._attach(component, config) as CuteSnackBarRef<T>;
  }

  /**
   * Creates and dispatches a snack bar with a custom template for the content, removing any
   * currently opened snack bars.
   *
   * @param template Template to be instantiated.
   * @param config Extra configuration for the snack bar.
   */
  openFromTemplate(
    template: TemplateRef<any>,
    config?: CuteSnackBarConfig,
  ): CuteSnackBarRef<EmbeddedViewRef<any>> {
    return this._attach(template, config);
  }

  /**
   * Opens a snackbar with a message and an optional action.
   * @param message The message to show in the snackbar.
   * @param action The label for the snackbar action.
   * @param config Additional configuration options for the snackbar.
   */
  open(
    message: string,
    action: string = '',
    config?: CuteSnackBarConfig,
  ): CuteSnackBarRef<TextOnlySnackBar> {
    const _config: CuteSnackBarConfig = {...this._defaultConfig, ...config};

    // Since the user doesn't have access to the component, we can
    // override the data to pass in our own message and action.
    _config.data = {message, action};

    // Since the snack bar has `role="alert"`, we don't
    // want to announce the same message twice.
    if (_config.announcementMessage === message) {
      _config.announcementMessage = undefined;
    }

    return this.openFromComponent(this._simpleSnackBarComponent, _config);
  }

  /**
   * Dismisses the currently visible snack bar.
   */
  dismiss(): void {
    if (this._openedSnackBarRef) {
      this._openedSnackBarRef.dismiss();
    }
  }

  ngOnDestroy() {
    // Only dismiss the snack bar at the current level on destroy.
    if (this._snackBarRefAtThisLevel) {
      this._snackBarRefAtThisLevel.dismiss();
    }
  }

  /**
   * Attaches the snack bar container component to the overlay.
   */
  private _attachSnackBarContainer(
    overlayRef: OverlayRef,
    config: CuteSnackBarConfig,
  ): CuteSnackBarContainer {
    const userInjector = config && config.viewContainerRef && config.viewContainerRef.injector;
    const injector = Injector.create({
      parent: userInjector || this._injector,
      providers: [{provide: CuteSnackBarConfig, useValue: config}],
    });

    const containerPortal = new ComponentPortal(
      this.snackBarContainerComponent,
      config.viewContainerRef,
      injector,
    );
    const containerRef: ComponentRef<CuteSnackBarContainer> = overlayRef.attach(containerPortal);
    containerRef.instance.snackBarConfig = config;
    return containerRef.instance;
  }

  /**
   * Places a new component or a template as the content of the snack bar container.
   */
  private _attach<T>(
    content: ComponentType<T> | TemplateRef<T>,
    userConfig?: CuteSnackBarConfig,
  ): CuteSnackBarRef<T | EmbeddedViewRef<any>> {
    const config = {...new CuteSnackBarConfig(), ...this._defaultConfig, ...userConfig};

    const overlayRef = this._createOverlay(config);
    const container = this._attachSnackBarContainer(overlayRef, config);
    const snackBarRef = new CuteSnackBarRef<T | EmbeddedViewRef<any>>(container, overlayRef);

    let attachedElement: ElementRef;

    if (content instanceof TemplateRef) {
      const portal = new TemplatePortal(content, null!, {
        $implicit: config.data,
        snackBarRef,
      } as any);

      snackBarRef.instance = container.attachTemplatePortal(portal);
      attachedElement = snackBarRef.instance.rootNodes[0];
    } else {
      const injector = this._createInjector(config, snackBarRef);
      const portal = new ComponentPortal(content, undefined, injector);
      const contentRef = container.attachComponentPortal<T>(portal);

      // We can't pass this through the injector because the injector was created earlier
      snackBarRef.instance = contentRef.instance;
      if (snackBarRef.instance instanceof CuteBaseControl) {
        const baseControl = snackBarRef.instance as CuteBaseControl;
        baseControl.color = config.color;
        baseControl.gradientFill = config.gradientFill || false;
      }

      attachedElement = contentRef.location;
    }

    // CWT: Adding Bootstrap's classes dynamically
    const cssClasses = ["toast", "show"];
    if (config.color) {
      //cssClasses.push("text-bg-"+config.color);
      cssClasses.push( toTextBgCssClass(config.color) );
    }
    if (config.gradientFill) {
      cssClasses.push("bg-gradient");
    }
    addClasses(attachedElement.nativeElement, cssClasses);

    // Subscribe to the breakpoint observer and attach the cute-snack-bar-handset class as
    // appropriate. This class is applied to the overlay element because the overlay must expand to
    // fill the width with the screen for full width snackbars.
    this._breakpointObserver
      .observe(Breakpoints.HandsetPortrait)
      .pipe(takeUntil(overlayRef.detachments()))
      .subscribe(state => {
        overlayRef.overlayElement.classList.toggle(this.handsetCssClass, state.matches);
      });

    if (config.announcementMessage) {
      // Wait until the snack bar contents have been announced, then deliver this message.
      container._onAnnounce.subscribe(() => {
        this._live.announce(config.announcementMessage!, config.politeness);
      });
    }

    this._animateSnackBar(snackBarRef, config);
    this._openedSnackBarRef = snackBarRef;
    return this._openedSnackBarRef;
  }

  /** Animates the old snack bar out and the new one in. */
  private _animateSnackBar(snackBarRef: CuteSnackBarRef<any>, config: CuteSnackBarConfig) {
    // When the snackbar is dismissed, clear the reference to it.
    snackBarRef.afterDismissed()
      .pipe(takeUntilDestroyed(this._destroyRef))
      .subscribe(() => {
      // Clear the snackbar ref if it hasn't already been replaced by a newer snackbar.
      if (this._openedSnackBarRef == snackBarRef) {
        this._openedSnackBarRef = null;
      }

      if (config.announcementMessage) {
        this._live.clear();
      }
    });

    // If a dismiss timeout is provided, set up dismiss based on after the snackbar is opened.
    if (config.duration && config.duration > 0) {
      snackBarRef.afterOpened()
        .pipe(takeUntilDestroyed(this._destroyRef))
        .subscribe(() => snackBarRef._dismissAfter(config.duration!));
    }

    if (this._openedSnackBarRef) {
      // If a snack bar is already in view, dismiss it and enter the
      // new snack bar after exit animation is complete.
      this._openedSnackBarRef.afterDismissed()
        .pipe(takeUntilDestroyed(this._destroyRef))
        .subscribe(() => {
        snackBarRef.containerInstance.enter();
      });
      this._openedSnackBarRef.dismiss();
    } else {
      // If no snack bar is in view, enter the new snack bar.
      snackBarRef.containerInstance.enter();
    }
  }

  /**
   * Creates a new overlay and places it in the correct location.
   * @param config The user-specified snack bar config.
   */
  private _createOverlay(config: CuteSnackBarConfig): OverlayRef {
    const overlayConfig = new OverlayConfig();
    overlayConfig.direction = config.direction;

    let positionStrategy = this._overlay.position().global();
    // Set horizontal position.
    const isRtl = config.direction === 'rtl';
    const isLeft =
      config.horizontalPosition === 'left' ||
      (config.horizontalPosition === 'start' && !isRtl) ||
      (config.horizontalPosition === 'end' && isRtl);
    const isRight = !isLeft && config.horizontalPosition !== 'center';
    const OFFSET = '0';
    if (isLeft) {
      positionStrategy.left(OFFSET);
    } else if (isRight) {
      positionStrategy.right(OFFSET);
    } else {
      positionStrategy.centerHorizontally();
    }
    // Set horizontal position.
    if (config.verticalPosition === 'top') {
      positionStrategy.top(OFFSET);
    } else {
      positionStrategy.bottom(OFFSET);
    }

    overlayConfig.positionStrategy = positionStrategy;
    overlayConfig.disableAnimations = this._animationsDisabled;
    return this._overlay.create(overlayConfig);
  }

  /**
   * Creates an injector to be used inside of a snack bar component.
   * @param config Config that was used to create the snack bar.
   * @param snackBarRef Reference to the snack bar.
   */
  private _createInjector<T>(config: CuteSnackBarConfig, snackBarRef: CuteSnackBarRef<T>): Injector {
    const userInjector = config && config.viewContainerRef && config.viewContainerRef.injector;

    return Injector.create({
      parent: userInjector || this._injector,
      providers: [
        {provide: CuteSnackBarRef, useValue: snackBarRef},
        {provide: CUTE_SNACK_BAR_DATA, useValue: config.data},
      ],
    });
  }
}


function addClasses(element: HTMLElement, classes: string|string[]): void {
  if (classes) {
    if (Array.isArray(classes)) {
      // Note that we can't use a spread here, because IE doesn't support multiple arguments.
      classes.forEach(cssClass => element.classList.add(cssClass));
    } else {
      element.classList.add(classes);
    }
  }
}
