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
  afterNextRender,
  AfterRenderRef,
  booleanAttribute,
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  ElementRef,
  inject,
  InjectionToken,
  Injector,
  input,
  InputSignal,
  InputSignalWithTransform, isDevMode,
  OnDestroy,
  output,
  OutputEmitterRef,
  Signal,
  signal,
  TemplateRef,
  untracked,
  viewChild,
  viewChildren,
  ViewContainerRef,
  ViewEncapsulation,
} from '@angular/core';
import {
  CUTE_OPTION_PARENT_COMPONENT,
  CuteOption,
  CuteOptionParentComponent,
} from '@cute-widgets/base/core/option';
import {DateAdapter, CUTE_DATE_FORMATS, _animationsDisabled} from '@cute-widgets/base/core';
import {Directionality} from '@angular/cdk/bidi';
import {Overlay, OverlayRef, ScrollStrategy} from '@angular/cdk/overlay';
import {TemplatePortal} from '@angular/cdk/portal';
import {_getEventTarget} from '@angular/cdk/platform';
import {ENTER, ESCAPE, hasModifierKey, TAB} from '@angular/cdk/keycodes';
import {_IdGenerator, ActiveDescendantKeyManager} from '@angular/cdk/a11y';
import type {CuteTimepickerInput} from './timepicker-input';
import {
  generateOptions,
  CUTE_TIMEPICKER_CONFIG,
  CuteTimepickerOption,
  parseInterval,
  validateAdapter,
} from './util';
import {Subscription} from 'rxjs';

/** Event emitted when a value is selected in the timepicker. */
export interface CuteTimepickerSelected<D> {
  value: D;
  source: CuteTimepicker<D>;
}

/** Injection token used to configure the behavior of the timepicker dropdown while scrolling. */
export const CUTE_TIMEPICKER_SCROLL_STRATEGY = new InjectionToken<() => ScrollStrategy>(
  'CUTE_TIMEPICKER_SCROLL_STRATEGY',
  {
    providedIn: 'root',
    factory: () => {
      const overlay = inject(Overlay);
      return () => overlay.scrollStrategies.reposition();
    },
  },
);

/** Represents an input that is connected to a `cute-timepicker`. */
export interface CuteTimepickerConnectedInput<D> {
  /** Current value of the input. */
  value: Signal<D | null>;

  /** Minimum allowed time. */
  min: Signal<D | null>;

  /** Maximum allowed time. */
  max: Signal<D | null>;

  /** Whether the input is disabled. */
  disabled: Signal<boolean>;

  /** Focuses the input. */
  focus(): void;

  /** Gets the element to which to connect the timepicker overlay. */
  getOverlayOrigin(): ElementRef<HTMLElement>;

  /** Gets the ID of the input's label. */
  getLabelId(): string | null;

  /** Callback invoked when the timepicker assigns a value. */
  timepickerValueAssigned(value: D | null): void;
}

/**
 * Renders out a listbox that can be used to select a time of day.
 * Intended to be used together with `CuteTimepickerInput`.
 */
@Component({
  selector: 'cute-timepicker',
  exportAs: 'cuteTimepicker',
  templateUrl: 'timepicker.html',
  styleUrl: 'timepicker.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  imports: [CuteOption],
  providers: [
    {
      provide: CUTE_OPTION_PARENT_COMPONENT,
      useExisting: CuteTimepicker,
    },
  ],
})
export class CuteTimepicker<D> implements OnDestroy, CuteOptionParentComponent {
  private _overlay = inject(Overlay);
  private _dir = inject(Directionality, {optional: true});
  private _viewContainerRef = inject(ViewContainerRef);
  private _injector = inject(Injector);
  private _defaultConfig = inject(CUTE_TIMEPICKER_CONFIG, {optional: true});
  private _dateAdapter = inject<DateAdapter<D>>(DateAdapter, {optional: true})!;
  private _dateFormats = inject(CUTE_DATE_FORMATS, {optional: true})!;
  private _scrollStrategyFactory = inject(CUTE_TIMEPICKER_SCROLL_STRATEGY);
  protected _animationsDisabled = _animationsDisabled();

