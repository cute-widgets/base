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
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from "@angular/forms";
import {
  AfterContentInit, booleanAttribute, ChangeDetectorRef,
  ContentChildren,
  Directive,
  EventEmitter,
  forwardRef, inject,
  InjectionToken, Input,
  OnDestroy,
  Output, QueryList
} from "@angular/core";
import {Subscription} from "rxjs";
import {ThemeColor} from "@cute-widgets/base/core";
import {CuteRadioButton, CuteRadioChange} from "./radio-button.component"

/**
 * Provider Expression that allows `cute-radio-group` to register as a `ControlValueAccessor`. This
 * allows it to support `[(ngModel)]` and `ngControl`.
 */
export const CUTE_RADIO_GROUP_CONTROL_VALUE_ACCESSOR: any = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => CuteRadioGroup),
  multi: true,
};

/**
 * Injection token that can be used to inject instances of `CuteRadioGroup`. It serves as
 * an alternative token to the actual `CuteRadioGroup` class which could cause unnecessary
 * retention of the class and its component metadata.
 */
export const CUTE_RADIO_GROUP = new InjectionToken<CuteRadioGroup>('CuteRadioGroup');

// Increasing integer for generating unique ids for checkbox components.
let nextUniqueId = 0;

/**
 * A group of radio buttons. May contain one or more `<cute-radio-button>` elements.
 */
@Directive({
  selector: 'cute-radio-group',
  exportAs: 'cuteRadioGroup',
  standalone: true,
  providers: [
    CUTE_RADIO_GROUP_CONTROL_VALUE_ACCESSOR,
    {provide: CUTE_RADIO_GROUP, useExisting: CuteRadioGroup},
  ],
  host: {
    'role': 'radiogroup',
    'class': 'cute-radio-group',
  },
})
export class CuteRadioGroup implements AfterContentInit, OnDestroy, ControlValueAccessor {
  private _changeDetector = inject(ChangeDetectorRef);

  /** Selected value for the radio group. */
  private _value: any = null;

  /** The HTML name attribute applied to radio buttons in this group. */
  private _name: string = `cute-radio-group-${nextUniqueId++}`;

  /** The currently selected radio button. Should match value. */
  private _selected: CuteRadioButton | null = null;

  /** Whether the `value` has been set to its initial value. */
  private _isInitialized: boolean = false;

  /** Whether the labels should appear after or before the radio-buttons. Defaults to 'after' */
  private _labelPosition: 'before' | 'after' = 'after';

  /** Whether the radio group is disabled. */
  private _disabled: boolean = false;

  /** Whether the radio group is required. */
  private _required: boolean = false;

  /** Subscription to changes in number of radio buttons. */
  private _buttonChanges: Subscription | undefined;

  /** The method to be called in order to update ngModel */
  _controlValueAccessorChangeFn: (value: any) => void = () => {};

  /**
   * onTouch function registered via registerOnTouch (ControlValueAccessor).
   * @docs-private
   */
  onTouched: () => any = () => {};

  /**
   * Event emitted when the group value changes.
   * Change events are only emitted when the value changes due to user interaction with
   * a radio button (the same behavior as `<input type-"radio">`).
   */
  @Output() readonly change: EventEmitter<CuteRadioChange> = new EventEmitter<CuteRadioChange>();

  /** Child radio buttons. */
  @ContentChildren(forwardRef(() => CuteRadioButton), {descendants: true})
  _radios: QueryList<CuteRadioButton> | undefined;

  /** Theme color for all the radio buttons in the group. */
  @Input() color: ThemeColor | undefined;

  /** Name of the radio button group. All radio buttons inside this group will use this name. */
  @Input()
  get name(): string { return this._name; }
  set name(value: string) {
    this._name = value;
    this._updateRadioButtonNames();
  }

  /** Whether the labels should appear after or before the radio-buttons. Defaults to 'after' */
  @Input()
  get labelPosition(): 'before' | 'after' { return this._labelPosition; }
  set labelPosition(v) {
    this._labelPosition = v === 'before' ? 'before' : 'after';
    this._markRadiosForCheck();
  }

  /**
   * Value for the radio-group. Should equal the value of the selected radio button if there is
   * a corresponding radio button with a matching value. If there is not such a corresponding
   * radio button, this value persists to be applied in case a new radio button is added with a
   * matching value.
   */
  @Input()
  get value(): any { return this._value; }
  set value(newValue: any) {
    if (this._value !== newValue) {
      // Set this before proceeding to ensure no circular loop occurs with selection.
      this._value = newValue;

      this._updateSelectedRadioFromValue();
      this._checkSelectedRadioButton();
    }
  }

