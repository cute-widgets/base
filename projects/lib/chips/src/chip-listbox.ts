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
  booleanAttribute,
  ChangeDetectionStrategy,
  Component,
  ContentChildren,
  EventEmitter,
  forwardRef,
  inject,
  Input,
  OnDestroy,
  Output,
  QueryList,
  ViewEncapsulation,
} from '@angular/core';
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from '@angular/forms';
import {Observable} from 'rxjs';
import {startWith, takeUntil} from 'rxjs/operators';
import {TAB} from '@angular/cdk/keycodes';
import {CuteChip, CuteChipEvent} from './chip';
import {CuteChipOption, CuteChipSelectionChange} from './chip-option';
import {CuteChipSet} from './chip-set';
import {CuteChipAction} from './chip-action';
import {CUTE_CHIPS_DEFAULT_OPTIONS} from './tokens';

/** Change event object that is emitted when the chip listbox value has changed. */
export class CuteChipListboxChange {
  constructor(
    /** Chip listbox that emitted the event. */
    public source: CuteChipListbox,
    /** Value of the chip listbox when the event was emitted. */
    public value: any,
  ) {}
}

/**
 * Provider Expression that allows cute-chip-listbox to register as a ControlValueAccessor.
 * This allows it to support [(ngModel)].
 * @docs-private
 */
export const CUTE_CHIP_LISTBOX_CONTROL_VALUE_ACCESSOR: any = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => CuteChipListbox),
  multi: true,
};

/**
 * An extension of the CuteChipSet component that supports chip selection.
 * Used with CuteChipOption chips.
 */