  private _isOpen = signal(false);
  private _activeDescendant = signal<string | null>(null);
  private _input = signal<CuteTimepickerConnectedInput<D> | null>(null);

  private _overlayRef: OverlayRef | null = null;
  private _portal: TemplatePortal<unknown> | null = null;
  private _optionsCacheKey: string | null = null;
  private _localeChanges: Subscription | undefined;
  private _onOpenRender: AfterRenderRef | null = null;

  protected _panelTemplate = viewChild.required<TemplateRef<unknown>>('panelTemplate');
  protected _timeOptions: readonly CuteTimepickerOption<D>[] = [];
  protected _options = viewChildren(CuteOption);

  private _keyManager = new ActiveDescendantKeyManager(this._options, this._injector)
    .withHomeAndEnd(true)
    .withPageUpDown(true)
    .withVerticalOrientation(true);

  /**
   * Interval between each option in the timepicker. The value can either be an amount of
   * seconds (e.g. 90) or a number with a unit (e.g. 45m). Supported units are `s` for seconds,
   * `m` for minutes or `h` for hours.
   */
  readonly interval: InputSignalWithTransform<number | null, number | string | null> = input(
    parseInterval(this._defaultConfig?.interval || null),
    {transform: parseInterval},
  );

  /**
   * Array of pre-defined options that the user can select from, as an alternative to using the
   * `interval` input. An error will be thrown if both `options` and `interval` are specified.
   */
  readonly options: InputSignal<readonly CuteTimepickerOption<D>[] | null> = input<
    readonly CuteTimepickerOption<D>[] | null
  >(null);

  /** Whether the timepicker is open. */
  readonly isOpen: Signal<boolean> = this._isOpen.asReadonly();

  /** Emits when the user selects a time. */
  readonly selected: OutputEmitterRef<CuteTimepickerSelected<D>> = output();

  /** Emits when the timepicker is opened. */
  readonly opened: OutputEmitterRef<void> = output();

  /** Emits when the timepicker is closed. */
  readonly closed: OutputEmitterRef<void> = output();

  /** ID of the active descendant option. */
  readonly activeDescendant: Signal<string | null> = this._activeDescendant.asReadonly();

  /** Unique ID of the timepicker's panel */
  readonly panelId: string = inject(_IdGenerator).getId('cute-timepicker-panel-');

  /** Whether ripples within the timepicker should be disabled. */
  readonly disableRipple: InputSignalWithTransform<boolean, unknown> = input(
    this._defaultConfig?.disableRipple ?? false,
    {
      transform: booleanAttribute,
    },
  );

  /** ARIA label for the timepicker panel. */
  readonly ariaLabel: InputSignal<string | null> = input<string | null>(null, {
    alias: 'aria-label',
  });

  /** ID of the label element for the timepicker panel. */
  readonly ariaLabelledby: InputSignal<string | null> = input<string | null>(null, {
    alias: 'aria-labelledby',
  });

  /** Whether the timepicker is currently disabled. */
  readonly disabled: Signal<boolean> = computed(() => !!this._input()?.disabled());

  constructor() {
    if (isDevMode()) {
      validateAdapter(this._dateAdapter, this._dateFormats);

      effect(() => {
        const options = this.options();
        const interval = this.interval();

        if (options !== null && interval !== null) {
          throw new Error(
            'Cannot specify both the `options` and `interval` inputs at the same time',
          );
        } else if (options?.length === 0) {
          throw new Error('Value of `options` input cannot be an empty array');
        }
      });
    }

    // Since the panel ID is static, we can set it once without having to maintain a host binding.
    const element = inject<ElementRef<HTMLElement>>(ElementRef);
    element.nativeElement.setAttribute('cute-timepicker-panel-id', this.panelId);
    this._handleLocaleChanges();
    this._handleInputStateChanges();
    this._keyManager.change.subscribe(() =>
      this._activeDescendant.set(this._keyManager.activeItem?.id || null),
    );
  }

