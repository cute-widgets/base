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
  Component,
  ChangeDetectionStrategy,
  ViewEncapsulation,
  Input,
  Optional,
  OnDestroy,
  ContentChild,
  AfterContentInit,
  ChangeDetectorRef,
  Self,
  ElementRef,
  Inject,
  OnChanges,
  SimpleChanges,
  booleanAttribute, isDevMode, inject, signal,
} from '@angular/core';
import {CuteFormFieldControl, CUTE_FORM_FIELD} from '@cute-widgets/base/form-field';
import {DateAdapter, IdGenerator} from '@cute-widgets/base/core';
import {ThemeColor} from '@cute-widgets/base/core';
import {NgControl, ControlContainer, Validators} from '@angular/forms';
import {Subject, merge, Subscription} from 'rxjs';
import {FocusOrigin, CdkMonitorFocus} from '@angular/cdk/a11y';
import {
  CuteStartDate,
  CuteEndDate,
  CuteDateRangeInputParent,
  CUTE_DATE_RANGE_INPUT_PARENT,
} from './date-range-input-parts';
import {CuteDatepickerControl, CuteDatepickerPanel} from './datepicker-base';
import {createMissingDateImplError} from './datepicker-errors';
import {DateFilterFn, dateInputsHaveChanged, _CuteFormFieldPartial} from './datepicker-input-base';
import {CuteDateRangePickerInput} from './date-range-picker';
import {DateRange, CuteDateSelectionModel} from './date-selection-model';

let nextUniqueId = 0;

