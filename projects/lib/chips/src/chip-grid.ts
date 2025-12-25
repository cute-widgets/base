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
import {hasModifierKey, TAB} from '@angular/cdk/keycodes';
import {
  AfterContentInit,
  AfterViewInit,
  booleanAttribute,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ContentChildren,
  DoCheck,
  ElementRef,
  EventEmitter, inject,
  Input, isDevMode,
  OnDestroy,
  Optional,
  Output,
  QueryList,
  Self,
  ViewEncapsulation,
} from '@angular/core';
import {
  ControlValueAccessor,
  FormGroupDirective,
  NgControl,
  NgForm,
  Validators,
} from '@angular/forms';
import {ErrorStateMatcher, _ErrorStateTracker} from '@cute-widgets/base/core/error';
import {CuteFormFieldControl} from '@cute-widgets/base/form-field';
import {CuteChipTextControl} from './chip-text-control';
import {Observable, Subject, merge} from 'rxjs';
import {takeUntil} from 'rxjs/operators';
import {CuteChipEvent} from './chip';
import {CuteChipRow} from './chip-row';
import {CuteChipSet} from './chip-set';
import {Directionality} from '@angular/cdk/bidi';

/** Change event object that is emitted when the chip grid value has changed. */
export class CuteChipGridChange {
  constructor(
    /** Chip grid that emitted the event. */
    public source: CuteChipGrid,
    /** Value of the chip grid when the event was emitted. */
    public value: any,
  ) {}
}

/**
 * An extension of the CuteChipSet component used with CuteChipRow chips and
 * the cuteChipInputFor directive.
 */