  /** Opens the timepicker. */
  open(): void {
    const input = this._input();

    if (!input) {
      return;
    }

    // Focus should already be on the input, but this call is in case the timepicker is opened
    // programmatically. We need to call this even if the timepicker is already open, because
    // the user might be clicking the toggle.
    input.focus();

    if (this._isOpen()) {
      return;
    }

    this._isOpen.set(true);
    this._generateOptions();
    const overlayRef = this._getOverlayRef();
    overlayRef.updateSize({width: input.getOverlayOrigin().nativeElement.offsetWidth});
    this._portal ??= new TemplatePortal(this._panelTemplate(), this._viewContainerRef);

    // We need to check this in case `isOpen` was flipped, but change detection hasn't
    // had a chance to run yet. See https://github.com/angular/components/issues/30637
    if (!overlayRef.hasAttached()) {
      overlayRef.attach(this._portal);
    }

    this._onOpenRender?.destroy();
    this._onOpenRender = afterNextRender(
      () => {
        const options = this._options();
        this._syncSelectedState(input.value(), options, options[0]);
        this._onOpenRender = null;
      },
      {injector: this._injector},
    );

    this.opened.emit();
  }

  /** Closes the timepicker. */
  close(): void {
    if (this._isOpen()) {
      this._isOpen.set(false);
      this.closed.emit();

      if (this._animationsDisabled) {
        this._overlayRef?.detach();
      }
    }
  }

  /** Registers an input with the timepicker. */
  registerInput(input: CuteTimepickerConnectedInput<D>): void {
    const currentInput = this._input();

    if (currentInput && input !== currentInput && isDevMode()) {
      throw new Error('CuteTimepicker can only be registered with one input at a time');
    }

    this._input.set(input);
  }

  ngOnDestroy(): void {
    this._keyManager.destroy();
    this._localeChanges?.unsubscribe();
    this._onOpenRender?.destroy();
    this._overlayRef?.dispose();
  }

  _getOverlayHost() {
    return this._overlayRef?.hostElement;
  }

  /** Selects a specific time value. */
  protected _selectValue(option: CuteOption<D>) {
    this.close();
    this._keyManager.setActiveItem(option);
    this._options().forEach(current => {
      // This is primarily here so we don't show two selected options while animating away.
      if (current !== option) {
        current.deselect(false);
      }
    });
    // Notify the input first so it can sync up the form control before emitting to `selected`.
    this._input()?.timepickerValueAssigned(option.value ?? null);
    this.selected.emit({value: option.value!, source: this});
    this._input()?.focus();
  }

  /** Gets the value of the `aria-labelledby` attribute. */
  protected _getAriaLabelledby(): string | null {
    if (this.ariaLabel()) {
      return null;
    }
    return this.ariaLabelledby() || this._input()?.getLabelId() || null;
  }

  /** Handles animation events coming from the panel. */
  protected _handleAnimationEnd(event: AnimationEvent) {
    if (event.animationName === '_cute-timepicker-exit') {
      this._overlayRef?.detach();
    }
  }

  /** Creates an overlay reference for the timepicker panel. */
  private _getOverlayRef(): OverlayRef {
    if (this._overlayRef) {
      return this._overlayRef;
    }

    const positionStrategy = this._overlay
      .position()
      .flexibleConnectedTo(this._input()!.getOverlayOrigin())
      .withFlexibleDimensions(false)
      .withPush(false)
      .withTransformOriginOn('.cute-timepicker-panel')
      //.withPopoverLocation('inline') // since ver.21
      .withPositions([
        {
          originX: 'start',
          originY: 'bottom',
          overlayX: 'start',
          overlayY: 'top',
          offsetY: 4,
        },
        {
          originX: 'start',
          originY: 'top',
          overlayX: 'start',
          overlayY: 'bottom',
          offsetY: -4,
          panelClass: 'cute-timepicker-above',
        },
      ]);

    this._overlayRef = this._overlay.create({
      positionStrategy,
      scrollStrategy: this._scrollStrategyFactory(),
      direction: this._dir || 'ltr',
      hasBackdrop: false,
      //disableAnimations: this._animationsDisabled,
    });

    this._overlayRef.detachments().subscribe(() => this.close());
    this._overlayRef.keydownEvents().subscribe(event => this._handleKeydown(event));
    this._overlayRef.outsidePointerEvents().subscribe(event => {
      const target = _getEventTarget(event) as HTMLElement;
      const origin = this._input()?.getOverlayOrigin().nativeElement;

      if (target && origin && target !== origin && !origin.contains(target)) {
        this.close();
      }
    });

    return this._overlayRef;
  }

