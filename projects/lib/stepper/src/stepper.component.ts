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
  AfterContentInit, AfterViewInit, booleanAttribute,
  ChangeDetectionStrategy,
  Component, ContentChildren,
  ElementRef, EventEmitter, inject, input,
  Input, NgZone, OnDestroy, Output, QueryList, Renderer2, signal, TemplateRef, ViewChildren,
  ViewEncapsulation
} from "@angular/core";
import {CdkStepper} from "@angular/cdk/stepper";
import {Platform} from "@angular/cdk/platform";
import {NgTemplateOutlet} from "@angular/common";
import {startWith, takeUntil} from "rxjs/operators";
import {ThemeColor, _animationsDisabled} from "@cute-widgets/base/core";
import {CuteStep} from "./step.component";
import {CuteStepperIcon, CuteStepperIconContext} from "./stepper-icon.directive";
import {CuteStepHeader} from "./step-header.component";

export type StepperLabelPosition = 'bottom' | 'end';

@Component({
    selector: 'cute-stepper, cute-vertical-stepper, cute-horizontal-stepper, [cuteStepper]',
    templateUrl: './stepper.component.html',
    styleUrls: ['./stepper.component.scss'],
    exportAs: 'cuteStepper, cuteVerticalStepper, cuteHorizontalStepper',
    host: {
      'class': 'cute-stepper container',
      '[class.cute-stepper-horizontal]': 'orientation === "horizontal"',
      '[class.cute-stepper-vertical]': 'orientation === "vertical"',
      '[class.cute-stepper-label-position-end]': 'orientation === "horizontal" && labelPosition == "end"',
      '[class.cute-stepper-label-position-bottom]': 'orientation === "horizontal" && labelPosition == "bottom"',
      '[class.cute-stepper-header-position-bottom]': 'headerPosition === "bottom"',
      '[class.cute-stepper-animating]': '_isAnimating()',
      '[style.--cute-stepper-animation-duration]': '_getAnimationDuration()',
      '[attr.aria-orientation]': 'orientation',
      'role': 'tablist',
    },
    providers: [
        { provide: CdkStepper, useExisting: CuteStepper },
    ],
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [NgTemplateOutlet, CuteStepHeader]
})
export class CuteStepper extends CdkStepper implements AfterViewInit, AfterContentInit, OnDestroy {
  private _ngZone = inject(NgZone);
  private _renderer = inject(Renderer2);
  private _animationsDisabled = _animationsDisabled();
  private _cleanupTransition: (() => void) | undefined;
  protected _isAnimating = signal(false);

  /** The list of step headers of the steps in the stepper. */
  @ViewChildren(CuteStepHeader) override _stepHeader: QueryList<CuteStepHeader> = undefined!;

  /** Elements hosting the step animations. */
  @ViewChildren('animatedContainer') _animatedContainers: QueryList<ElementRef> | undefined;

  /** Full list of steps inside the stepper, including inside nested steppers. */
  @ContentChildren(CuteStep, {descendants: true}) override _steps: QueryList<CuteStep> = undefined!;

  /** Steps that belong to the current stepper excluding ones from nested steppers. */
  override readonly steps: QueryList<CuteStep> = new QueryList<CuteStep>();

  /** Custom icon overrides passed in by the consumer. */
  @ContentChildren(CuteStepperIcon, {descendants: true}) _icons: QueryList<CuteStepperIcon> | undefined;

  /** Event emitted when the current step is done transitioning in. */
  @Output() readonly animationDone: EventEmitter<void> = new EventEmitter<void>();

  /** Whether ripples should be disabled for the step headers. */
  @Input({transform: booleanAttribute}) disableRipple: boolean = false;

  /** Theme color for all the steps in stepper. */
  @Input() color: ThemeColor | undefined;

  /**
   * Whether the label should display in bottom or end position.
   * Only applies in the `horizontal` orientation.
   */
  @Input()
  labelPosition: StepperLabelPosition = 'end';

  /**
   * Position of the stepper's header.
   * Only applies in the `horizontal` orientation.
   */
  @Input()
  headerPosition: 'top' | 'bottom' = 'top';

  /** The content prefix to use in the stepper header. */
  readonly headerPrefix = input<TemplateRef<unknown> | null>(null);

  /** Consumer-specified template-refs to be used to override the header icons. */
  _iconOverrides: Record<string, TemplateRef<CuteStepperIconContext>> = {};