@Component({
  selector: 'cute-chip-grid',
  template: `
    <div class="cute-chip-set__chips" role="presentation">
      <ng-content></ng-content>
    </div>
  `,
  styleUrl: './chip-set.scss',
  host: {
    'class': 'cute-chip-grid input-group-text',
    '[attr.role]': 'role',
    '[attr.tabindex]': '(disabled || (_chips && _chips.length === 0)) ? -1 : tabIndex',
    '[attr.aria-disabled]': 'disabled',
    '[attr.aria-invalid]': 'errorState',
    '[class.cute-chip-list-disabled]': 'disabled',
    '[class.cute-chip-list-invalid]': 'errorState',
    '[class.cute-chip-list-required]': 'required',
    '(focus)': 'focus()',
    '(blur)': '_blur()',
  },
  providers: [{provide: CuteFormFieldControl, useExisting: CuteChipGrid}],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
})
export class CuteChipGrid
  extends CuteChipSet
  implements
    AfterContentInit,
    AfterViewInit,
    ControlValueAccessor,
    DoCheck,
    CuteFormFieldControl<any>,
    OnDestroy
{
  ngControl = inject(NgControl, {optional: true, self: true})!;

  /**
   * Implemented as part of CuteFormFieldControl.
   * @docs-private
   */
  readonly controlType: string = 'cute-chip-grid';

  /** The chip input to add more chips */
  protected _chipInput: CuteChipTextControl | undefined;

  protected override _defaultRole = 'grid';
  private _errorStateTracker: _ErrorStateTracker;

  /**
   * List of element ids to propagate to the chipInput's `aria-describedby` attribute.
   */
  private _ariaDescribedbyIds: string[] = [];

  /**
   * Function when touched. Set as part of ControlValueAccessor implementation.
   * @docs-private
   */
  _onTouched = () => {};

  /**
   * Function when changed. Set as part of ControlValueAccessor implementation.
   * @docs-private
   */
  _onChange: (value: any) => void = () => {};

  /**
   * Implemented as part of CuteFormFieldControl.
   * @docs-private
   */
  @Input({transform: booleanAttribute})
  override get disabled(): boolean {
    return this.ngControl ? !!this.ngControl.disabled : this._disabled;
  }
  override set disabled(value: boolean) {
    this._disabled = value;
    this._syncChipsState();
  }

  /**
   * Implemented as part of CuteFormFieldControl.
   * @docs-private
   */
  get id(): string {
    return this._chipInput?.id || "";
  }

  /**
   * Implemented as part of CuteFormFieldControl.
   * @docs-private
   */
  override get empty(): boolean {
    return (
      (!this._chipInput || this._chipInput.empty) && (!this._chips || this._chips.length === 0)
    );
  }

  /**
   * Implemented as part of CuteFormFieldControl.
   * @docs-private
   */
  @Input()
  get placeholder(): string {
    return (this._chipInput ? this._chipInput.placeholder : this._placeholder) || "";
  }
  set placeholder(value: string) {
    this._placeholder = value;
    this.stateChanges.next();
  }
  protected _placeholder: string | undefined;

  /** Whether any chips or the `cuteChipInput` inside this <chip-grid> has focus. */
  override get focused(): boolean {
    return this._chipInput?.focused || this._hasFocusedChip();
  }

  /**
   * Implemented as part of CuteFormFieldControl.
   * @docs-private
   */
  @Input({transform: booleanAttribute})
  get required(): boolean {
    return this._required ?? this.ngControl?.control?.hasValidator(Validators.required) ?? false;
  }
  set required(value: boolean) {
    this._required = value;
    this.stateChanges.next();
  }
  protected _required: boolean | undefined;

  /**
   * Implemented as part of CuteFormFieldControl.
   * @docs-private
   */
  get shouldLabelFloat(): boolean {
    return !this.empty || this.focused;
  }

  /**
   * Implemented as part of CuteFormFieldControl.
   * @docs-private
   */
  @Input()
  get value(): any { return this._value; }
  set value(value: any) { this._value = value; }
  protected _value: any[] = [];

  /** An object used to control when error messages are shown. */
  @Input()
  get errorStateMatcher() { return this._errorStateTracker.matcher; }
  set errorStateMatcher(value: ErrorStateMatcher) {
    this._errorStateTracker.matcher = value;
  }

  /** Combined stream of all of the child chips' blur events. */
  get chipBlurChanges(): Observable<CuteChipEvent> {
    return this._getChipStream(chip => chip._onBlur);
  }

  /** Emits when the user has changed the chip grid value. */
  @Output() readonly change: EventEmitter<CuteChipGridChange> =
                                      new EventEmitter<CuteChipGridChange>();

  /**
   * Emits whenever the raw value of the <chip-grid> changes. This is here primarily
   * to facilitate the two-way binding for the `value` input.
   */
  @Output() readonly valueChange: EventEmitter<any> = new EventEmitter<any>();

  @ContentChildren(CuteChipRow, {
    // We need to use `descendants: true`, because Ivy will no longer match
    // indirect descendants if it's left as false.
    descendants: true,
  })
  // We need an initializer here to avoid a TS error. The value will be set in `ngAfterViewInit`.
  override _chips: QueryList<CuteChipRow> = undefined!;

  /**
   * Emits whenever the component state changes and should cause the parent
   * form-field to update. Implemented as part of `CuteFormFieldControl`.
   */
  readonly stateChanges = new Subject<void>();

  /** Whether the chip grid is in an error state. */
  get errorState() { return this._errorStateTracker.errorState; }
  set errorState(value: boolean) {
    this._errorStateTracker.errorState = value;
  }

  get controlElementRef(): ElementRef {
    return this._elementRef;
  }

  constructor(...args: unknown[]);
  constructor() {
    super();

    const parentForm = inject(NgForm, {optional: true});
    const parentFormGroup = inject(FormGroupDirective, {optional: true});
    const defaultErrorStateMatcher = inject(ErrorStateMatcher);

    if (this.ngControl) {
      this.ngControl.valueAccessor = this;
    }

    this._errorStateTracker = new _ErrorStateTracker(
      defaultErrorStateMatcher,
      this.ngControl,
      parentFormGroup,
      parentForm,
      this.stateChanges,
    );
  }

  ngAfterContentInit() {
    this.chipBlurChanges.pipe(takeUntil(this._destroyed)).subscribe(() => {
      this._blur();
      this.stateChanges.next();
    });

    merge(this.chipFocusChanges, this._chips.changes)
      .pipe(takeUntil(this._destroyed))
      .subscribe(() => this.stateChanges.next());
  }

  override ngAfterViewInit() {
    super.ngAfterViewInit();

    if (!this._chipInput && isDevMode()) {
      throw Error('cute-chip-grid must be used in combination with cuteChipInputFor.');
    }
  }

  ngDoCheck() {
    if (this.ngControl) {
      // We need to re-evaluate this on every change detection cycle, because there are some
      // error triggers that we can't subscribe to (e.g. parent form submissions). This means
      // that whatever logic is in here has to be super lean, or we risk destroying the performance.
      this.updateErrorState();
    }
  }

  override ngOnDestroy() {
    super.ngOnDestroy();
    this.stateChanges.complete();
  }

  /** Associates an HTML input element with this chip grid. */
  registerInput(inputElement: CuteChipTextControl): void {
    this._chipInput = inputElement;
    this._chipInput.setDescribedByIds(this._ariaDescribedbyIds);
  }

  /**
   * Implemented as part of CuteFormFieldControl.
   */
  onContainerClick(event: MouseEvent) {
    if (!this.disabled && !this._originatesFromChip(event)) {
      this.focus();
    }
  }

  _toggleFocusedStyle(force?: boolean) {
    if (this._elementRef.nativeElement.classList.contains("input-group-text")) {
      this._elementRef.nativeElement.classList.toggle("cute-chip-grid-focused", force);
    }
  }

  /**
   * Focuses the first chip in this chip grid, or the associated input when there
   * are no eligible chips.
   */
  override focus(): void {
    if (this.disabled || this._chipInput?.focused) {
      return;
    }

    if (!this._chips.length || this._chips.first.disabled) {
      // Delay until the next tick, because this can cause a "changed after checked"
      // error if the input does something on focus (e.g., opens an autocomplete).
      Promise.resolve().then(() => this._chipInput?.focus());
    } else {
      const activeItem = this._keyManager?.activeItem;

      if (activeItem) {
        activeItem.focus();
      } else {
        this._keyManager?.setFirstItemActive();
      }
    }

    this.stateChanges.next();
  }

  /**
   * Implemented as part of CuteFormFieldControl.
   */
  setDescribedByIds(ids: string[]) {
    // We must keep this up to date to handle the case where ids are set
    // before the chip input is registered.
    this._ariaDescribedbyIds = ids;
    this._chipInput?.setDescribedByIds(ids);
  }

  /**
   * Implemented as part of ControlValueAccessor.
   */
  writeValue(value: any): void {
    // The user is responsible for creating the child chips, so we just store the value.
    this._value = value;
  }

  /**
   * Implemented as part of ControlValueAccessor.
   */
  registerOnChange(fn: (value: any) => void): void {
    this._onChange = fn;
  }

  /**
   * Implemented as part of ControlValueAccessor.
   */
  registerOnTouched(fn: () => void): void {
    this._onTouched = fn;
  }

  /**
   * Implemented as part of ControlValueAccessor.
   */
  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
    this.stateChanges.next();
  }

  /** Refreshes the error state of the chip grid. */
  updateErrorState() {
    this._errorStateTracker.updateErrorState();
  }

  /** When blurred, mark the field as touched when focus moved outside the chip grid. */
  _blur() {
    if (!this.disabled) {

      this._toggleFocusedStyle(false);

      // Check whether the focus moved to chip input.
      // If the focus is not moved to chip input, mark the field as touched. If the focus moved
      // to chip input, do nothing.
      // Timeout is needed to wait for the focus() event trigger on chip input.
      setTimeout(() => {
        if (!this.focused) {
          this._propagateChanges();
          this._markAsTouched();
        }
      });
    }
  }

  /**
   * Removes the `tabindex` from the chip grid and resets it back afterward, allowing the
   * user to tab out of it. This prevents the grid from capturing focus and redirecting
   * it back to the first chip, creating a focus trap if its user tries to tab away.
   */
  protected override _allowFocusEscape() {
    if (!this._chipInput?.focused) {
      super._allowFocusEscape();
    }
  }

  /** Handles custom keyboard events. */
  override _handleKeydown(event: KeyboardEvent) {
    if (event.keyCode === TAB) {
      if (
        this._chipInput?.focused &&
        hasModifierKey(event, 'shiftKey') &&
        this._chips.length &&
        !this._chips.last.disabled
      ) {
        event.preventDefault();

        if (this._keyManager?.activeItem) {
          this._keyManager?.setActiveItem(this._keyManager.activeItem);
        } else {
          this._focusLastChip();
        }
      } else {
        // Use the super method here since it doesn't check for the input
        // focused state. This allows focus to escape if there's only one
        // disabled chip left in the list.
        super._allowFocusEscape();
      }
    } else if (!this._chipInput?.focused) {
      super._handleKeydown(event);
    }

    this.stateChanges.next();
  }

  _focusLastChip() {
    if (this._chips.length) {
      this._chips.last.focus();
    }
  }

  /** Emits change event to set the model value. */
  private _propagateChanges(): void {
    const valueToEmit = this._chips.length ? this._chips.toArray().map(chip => chip.value) : [];
    this._value = valueToEmit;
    this.change.emit(new CuteChipGridChange(this, valueToEmit));
    this.valueChange.emit(valueToEmit);
    this._onChange(valueToEmit);
    this._changeDetectorRef.markForCheck();
  }

  /** Mark the field as touched */
  private _markAsTouched() {
    this._onTouched();
    this._changeDetectorRef.markForCheck();
    this.stateChanges.next();
  }
}