@Component({
    selector: 'cute-date-range-input',
    templateUrl: './date-range-input.html',
    styleUrl: './date-range-input.scss',
    exportAs: 'cuteDateRangeInput',
    host: {
        'class': 'cute-date-range-input form-control',
        '[class.cute-date-range-input-hide-placeholders]': '_shouldHidePlaceholders()',
        '[class.cute-date-range-input-required]': 'required',
        '[class.cute-date-range-input-focused]': 'focused',
        '[class]': '"focus-ring-"+(getThemeColor()||"primary")',
        '[attr.id]': 'id',
        'role': 'group',
        '[attr.aria-labelledby]': '_getAriaLabelledby()',
        '[attr.aria-describedby]': '_ariaDescribedBy',
        // Used by the test harness to tie this input to its calendar. We can't depend on
        // `aria-owns` for this, because it's only defined while the calendar is open.
        '[attr.data-cute-calendar]': 'rangePicker ? rangePicker.id : null',
    },
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None,
    providers: [
        { provide: CuteFormFieldControl, useExisting: CuteDateRangeInput },
        { provide: CUTE_DATE_RANGE_INPUT_PARENT, useExisting: CuteDateRangeInput },
    ],
    imports: [CdkMonitorFocus]
})
export class CuteDateRangeInput<D>
  implements
    CuteFormFieldControl<DateRange<D>>,
    CuteDatepickerControl<D>,
    CuteDateRangeInputParent<D>,
    CuteDateRangePickerInput<D>,
    AfterContentInit,
    OnChanges,
    OnDestroy
{
  private _changeDetectorRef = inject(ChangeDetectorRef);
  private _elementRef = inject<ElementRef<HTMLElement>>(ElementRef);
  private _dateAdapter = inject<DateAdapter<D>>(DateAdapter, {optional: true})!;
  private _formField = inject<_CuteFormFieldPartial>(CUTE_FORM_FIELD, {optional: true});

  private _closedSubscription = Subscription.EMPTY;
  private _openedSubscription = Subscription.EMPTY;

  /** Current value of the range input. */
  get value() {
    return this._model ? this._model.selection : null;
  }

  /** Unique ID for the group. */
  id = inject(IdGenerator).getId("cute-date-range-input-");

  /** Whether the control is focused. */
  focused = false;

  /** Whether the control's label should float. */
  get shouldLabelFloat(): boolean {
    return this.focused || !this.empty;
  }

  /** Name of the form control. */
  controlType = 'cute-date-range-input';

  /**
   * Implemented as a part of `CuteFormFieldControl`.
   * Set the placeholder attribute on `cuteStartDate` and `cuteEndDate`.
   */
  get placeholder() {
    const start = this._startInput?._getPlaceholder() || '';
    const end = this._endInput?._getPlaceholder() || '';
    return start || end ? `${start} ${this.separator} ${end}` : '';
  }

  /** The range picker that this input is associated with. */
  @Input()
  get rangePicker() { return this._rangePicker; }
  set rangePicker(rangePicker: CuteDatepickerPanel<CuteDatepickerControl<D>, DateRange<D>, D>) {
    if (rangePicker) {
      this._model = rangePicker.registerInput(this);
      this._rangePicker = rangePicker;
      this._closedSubscription.unsubscribe();
      this._openedSubscription.unsubscribe();
      this._ariaOwns.set(this.rangePicker.opened ? rangePicker.id : null);
      this._closedSubscription = rangePicker.closedStream.subscribe(() => {
        this._startInput?._onTouched();
        this._endInput?._onTouched();
        this._ariaOwns.set(null);
      });
      this._openedSubscription = rangePicker.openedStream.subscribe(() => {
        this._ariaOwns.set(rangePicker.id);
      });
      this._registerModel(this._model!);    }
  }
  private _rangePicker!: CuteDatepickerPanel<CuteDatepickerControl<D>, DateRange<D>, D>;

  /** The id of the panel owned by this input. */
  _ariaOwns = signal<string | null>(null);

  /** Whether the input is required. */
  @Input({transform: booleanAttribute})
  get required(): boolean {
    return (
      this._required ??
      (this._isTargetRequired(this) ||
        this._isTargetRequired(this._startInput ?? null) ||
        this._isTargetRequired(this._endInput ?? null)) ??
      false
    );
  }
  set required(value: boolean) {
    this._required = value;
  }
  private _required: boolean | undefined;

  /** Function that can be used to filter out dates within the date range picker. */
  @Input()
  get dateFilter(): DateFilterFn<D>|undefined { return this._dateFilter; }
  set dateFilter(value: DateFilterFn<D> | null | undefined) {
    const start = this._startInput;
    const end = this._endInput;
    const wasMatchingStart = start && start._matchesFilter(start.value);
    const wasMatchingEnd = start && end && end._matchesFilter(start.value);
    this._dateFilter = value ?? undefined;

    if (start && start._matchesFilter(start.value) !== wasMatchingStart) {
      start._validatorOnChange();
    }

    if (end && end._matchesFilter(end.value) !== wasMatchingEnd) {
      end._validatorOnChange();
    }
  }
  private _dateFilter: DateFilterFn<D> | undefined;

  /** The minimum valid date. */
  @Input()
  get min(): D | null { return this._min; }
  set min(value: D | null) {
    const validValue = this._dateAdapter.getValidDateOrNull(this._dateAdapter.deserialize(value));

    if (!this._dateAdapter.sameDate(validValue, this._min)) {
      this._min = validValue;
      this._revalidate();
    }
  }
  private _min: D | null = null;

  /** The maximum valid date. */
  @Input()
  get max(): D | null { return this._max; }
  set max(value: D | null) {
    const validValue = this._dateAdapter.getValidDateOrNull(this._dateAdapter.deserialize(value));

    if (!this._dateAdapter.sameDate(validValue, this._max)) {
      this._max = validValue;
      this._revalidate();
    }
  }
  private _max: D | null = null;

  /** Whether the input is disabled. */
  @Input({transform: booleanAttribute})
  get disabled(): boolean {
    return this._startInput && this._endInput
      ? this._startInput.disabled && this._endInput.disabled
      : this._groupDisabled;
  }
  set disabled(value: boolean) {
    // CWT:
    // if (value !== this._groupDisabled) {
    //   this._groupDisabled = value;
    //   this.stateChanges.next(undefined);
    // }
    this.setDisabledState(value);
  }
  _groupDisabled = false;

  setDisabledState(value: boolean) {
    if (value !== this._groupDisabled) {
      this._groupDisabled = value;
      this.stateChanges.next(undefined);
    }
  }

  /** Whether the input is in an error state. */
  get errorState(): boolean {
    if (this._startInput && this._endInput) {
      return this._startInput.errorState || this._endInput.errorState;
    }
    return false;
  }

  /** Whether the datepicker input is empty. */
  get empty(): boolean {
    const startEmpty = this._startInput ? this._startInput.isEmpty() : false;
    const endEmpty = this._endInput ? this._endInput.isEmpty() : false;
    return startEmpty && endEmpty;
  }

  /** Value for the `aria-describedby` attribute of the inputs. */
  _ariaDescribedBy: string | null = null;

  /** Date selection model currently registered with the input. */
  private _model: CuteDateSelectionModel<DateRange<D>> | undefined;

  /** Separator text to be shown between the inputs. */
  @Input() separator = '–';

  /** Start of the comparison range that should be shown in the calendar. */
  @Input() comparisonStart: D | null = null;

  /** End of the comparison range that should be shown in the calendar. */
  @Input() comparisonEnd: D | null = null;

  @ContentChild(CuteStartDate) _startInput: CuteStartDate<D> | undefined;
  @ContentChild(CuteEndDate) _endInput: CuteEndDate<D> | undefined;

  /**
   * Implemented as a part of `CuteFormFieldControl`.
   * TODO(crisbeto): change type to `AbstractControlDirective` after #18206 lands.
   * @docs-private
   */
  ngControl: NgControl | null;

  /** Emits when the input's state has changed. */
  readonly stateChanges = new Subject<void>();

  /**
   * Disable the automatic labeling to avoid issues like #27241.
   * @docs-private
   */
  readonly disableAutomaticLabeling = true;

  readonly controlElementRef: ElementRef | undefined;

  constructor(...args: unknown[]);
  constructor() {
    if (!this._dateAdapter && isDevMode()) {
      throw createMissingDateImplError('DateAdapter');
    }

    // The datepicker module can be used both with MDC and non-MDC form fields. We have
    // to conditionally add the MDC input class so that the range picker looks correctly.
    /*
    if (_formField?._elementRef.nativeElement.classList.contains('cute-form-field')) {
      _elementRef.nativeElement.classList.add(
        'cute-input-element',
        'cute-form-field-input-control',
        'cute-text-field__input',
      );
    }
  */

    // TODO(crisbeto): remove `as any` after #18206 lands.
    this.ngControl = inject(ControlContainer, {optional: true, self: true}) as any;

    this.controlElementRef = this._elementRef;
  }

  /**
   * Implemented as a part of `CuteFormFieldControl`.
   */
  setDescribedByIds(ids: string[]): void {
    this._ariaDescribedBy = ids.length ? ids.join(' ') : null;
  }

  /**
   * Implemented as part of CuteFormFieldControl.
   */
  get describedByIds(): string[] {
    const element = this._elementRef.nativeElement;
    const existingDescribedBy = element.getAttribute('aria-describedby');

    return existingDescribedBy?.split(' ') || [];
  }

  /**
   * Implemented as a part of `CuteFormFieldControl`.
   */
  onContainerClick(): void {
    if (!this.focused && !this.disabled) {
      if (!this._model || !this._model.selection.start) {
        this._startInput?.focus();
      } else {
        this._endInput?.focus();
      }
    }
  }

  ngAfterContentInit() {
    if (isDevMode()) {
      if (!this._startInput) {
        throw Error('cute-date-range-input must contain a cuteStartDate input');
      }

      if (!this._endInput) {
        throw Error('cute-date-range-input must contain a cuteEndDate input');
      }
    }

    if (this._model) {
      this._registerModel(this._model);
    }

    // We don't need to unsubscribe from this, because we
    // know that the input streams will be completed on destroy.
    if (this._startInput && this._endInput) {
      merge(this._startInput.stateChanges,
            this._endInput.stateChanges)
        .subscribe(() => {
          this.stateChanges.next(undefined);
        });
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    if (dateInputsHaveChanged(changes, this._dateAdapter)) {
      this.stateChanges.next(undefined);
    }
  }

  ngOnDestroy() {
    this._closedSubscription.unsubscribe();
    this._openedSubscription.unsubscribe();
    this.stateChanges.complete();
  }

  /** Gets the date at which the calendar should start. */
  getStartValue(): D | null {
    return this.value ? this.value.start : null;
  }

  /** Gets the input's theme palette. */
  getThemeColor(): ThemeColor | undefined {
    return this._formField ? this._formField.color : undefined;
  }

  /** Gets the element to which the calendar overlay should be attached. */
  getConnectedOverlayOrigin(): ElementRef {
    return this._formField ? this._formField.getConnectedOverlayOrigin() : this._elementRef;
  }

  /** Gets the ID of an element that should be used a description for the calendar overlay. */
  getOverlayLabelId(): string | null {
    return this._formField ? this._formField.getLabelId() : null;
  }

  /** Gets the value that is used to mirror the state input. */
  protected _getInputMirrorValue(part: 'start' | 'end') {
    const input = part === 'start' ? this._startInput : this._endInput;
    return input ? input.getMirrorValue() : '';
  }

  /** Whether the input placeholders should be hidden. */
  protected _shouldHidePlaceholders() {
    return this._startInput ? !this._startInput.isEmpty() : false;
  }

  /**
   *  Handles the value in one of the child inputs changing.
   *  Implementing interface `CuteDateRangeInputParent`.
   */
  _handleChildValueChange() {
    this.stateChanges.next(undefined);
    this._changeDetectorRef.markForCheck();
  }

  /**
   * Opens the date range picker associated with the input.
   * Implementing interface `CuteDateRangeInputParent`.
   */
  _openDatepicker() {
    if (this._rangePicker) {
      this._rangePicker.open();
    }
  }

  /** Whether the separate text should be hidden. */
  protected _shouldHideSeparator() {
    return (
      (!this._formField ||
        (this._formField.getLabelId() && !this._formField._shouldLabelFloat())) &&
      this.empty
    );
  }

  /** Gets the value for the `aria-labelledby` attribute of the inputs. */
  protected _getAriaLabelledby() {
    const formField = this._formField;
    return formField && formField._hasFloatingLabel() ? formField._labelId : null;
  }

  /**
   * Implementing interface `CuteDateRangeInputParent`.
   */
  _getStartDateAccessibleName(): string {
    return this._startInput?._getAccessibleName() ?? "";
  }

  /**
   * Implementing interface `CuteDateRangeInputParent`.
   */
  _getEndDateAccessibleName(): string {
    return this._endInput?._getAccessibleName() ?? "";
  }

  /** Updates the focused state of the range input. */
  _updateFocus(origin: FocusOrigin) {
    this.focused = origin !== null;
    this.stateChanges.next();
  }

  /** Re-runs the validators on the start/end inputs. */
  private _revalidate() {
    if (this._startInput) {
      this._startInput._validatorOnChange();
    }

    if (this._endInput) {
      this._endInput._validatorOnChange();
    }
  }

  /** Registers the current date selection model with the start/end inputs. */
  private _registerModel(model: CuteDateSelectionModel<DateRange<D>>) {
    if (this._startInput) {
      this._startInput._registerModel(model);
    }

    if (this._endInput) {
      this._endInput._registerModel(model);
    }
  }

  /** Checks whether a specific range input directive is required. */
  private _isTargetRequired(target: {ngControl: NgControl | null} | null): boolean | undefined {
    return target?.ngControl?.control?.hasValidator(Validators.required);
  }
}