  /** Generates the list of options from which the user can select. */
  private _generateOptions(): void {
    // Default the interval to 30 minutes.
    const interval = this.interval() ?? 30 * 60;
    const options = this.options();

    if (options !== null) {
      this._timeOptions = options;
    } else {
      const input = this._input();
      const adapter = this._dateAdapter;
      const timeFormat = this._dateFormats.display.timeInput;
      const min = input?.min() || adapter.setTime(adapter.today(), 0, 0, 0);
      const max = input?.max() || adapter.setTime(adapter.today(), 23, 59, 0);
      const cacheKey =
        interval + '/' + adapter.format(min, timeFormat) + '/' + adapter.format(max, timeFormat);

      // Don't re-generate the options if the inputs haven't changed.
      if (cacheKey !== this._optionsCacheKey) {
        this._optionsCacheKey = cacheKey;
        this._timeOptions = generateOptions(adapter, this._dateFormats, min, max, interval);
      }
    }
  }

  /**
   * Synchronizes the internal state of the component based on a specific selected date.
   * @param value Currently selected date.
   * @param options Options rendered out in the timepicker.
   * @param fallback Option to set as active if no option is selected.
   */
  private _syncSelectedState(
    value: D | null,
    options: readonly CuteOption[],
    fallback: CuteOption | null,
  ): void {
    let hasSelected = false;

    for (const option of options) {
      if (value && this._dateAdapter.sameTime(option.value, value)) {
        option.select(false);
        scrollOptionIntoView(option, 'center');
        untracked(() => this._keyManager.setActiveItem(option));
        hasSelected = true;
      } else {
        option.deselect(false);
      }
    }

    // If no option was selected, we need to reset the key manager since
    // it might be holding onto an option that no longer exists.
    if (!hasSelected) {
      if (fallback) {
        untracked(() => this._keyManager.setActiveItem(fallback));
        scrollOptionIntoView(fallback, 'center');
      } else {
        untracked(() => this._keyManager.setActiveItem(-1));
      }
    }
  }

  /** Handles keyboard events while the overlay is open. */
  private _handleKeydown(event: KeyboardEvent): void {
    const keyCode = event.keyCode;

    if (keyCode === TAB) {
      this.close();
    } else if (keyCode === ESCAPE && !hasModifierKey(event)) {
      event.preventDefault();
      this.close();
    } else if (keyCode === ENTER) {
      event.preventDefault();

      if (this._keyManager.activeItem) {
        this._selectValue(this._keyManager.activeItem);
      } else {
        this.close();
      }
    } else {
      const previousActive = this._keyManager.activeItem;
      this._keyManager.onKeydown(event);
      const currentActive = this._keyManager.activeItem;

      if (currentActive && currentActive !== previousActive) {
        scrollOptionIntoView(currentActive, 'nearest');
      }
    }
  }

  /** Sets up the logic that updates the timepicker when the locale changes. */
  private _handleLocaleChanges(): void {
    // Re-generate the options list if the locale changes.
    this._localeChanges = this._dateAdapter.localeChanges.subscribe(() => {
      this._optionsCacheKey = null;

      if (this.isOpen()) {
        this._generateOptions();
      }
    });
  }

  /**
   * Sets up the logic that updates the timepicker when the state of the connected input changes.
   */
  private _handleInputStateChanges(): void {
    effect(() => {
      const input = this._input();
      const options = this._options();

      if (this._isOpen() && input) {
        this._syncSelectedState(input.value(), options, null);
      }
    });
  }
}

/**
 * Scrolls an option into view.
 * @param option Option to be scrolled into view.
 * @param position Position to which to align the option relative to the scrollable container.
 */
function scrollOptionIntoView(option: CuteOption, position: ScrollLogicalPosition) {
  option._getHostElement().scrollIntoView({block: position, inline: position});
}