  /** Duration for the animation. Will be normalized to milliseconds if no units are set. */
  @Input()
  get animationDuration(): string { return this._animationDuration; }
  set animationDuration(value: string) {
    this._animationDuration = /^\d+$/.test(value) ? value + 'ms' : value;
  }
  private _animationDuration = '';

  /** Whether the stepper is rendering on the server. */
  protected _isServer: boolean = !inject(Platform).isBrowser;

  constructor(...args: unknown[]);
  constructor() {
    super();
    const elementRef = inject<ElementRef<HTMLElement>>(ElementRef);
    const nodeName = elementRef.nativeElement.nodeName.toLowerCase();
    this.orientation = nodeName === 'cute-vertical-stepper' ? 'vertical' : 'horizontal';
  }

  override ngAfterContentInit() {
    super.ngAfterContentInit();
    this._icons?.forEach(({name, templateRef}) => {
      if (name) {
        this._iconOverrides[name] = templateRef;
      }
    });

    // Mark the component for change detection whenever the content children query changes
    this.steps.changes.pipe(takeUntil(this._destroyed)).subscribe(() => this._stateChanged());

    // Transition events won't fire if animations are disabled so we simulate them.
    this.selectedIndexChange.pipe(takeUntil(this._destroyed)).subscribe(() => {
      const duration = this._getAnimationDuration();
      if (duration === '0ms' || duration === '0s') {
        this._onAnimationDone();
      } else {
        this._isAnimating.set(true);
      }
    });

    this._ngZone.runOutsideAngular(() => {
      if (!this._animationsDisabled) {
        setTimeout(() => {
          // Delay enabling the animations so we don't animate the initial state.
          this._elementRef.nativeElement.classList.add('cute-stepper-animations-enabled');

          // Bind this outside the zone since it fires for all transitions inside the stepper.
          this._cleanupTransition = this._renderer.listen(
            this._elementRef.nativeElement,
            'transitionend',
            this._handleTransitionend,
          );
        }, 200);
      }
    });
  }

  override ngAfterViewInit(): void {
    super.ngAfterViewInit();

    // Prior to #30314 the stepper had animation `done` events bound to each animated container.
    // The animations module was firing them on initialization and for each subsequent animation.
    // Since the events were bound in the template, it had the unintended side effect of triggering
    // change detection as well. It appears that this side effect ended up being load-bearing,
    // because it was ensuring that the content elements (e.g. `matStepLabel`) that are defined
    // in subcomponents actually get picked up in a timely fashion. This subscription simulates
    // the same change detection by using `queueMicrotask` similarly to the animations' module.
    if (typeof queueMicrotask === 'function') {
      let hasEmittedInitial = false;
      this._animatedContainers?.changes
        .pipe(startWith(null), takeUntil(this._destroyed))
        .subscribe(() =>
          queueMicrotask(() => {
            // Simulate the initial `animationDone` event
            // that gets emitted by the animations module.
            if (!hasEmittedInitial) {
              hasEmittedInitial = true;
              this.animationDone.emit();
            }

            this._stateChanged();
          }),
        );
    }
  }

  override ngOnDestroy(): void {
    super.ngOnDestroy();
    this._cleanupTransition?.();
  }

  _getAnimationDuration() {
    if (this._animationsDisabled) {
      return '0ms';
    }

    if (this.animationDuration) {
      return this.animationDuration;
    }

    return this.orientation === 'horizontal' ? '500ms' : '225ms';
  }

  private _handleTransitionend = (event: TransitionEvent) => {
    const target = event.target as HTMLElement | null;

    if (!target) {
      return;
    }

    // Because we bind a single `transitionend` handler on the host node and because transition
    // events bubble, we have to filter down to only the active step so don't emit events too
    // often. We check the orientation and `property` name first to reduce the amount of times
    // we need to check the DOM.
    const isHorizontalActiveElement =
      this.orientation === 'horizontal' &&
      event.propertyName === 'transform' &&
      target.classList.contains('cute-horizontal-stepper-content-current');
    const isVerticalActiveElement =
      this.orientation === 'vertical' &&
      event.propertyName === 'grid-template-rows' &&
      target.classList.contains('cute-vertical-content-container-active');

    // Finally we need to ensure that the animated element is a direct descendant,
    // rather than one coming from a nested stepper.
    const shouldEmit =
      (isHorizontalActiveElement || isVerticalActiveElement) &&
      this._animatedContainers?.find(ref => ref.nativeElement === target);

    if (shouldEmit) {
      this._onAnimationDone();
    }
  };

  private _onAnimationDone() {
    this._isAnimating.set(false);
    this.animationDone.emit();
  }

}
