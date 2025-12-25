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
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ComponentRef,
  ElementRef,
  EmbeddedViewRef,
  inject, isDevMode,
  NgZone,
  OnDestroy,
  ViewChild,
  ViewEncapsulation,
  DOCUMENT, signal, WritableSignal, OnInit, Injector, afterNextRender
} from '@angular/core';

import {
  BasePortalOutlet,
  CdkPortalOutlet,
  ComponentPortal,
  DomPortal,
  TemplatePortal,
} from '@angular/cdk/portal';
import {Observable, of, Subject} from 'rxjs';
import {AriaLivePoliteness} from '@angular/cdk/a11y';
import {Platform} from '@angular/cdk/platform';
import {CuteSnackBarConfig} from './snack-bar-config';
import {CuteThemeService} from '@cute-widgets/base/core';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {_animationsDisabled} from '@cute-widgets/base/core/animation';

const ENTER_ANIMATION = '_cute-snack-bar-enter';
const EXIT_ANIMATION = '_cute-snack-bar-exit';

let uniqueId = 0;

/**
 * Internal component that wraps user-provided snack bar content.
 */
@Component({
  selector: 'cute-snack-bar-container',
  templateUrl: './snack-bar-container.html',
  styleUrls: ['./snack-bar-container.scss'],
  // In Ivy, embedded views will be change detected from their declaration place, rather than
  // where they were stamped out. This means that we can't have the snack bar container be OnPush,
  // because it might cause snack bars that were opened from a template not to be out of date.
  // tslint:disable-next-line:validate-decorators
  changeDetection: ChangeDetectionStrategy.Default,
  encapsulation: ViewEncapsulation.None,
  imports: [CdkPortalOutlet],
  host: {
    'class': 'cute-snack-bar-container toast-container',
    '[attr.data-bs-theme]': 'isLightTheme() ? "dark" : "light"',
    '[class.cute-snack-bar-container-enter]': '_animationState === "visible"',
    '[class.cute-snack-bar-container-exit]': '_animationState === "hidden"',
    '[class.cute-snack-bar-container-animations-enabled]': '!_animationsDisabled',
    '(animationend)': 'onAnimationEnd($event.animationName)',
    '(animationcancel)': 'onAnimationEnd($event.animationName)',  }
})
export class CuteSnackBarContainer extends BasePortalOutlet implements OnDestroy {
  private _ngZone = inject(NgZone);
  readonly _elementRef = inject<ElementRef<HTMLElement>>(ElementRef);
  private _changeDetectorRef = inject(ChangeDetectorRef);
  private _platform = inject(Platform);
  protected _animationsDisabled = _animationsDisabled();
  snackBarConfig = inject(CuteSnackBarConfig);

  private _document = inject(DOCUMENT);
  private _themeService = inject(CuteThemeService);
  private _trackedModals = new Set<Element>();
  private _enterFallback: ReturnType<typeof setTimeout> | undefined;
  private _exitFallback: ReturnType<typeof setTimeout> | undefined;
  private _injector = inject(Injector);

  protected isLightTheme: WritableSignal<boolean>

  /** The number of milliseconds to wait before announcing the snack bar's content. */
  private readonly _announceDelay: number = 150;

  /** The timeout for announcing the snack bar's content. */
  private _announceTimeoutId: number = 0;

  /** Whether the component has been destroyed. */
  private _destroyed = false;

  /** The portal outlet inside this container into which the snack bar content will be loaded. */
  @ViewChild(CdkPortalOutlet, {static: true}) _portalOutlet!: CdkPortalOutlet;

  /** Subject for notifying that the snack bar has announced to screen readers. */
  readonly _onAnnounce: Subject<void> = new Subject();

  /** Subject for notifying that the snack bar has exited from view. */
  readonly _onExit: Subject<void> = new Subject();

  /** Subject for notifying that the snack bar has finished entering the view. */
  readonly _onEnter: Subject<void> = new Subject();

  /** The state of the snack bar animations. */
  _animationState = 'void';

  /** aria-live value for the live region. */
  _live: AriaLivePoliteness;

  /**
   * Element that will have the `cute-snackbar__label` class applied if the attached component
   * or template does not have it. This ensures that the appropriate structure, typography, and
   * color are applied to the attached view.
   */
  @ViewChild('label', {static: true}) _label: ElementRef | undefined;

  /**
   * Role of the live region. This is only for Firefox as there is a known issue where Firefox +
   * JAWS does not read out an aria-live message.
   */
  _role?: 'status' | 'alert';

  /** Unique ID of the aria-live element. */
  readonly _liveElementId = `cute-snack-bar-container-live-${uniqueId++}`;