@Component({
  selector: 'cute-chip-listbox',
  template: `
    <div class="cute-chip-set__chips" role="presentation">
      <ng-content></ng-content>
    </div>
  `,
  styleUrl: './chip-set.scss',
  host: {
    'class': 'cute-chip-listbox',
    '[attr.role]': 'role',
    '[tabIndex]': '(disabled || empty) ? -1 : tabIndex',
    // TODO: replace this binding with use of AriaDescriber
    //'[attr.aria-describedby]': '_ariaDescribedby || null',
    '[attr.aria-required]': 'role ? required : null',
    '[attr.aria-disabled]': 'disabled',
    '[attr.aria-multiselectable]': 'multiple',
    '[attr.aria-orientation]': 'ariaOrientation',
    '[class.cute-chip-list-disabled]': 'disabled',
    '[class.cute-chip-list-required]': 'required',
    '(focus)': 'focus()',
    '(blur)': '_blur()',
    '(keydown)': '_keydown($event)',
  },
  providers: [CUTE_CHIP_LISTBOX_CONTROL_VALUE_ACCESSOR],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
})
export class CuteChipListbox extends CuteChipSet
  implements AfterContentInit, OnDestroy, ControlValueAccessor
{
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

  // TODO: MDC uses `grid` here
  protected override _defaultRole = 'listbox';

  /** Value that was assigned before the listbox was initialized. */
  private _pendingInitialValue: any;

  /** Default chip options. */
  private _defaultOptions = inject(CUTE_CHIPS_DEFAULT_OPTIONS, {optional: true});

  /** Whether the user should be allowed to select multiple chips. */
  @Input({transform: booleanAttribute})
  get multiple(): boolean { return this._multiple; }
  set multiple(value: boolean) {
    this._multiple = value;
    this._syncListboxProperties();
  }
  private _multiple: boolean = false;

  /** The array of selected chips inside the chip listbox. */
  get selected(): CuteChipOption[] | CuteChipOption {
    const selectedChips = this._chips.toArray().filter(chip => chip.selected);
    return this.multiple ? selectedChips : selectedChips[0];
  }

  /** Orientation of the chip list. */
  @Input('aria-orientation') ariaOrientation: 'horizontal' | 'vertical' = 'horizontal';

  /**
   * Whether this chip listbox is selectable.
   *
   * When a chip listbox is not selectable, the selected states for all
   * the chips inside the chip listbox are always ignored.
   */
  @Input({transform: booleanAttribute})
  get selectable(): boolean { return this._selectable; }
  set selectable(value: boolean) {
    this._selectable = value;
    this._syncListboxProperties();
  }
  protected _selectable: boolean = true;

  /**
   * A function to compare the option values with the selected values. The first argument
   * is a value from an option. The second is a value from the selection. A boolean
   * should be returned.
   */
  @Input() compareWith: (o1: any, o2: any) => boolean = (o1: any, o2: any) => o1 === o2;

  /** Whether this chip listbox is required. */
  @Input({transform: booleanAttribute})
  required: boolean = false;

  /** Whether the checkmark indicator for single-selection options is hidden. */
  @Input({transform: booleanAttribute})
  get hideSingleSelectionIndicator(): boolean { return this._hideSingleSelectionIndicator; }
  set hideSingleSelectionIndicator(value: boolean) {
    this._hideSingleSelectionIndicator = value;
    this._syncListboxProperties();
  }
  private _hideSingleSelectionIndicator: boolean =
    this._defaultOptions?.hideSingleSelectionIndicator ?? false;

  /** The combined stream of all of the child chips' selection change events. */
  get chipSelectionChanges(): Observable<CuteChipSelectionChange> {
    return this._getChipStream<CuteChipSelectionChange, CuteChipOption>(chip => chip.selectionChange);
  }

  /** Combined stream of all of the child chips' blur events. */
  get chipBlurChanges(): Observable<CuteChipEvent> {
    return this._getChipStream(chip => chip._onBlur);
  }

  /** The value of the listbox, which is the combined value of the selected chips. */
  @Input()
  get value(): any { return this._value; }
  set value(value: any) {
    this.writeValue(value);
    this._value = value;
  }
  protected _value: any;

  /** Event emitted when the user has changed the selected chip listbox value. */
  @Output() readonly change: EventEmitter<CuteChipListboxChange> = new EventEmitter<CuteChipListboxChange>();

  @ContentChildren(CuteChipOption, {
    // We need to use `descendants: true`, because Ivy will no longer match
    // indirect descendants if it's left as false.
    descendants: true,
  })
  // We need an initializer here to avoid a TS error. The value will be set in `ngAfterViewInit`.
  override _chips: QueryList<CuteChipOption> = undefined!;

  ngAfterContentInit() {
    if (this._pendingInitialValue !== undefined) {
      Promise.resolve().then(() => {
        this._setSelectionByValue(this._pendingInitialValue, false);
        this._pendingInitialValue = undefined;
      });
    }

    this._chips.changes.pipe(startWith(null), takeUntil(this._destroyed)).subscribe(() => {
      // Update listbox selectable/multiple properties on chips
      this._syncListboxProperties();
    });

    this.chipBlurChanges.pipe(takeUntil(this._destroyed)).subscribe(() => this._blur());
    this.chipSelectionChanges.pipe(takeUntil(this._destroyed)).subscribe(event => {
      if (!this.multiple) {
        this._chips.forEach(chip => {
          if (chip !== event.source) {
            chip._setSelectedState(false, false, false);
          }
        });
      }

      if (event.isUserInput) {
        this._propagateChanges();
      }
    });
  }

  /**
   * Focuses the first selected chip in this chip listbox, or the first non-disabled chip when there
   * are no selected chips.
   */
  override focus(): void {
    if (this.disabled) {
      return;
    }

    const firstSelectedChip = this._getFirstSelectedChip();

    if (firstSelectedChip && !firstSelectedChip.disabled) {
      firstSelectedChip.focus();
    } else if (this._chips.length > 0) {
      this._keyManager?.setFirstItemActive();
    } else {
      this._elementRef.nativeElement.focus();
    }
  }

  /**
   * Implemented as part of ControlValueAccessor.
   * @docs-private
   */
  writeValue(value: any): void {
    if (this._chips) {
      this._setSelectionByValue(value, false);
    } else if (value != null) {
      this._pendingInitialValue = value;
    }
  }

  /**
   * Implemented as part of ControlValueAccessor.
   * @docs-private
   */
  registerOnChange(fn: (value: any) => void): void {
    this._onChange = fn;
  }

  /**
   * Implemented as part of ControlValueAccessor.
   * @docs-private
   */
  registerOnTouched(fn: () => void): void {
    this._onTouched = fn;
  }

  /**
   * Implemented as part of ControlValueAccessor.
   * @docs-private
   */
  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  /** Selects all chips with value. */
  _setSelectionByValue(value: any, isUserInput: boolean = true) {
    this._clearSelection();

    if (Array.isArray(value)) {
      value.forEach(currentValue => this._selectValue(currentValue, isUserInput));
    } else {
      this._selectValue(value, isUserInput);
    }
  }

  /** When blurred, marks the field as touched when focus moved outside the chip listbox. */
  _blur() {
    if (!this.disabled) {
      // Wait to see if focus moves to an individual chip.
      setTimeout(() => {
        if (!this.focused) {
          this._markAsTouched();
        }
      });
    }
  }

  _keydown(event: KeyboardEvent) {
    if (event.keyCode === TAB) {
      super._allowFocusEscape();
    }
  }

  /** Marks the field as touched */
  private _markAsTouched() {
    this._onTouched();
    this._changeDetectorRef.markForCheck();
  }

  /** Emits change event to set the model value. */
  private _propagateChanges(): void {
    let valueToEmit: any = null;

    if (Array.isArray(this.selected)) {
      valueToEmit = this.selected.map(chip => chip.value);
    } else {
      valueToEmit = this.selected ? this.selected.value : undefined;
    }
    this._value = valueToEmit;
    this.change.emit(new CuteChipListboxChange(this, valueToEmit));
    this._onChange(valueToEmit);
    this._changeDetectorRef.markForCheck();
  }

  /**
   * Deselects every chip in the listbox.
   * @param skip Chip that should not be deselected.
   */
  private _clearSelection(skip?: CuteChip): void {
    this._chips.forEach(chip => {
      if (chip !== skip) {
        chip.deselect();
      }
    });
  }

  /**
   * Finds and selects the chip based on its value.
   * @returns Chip that has the corresponding value.
   */
  private _selectValue(value: any, isUserInput: boolean): CuteChip | undefined {
    const correspondingChip = this._chips.find(chip => {
      return chip.value != null && this.compareWith(chip.value, value);
    });

    if (correspondingChip) {
      isUserInput ? correspondingChip.selectViaInteraction() : correspondingChip.select();
    }

    return correspondingChip;
  }

  /** Syncs the chip-listbox selection state with the individual chips. */
  private _syncListboxProperties() {
    if (this._chips) {
      // Defers setting the value to avoid the "Expression
      // has changed after it was checked" errors from Angular.
      Promise.resolve().then(() => {
        this._chips.forEach(chip => {
          chip._chipListMultiple = this.multiple;
          chip.chipListSelectable = this._selectable;
          chip._chipListHideSingleSelectionIndicator = this.hideSingleSelectionIndicator;
          chip._changeDetectorRef.markForCheck();
        });
      });
    }
  }

  /** Returns the first selected chip in this listbox, or undefined if no chips are selected. */
  private _getFirstSelectedChip(): CuteChipOption | undefined {
    if (Array.isArray(this.selected)) {
      return this.selected.length ? this.selected[0] : undefined;
    } else {
      return this.selected;
    }
  }

  /**
   * Determines if key manager should avoid putting a given chip action in the tab index. Skip
   * non-interactive actions since the user can't do anything with them.
   */
  protected override _skipPredicate(action: CuteChipAction): boolean {
    // Override the skip predicate in the base class to avoid skipping disabled chips. Allow
    // disabled chip options to receive focus to align with WAI ARIA recommendation. Normally WAI
    // ARIA's instructions are to exclude disabled items from the tab order, but it makes a few
    // exceptions for compound widgets.
    //
    // From [Developing a Keyboard Interface](
    // https://www.w3.org/WAI/ARIA/apg/practices/keyboard-interface/):
    //   "For the following composite widget elements, keep them focusable when disabled: Options in a
    //   Listbox..."
    return !action.isInteractive;
  }
}