  _checkSelectedRadioButton() {
    if (this._selected && !this._selected.checked) {
      this._selected.checked = true;
    }
  }

  /**
   * The currently selected radio button. If set to a new radio button, the radio group value
   * will be updated to match the new selected button.
   */
  @Input()
  get selected() { return this._selected; }
  set selected(selected: CuteRadioButton | null) {
    this._selected = selected;
    this.value = selected ? selected.value : null;
    this._checkSelectedRadioButton();
  }

  /** Whether the radio group is disabled */
  @Input({transform: booleanAttribute})
  get disabled(): boolean { return this._disabled; }
  set disabled(value: boolean) {
    this._disabled = value;
    this._markRadiosForCheck();
  }

  /** Whether the radio group is required */
  @Input({transform: booleanAttribute})
  get required(): boolean { return this._required; }
  set required(value: boolean) {
    this._required = value;
    this._markRadiosForCheck();
  }

  /** Whether buttons in the group should be interactive while they're disabled. */
  @Input({transform: booleanAttribute})
  get disabledInteractive(): boolean {
    return this._disabledInteractive;
  }
  set disabledInteractive(value: boolean) {
    this._disabledInteractive = value;
    this._markRadiosForCheck();
  }
  private _disabledInteractive = false;

  constructor(...args: unknown[]);
  constructor() {}

  /**
   * Initialize properties once content children are available.
   * This allows us to propagate relevant attributes to associated buttons.
   */
  ngAfterContentInit() {
    // Mark this component as initialized in AfterContentInit because the initial value can
    // possibly be set by NgModel on CuteRadioGroup, and it is possible that the OnInit of the
    // NgModel occurs *after* the OnInit of the CuteRadioGroup.
    this._isInitialized = true;

    // Clear the `selected` button when it's destroyed since the tabindex of the rest of the
    // buttons depends on it. Note that we don't clear the `value`, because the radio button
    // may be swapped out with a similar one and there are some internal apps that depend on
    // that behavior.
    if (this._radios) {
      this._buttonChanges = this._radios.changes.subscribe(() => {
        if (this.selected && this._radios && !this._radios.find(radio => radio === this.selected)) {
          this._selected = null;
        }
      });
    }
  }

  ngOnDestroy() {
    this._buttonChanges?.unsubscribe();
  }

  /**
   * Mark this group as being "touched" (for ngModel). Meant to be called by the contained
   * radio buttons upon their blur.
   */
  _touch() {
    if (this.onTouched) {
      this.onTouched();
    }
  }

  private _updateRadioButtonNames(): void {
    if (this._radios) {
      this._radios.forEach(radio => {
        radio.name = this.name;
        radio.markForCheck();
      });
    }
  }

  /** Updates the `selected` radio button from the internal _value state. */
  private _updateSelectedRadioFromValue(): void {
    // If the value already matches the selected radio, do nothing.
    const isAlreadySelected = this._selected !== null && this._selected.value === this._value;

    if (this._radios && !isAlreadySelected) {
      this._selected = null;
      this._radios.forEach(radio => {
        radio.checked = this.value === radio.value;
        if (radio.checked) {
          this._selected = radio;
        }
      });
    }
  }

  /** Dispatch change event with current selection and group value. */
  _emitChangeEvent(): void {
    if (this._isInitialized) {
      this.change.emit(new CuteRadioChange(this._selected!, this._value));
    }
  }

  _markRadiosForCheck() {
    if (this._radios) {
      this._radios.forEach(radio => radio.markForCheck());
    }
  }

  /**
   * Sets the model value. Implemented as part of ControlValueAccessor.
   * @param value
   */
  writeValue(value: any) {
    this.value = value;
    this._changeDetector.markForCheck();
  }

  /**
   * Registers a callback to be triggered when the model value changes.
   * Implemented as part of ControlValueAccessor.
   * @param fn Callback to be registered.
   */
  registerOnChange(fn: (value: any) => void) {
    this._controlValueAccessorChangeFn = fn;
  }

  /**
   * Registers a callback to be triggered when the control is touched.
   * Implemented as part of ControlValueAccessor.
   * @param fn Callback to be registered.
   */
  registerOnTouched(fn: any) {
    this.onTouched = fn;
  }

  /**
   * Sets the disabled state of the control. Implemented as a part of ControlValueAccessor.
   * @param isDisabled Whether the control should be disabled.
   */
  setDisabledState(isDisabled: boolean) {
    this.disabled = isDisabled;
    this._changeDetector.markForCheck();
  }
}