  constructor(...args: unknown[]);
  constructor() {
    super();
    const config = this.snackBarConfig;

    // Use aria-live rather than a live role like 'alert' or 'status'
    // because NVDA and JAWS have show inconsistent behavior with live roles.
    if (config.politeness === 'assertive' && !config.announcementMessage) {
      this._live = 'assertive';
    } else if (config.politeness === 'off') {
      this._live = 'off';
    } else {
      this._live = 'polite';
    }

    // Only set a role for Firefox. Set role based on aria-live because setting role="alert" implies
    // aria-live="assertive" which may cause issues if aria-live is set to "polite" above.
    if (this._platform.FIREFOX) {
      if (this._live === 'polite') {
        this._role = 'status';
      }
      if (this._live === 'assertive') {
        this._role = 'alert';
      }
    }

    this.isLightTheme = signal(this._themeService.isLightTheme());

    this._themeService.change
      .pipe(takeUntilDestroyed())
      .subscribe(event => {
        this.isLightTheme.set( !event.matches );
      });
  }

  /** Attach a component portal as content to this snack bar container. */
  attachComponentPortal<T>(portal: ComponentPortal<T>): ComponentRef<T> {
    this._assertNotAttached();
    const result = this._portalOutlet.attachComponentPortal(portal);
    this._afterPortalAttached();
    return result;
  }

  /** Attach a template portal as content to this snack bar container. */
  attachTemplatePortal<C>(portal: TemplatePortal<C>): EmbeddedViewRef<C> {
    this._assertNotAttached();
    const result = this._portalOutlet.attachTemplatePortal(portal);
    this._afterPortalAttached();
    return result;
  }

  /**
   * Attaches a DOM portal to the snack bar container.
   * @deprecated To be turned into a method.
   * @breaking-change 10.0.0
   */
  override attachDomPortal = (portal: DomPortal) => {
    this._assertNotAttached();
    const result = this._portalOutlet.attachDomPortal(portal);
    this._afterPortalAttached();
    return result;
  };

  /** Handle end of animations, updating the state of the snackbar. */
  onAnimationEnd(animationName: string) {
    if (animationName === EXIT_ANIMATION) {
      this._completeExit();
    } else if (animationName === ENTER_ANIMATION) {
      clearTimeout(this._enterFallback);
      this._ngZone.run(() => {
        this._onEnter.next();
        this._onEnter.complete();
      });
    }
  }

  /** Begin animation of snack bar entrance into view. */
  enter(): void {
    if (!this._destroyed) {
      this._animationState = 'visible';
      // _animationState lives in host bindings and `detectChanges` does not refresh host bindings
      // so we have to call `markForCheck` to ensure the host view is refreshed eventually.
      this._changeDetectorRef.markForCheck();
      this._changeDetectorRef.detectChanges();
      this._screenReaderAnnounce();

      if (this._animationsDisabled) {
        afterNextRender(
          () => {
            this._ngZone.run(() => queueMicrotask(() => this.onAnimationEnd(ENTER_ANIMATION)));
          },
          {injector: this._injector},
        );
      } else {
        clearTimeout(this._enterFallback);
        this._enterFallback = setTimeout(() => {
          // The snack bar will stay invisible if it fails to animate. Add a fallback class so it
          // becomes visible. This can happen in some apps that do `* {animation: none !important}`.
          this._elementRef.nativeElement.classList.add('mat-snack-bar-fallback-visible');
          this.onAnimationEnd(ENTER_ANIMATION);
        }, 200);
      }
    }
  }

  /** Begin animation of the snack bar exiting from view. */
  exit(): Observable<void> {
    if (this._destroyed) {
      return of(undefined);
    }

    // It's common for snack bars to be opened by random outside calls like HTTP requests or
    // errors. Run inside the NgZone to ensure that it functions correctly.
    this._ngZone.run(() => {
      // Note: this one transitions to `hidden`, rather than `void`, in order to handle the case
      // where multiple snack bars are opened in quick succession (e.g., two consecutive calls to
      // `CuteSnackBar.open`).
      this._animationState = 'hidden';
      this._changeDetectorRef.markForCheck();

      // Mark this element with an 'exit' attribute to indicate that the snackbar has
      // been dismissed and will soon be removed from the DOM. This is used by the snackbar
      // test harness.
      this._elementRef.nativeElement.setAttribute('cute-exit', '');

      // If the snack bar hasn't been announced by the time it exits, it wouldn't have been open
      // long enough to visually read it too, so clear the timeout for announcing.
      clearTimeout(this._announceTimeoutId);

      if (this._animationsDisabled) {
        afterNextRender(
          () => {
            this._ngZone.run(() => queueMicrotask(() => this.onAnimationEnd(EXIT_ANIMATION)));
          },
          {injector: this._injector},
        );
      } else {
        clearTimeout(this._exitFallback);
        this._exitFallback = setTimeout(() => this.onAnimationEnd(EXIT_ANIMATION), 200);
      }
    });

    return this._onExit;
  }

  /** Makes sure the exit callbacks have been invoked when the element is destroyed. */
  ngOnDestroy() {
    this._destroyed = true;
    this._clearFromModals();
    this._completeExit();
  }

  /**
   * Removes the element in a microtask. Helps prevent errors where we end up
   * removing an element which is in the middle of an animation.
   */
  private _completeExit() {
    clearTimeout(this._exitFallback);
    queueMicrotask(() => {
      this._onExit.next();
      this._onExit.complete();
    });
  }

  /**
   * Called after the portal contents have been attached. Can be
   * used to modify the DOM once it's guaranteed to be in place.
   */
  private _afterPortalAttached() {
    const element: HTMLElement = this._elementRef.nativeElement;
    const panelClasses = this.snackBarConfig.panelClass;

    if (panelClasses) {
      if (Array.isArray(panelClasses)) {
        // Note that we can't use a spread here, because IE doesn't support multiple arguments.
        panelClasses.forEach(cssClass => element.classList.add(cssClass));
      } else {
        element.classList.add(panelClasses);
      }
    }
    this._exposeToModals();

    // Check to see if the attached component or template uses the MDC template structure,
    // specifically the MDC label. If not, the container should apply the MDC label class to this
    // component's label container, which will apply MDC's label styles to the attached view.
    // if (this._label) {
    //   const label = this._label.nativeElement;
    //   const labelClass = 'cute-snackbar__label';
    //   label.classList.toggle(labelClass, !label.querySelector(`.${labelClass}`));
    // }
  }

  /**
   * Some browsers won't expose the accessibility node of the live element if there is an
   * `aria-modal` and the live element is outside of it. This method works around the issue by
   * pointing the `aria-owns` of all modals to the live element.
   */
  private _exposeToModals() {
    // TODO(http://github.com/angular/components/issues/26853): consider de-duplicating this with the
    // `LiveAnnouncer` and any other usages.
    //
    // Note that the selector here is limited to CDK overlays at the moment in order to reduce the
    // section of the DOM we need to look through. This should cover all the cases we support, but
    // the selector can be expanded if it turns out to be too narrow.
    const id = this._liveElementId;
    const modals = this._document.querySelectorAll(
      'body > .cdk-overlay-container [aria-modal="true"]',
    );

    for (let i = 0; i < modals.length; i++) {
      const modal = modals[i];
      const ariaOwns = modal.getAttribute('aria-owns');
      this._trackedModals.add(modal);

      if (!ariaOwns) {
        modal.setAttribute('aria-owns', id);
      } else if (ariaOwns.indexOf(id) === -1) {
        modal.setAttribute('aria-owns', ariaOwns + ' ' + id);
      }
    }
  }

  /** Clears the references to the live element from any modals it was added to. */
  private _clearFromModals() {
    this._trackedModals.forEach(modal => {
      const ariaOwns = modal.getAttribute('aria-owns');

      if (ariaOwns) {
        const newValue = ariaOwns.replace(this._liveElementId, '').trim();

        if (newValue.length > 0) {
          modal.setAttribute('aria-owns', newValue);
        } else {
          modal.removeAttribute('aria-owns');
        }
      }
    });
    this._trackedModals.clear();
  }

  /** Asserts that no content is already attached to the container. */
  private _assertNotAttached() {
    if (this._portalOutlet.hasAttached() && isDevMode()) {
      throw Error('Attempting to attach snack bar content after content is already attached');
    }
  }

  /**
   * Starts a timeout to move the snack bar content to the live region so screen readers will
   * announce it.
   */
  private _screenReaderAnnounce() {
    if (this._announceTimeoutId) {
      return;
    }

    this._ngZone.runOutsideAngular(() => {
      this._announceTimeoutId = setTimeout(() => {
        if (this._destroyed) {
          return;
        }

        const element = this._elementRef.nativeElement;
        const inertElement = element.querySelector('[aria-hidden]');
        const liveElement = element.querySelector('[aria-live]');

        if (inertElement && liveElement) {
          // If an element in the snack bar content is focused before being moved
          // track it and restore focus after moving to the live region.
          let focusedElement: HTMLElement | null = null;
          if (
            this._platform.isBrowser &&
            document.activeElement instanceof HTMLElement &&
            inertElement.contains(document.activeElement)
          ) {
            focusedElement = document.activeElement;
          }

          inertElement.removeAttribute('aria-hidden');
          liveElement.appendChild(inertElement);
          focusedElement?.focus();

          this._onAnnounce.next();
          this._onAnnounce.complete();
        }
      }, this._announceDelay);
    });
  }
}
