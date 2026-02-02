/**
 * @license Apache-2.0
 *
 * Copyright (c) 2025 CuteWidgets Team. All Rights Reserved.
 *
 * You may not use this file except in compliance with the License
 * that can be found at http://www.apache.org/licenses/LICENSE-2.0
 */
import {
  AfterContentInit, booleanAttribute,
  ContentChildren,
  Directive, EventEmitter,
  forwardRef, inject,
  InjectionToken, Input, isDevMode,
  OnInit, Output,
  QueryList
} from "@angular/core";
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from "@angular/forms";
import {SelectionModel} from "@angular/cdk/collections";
import {DOWN_ARROW, LEFT_ARROW, RIGHT_ARROW, UP_ARROW, SPACE, ENTER, hasModifierKey} from '@angular/cdk/keycodes';
import {
  CUTE_BUTTON_TOGGLE_DEFAULT_OPTIONS,
  CuteButtonToggle,
  CuteButtonToggleChange,
  CuteButtonToggleDefaultOptions
} from "./button-toggle.component";
import {Direction, Directionality} from "@angular/cdk/bidi";
import {CuteButtonGroup, CuteButtonStyle, CUTE_BUTTON_GROUP} from '@cute-widgets/base/button';
import {BooleanInput} from '@angular/cdk/coercion';

/**
 * Injection token that can be used to reference instances of `CuteButtonToggleGroup`.
 * It serves as an alternative token to the actual `CuteButtonToggleGroup` class which
 * could cause unnecessary retention of the class and its component metadata.
 */
export const CUTE_BUTTON_TOGGLE_GROUP = new InjectionToken<CuteButtonToggleGroup>(
  'CuteButtonToggleGroup',
);

/**
 * Provider Expression that allows cute-button-toggle-group to register as a ControlValueAccessor.
 * This allows it to support [(ngModel)].
 * @docs-private
 */
export const CUTE_BUTTON_TOGGLE_GROUP_VALUE_ACCESSOR: any = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => CuteButtonToggleGroup),
  multi: true,
};

// Counter used to generate unique IDs.
let uniqueIdCounter = 0;

/** Exclusive selection button toggle group that behaves like a radio-button group. */
@Directive({
  selector: 'cute-button-toggle-group',
  exportAs: 'cuteButtonToggleGroup',
  host: {
    'class': 'cute-button-toggle-group',
    '[attr.role]': 'multiple ? "group" : "radiogroup"',
    '(keydown)': '_keydown($event)',
  },
  providers: [
    CUTE_BUTTON_TOGGLE_GROUP_VALUE_ACCESSOR,
    {provide: CUTE_BUTTON_GROUP, useExisting: CuteButtonToggleGroup},
    {provide: CUTE_BUTTON_TOGGLE_GROUP, useExisting: CuteButtonToggleGroup},
  ],
})
export class CuteButtonToggleGroup extends CuteButtonGroup implements ControlValueAccessor, OnInit, AfterContentInit {
  private _dir = inject(Directionality, {optional: true});
  private _multiple = false;
  private _selectionModel: SelectionModel<CuteButtonToggle> | undefined;

  /**
   * Reference to the raw value that the consumer tried to assign. The real
   * value will exclude any values from this one that don't correspond to a
   * toggle. Useful for the cases where the value is assigned before the toggles
   * have been initialized or at the same that they're being swapped out.
   */
  private _rawValue: any;

  /**
   * The method to be called in order to update ngModel.
   * Now `ngModel` binding is not supported in multiple selection mode.
   */
  private _controlValueAccessorChangeFn: (value: any) => void = () => {};

  /** onTouch function registered via registerOnTouch (ControlValueAccessor). */
  _onTouched: () => any = () => {};

  /** Child button toggle buttons. */
  @ContentChildren(forwardRef(() => CuteButtonToggle), {
    // Note that this would technically pick up toggles
    // from nested groups, but that's not a case that we support.
    descendants: true,
  })
  _buttonToggles: QueryList<CuteButtonToggle> | undefined;

  /** The button toggle default style. Only outlined buttons supported. */
  override buttonStyle: Extract<CuteButtonStyle, "outlined"|"outline-button"> = "outline-button";

  /** `name` attribute for the underlying `input` element. */
  @Input()
  get name(): string { return this._name; }
  set name(value: string) {
    this._name = value;
    this._markButtonsForCheck();
  }
  private _name = `cute-button-toggle-group-${uniqueIdCounter++}`;

  /** Value of the toggle group. */
  @Input()
  get value(): any {
    const selected = this._selectionModel ? this._selectionModel.selected : [];

    if (this.multiple) {
      return selected.map(toggle => toggle.value);
    }

    return selected[0] ? selected[0].value : undefined;
  }
  set value(newValue: any) {
    this._setSelectionByValue(newValue);
    this.valueChange.emit(this.value);
  }

  /** Selected button toggles in the group. */
  get selected(): CuteButtonToggle | CuteButtonToggle[] {
    const selected = this._selectionModel ? this._selectionModel.selected : [];
    return this.multiple ? selected : selected[0] || null;
  }

  /** Whether multiple button toggles can be selected. */
  @Input({transform: booleanAttribute})
  get multiple(): boolean { return this._multiple; }
  set multiple(value: boolean) {
    this._multiple = value;
    this._markButtonsForCheck();
  }

  /** Whether buttons in the group should be interactive while they're disabled. */
  @Input({transform: booleanAttribute})
  get disabledInteractive(): boolean { return this._disabledInteractive; }
  set disabledInteractive(value: boolean) {
    this._disabledInteractive = value;
    this._markButtonsForCheck();
  }
  private _disabledInteractive = false;

  /** Whether the checkmark indicator for single-selection button toggle groups is hidden. */
  @Input({transform: booleanAttribute})
  get hideSingleSelectionIndicator(): boolean { return this._hideSingleSelectionIndicator; }
  set hideSingleSelectionIndicator(value: boolean) {
    this._hideSingleSelectionIndicator = value;
    this._markButtonsForCheck();
  }
  private _hideSingleSelectionIndicator: boolean = false;

  /** Whether the checkmark indicator for multiple-selection button toggle groups is hidden. */
  @Input({transform: booleanAttribute})
  get hideMultipleSelectionIndicator(): boolean { return this._hideMultipleSelectionIndicator; }
  set hideMultipleSelectionIndicator(value: boolean) {
    this._hideMultipleSelectionIndicator = value;
    this._markButtonsForCheck();
  }
  private _hideMultipleSelectionIndicator: boolean = false;

  /**
   * Event that emits whenever the value of the group changes.
   * Used to facilitate two-way data binding.
   * @docs-private
   */
  @Output() readonly valueChange = new EventEmitter<any>();

  /** Event emitted when the group's value changes. */
  @Output() readonly change = new EventEmitter<CuteButtonToggleChange>();


  /** The layout direction of the toggle button group. */
  get dir(): Direction {
    return this._dir && this._dir.value === 'rtl' ? 'rtl' : 'ltr';
  }

  constructor(...args: unknown[]);
  constructor() {
    super();

    const defaultOptions = inject<CuteButtonToggleDefaultOptions>(
      CUTE_BUTTON_TOGGLE_DEFAULT_OPTIONS,
      {optional: true},
    );

    //this.appearance =
    //  defaultOptions && defaultOptions.appearance ? defaultOptions.appearance : 'standard';
    this.hideSingleSelectionIndicator = defaultOptions?.hideSingleSelectionIndicator ?? false;
    this.hideMultipleSelectionIndicator = defaultOptions?.hideMultipleSelectionIndicator ?? false;
  }

  override ngOnInit() {
    super.ngOnInit();
    this._selectionModel = new SelectionModel<CuteButtonToggle>(this.multiple, undefined, false);
  }

  override ngAfterContentInit() {
    super.ngAfterContentInit();

    if (this._buttonToggles) {
      this._selectionModel?.select(...this._buttonToggles.filter(toggle => toggle.checked));
    }
    if (!this.multiple) {
      this._initializeTabIndex();
    }
  }

  /** Initializes the tabindex attribute using the radio pattern. */
  private _initializeTabIndex() {
    if (this._buttonToggles) {
      this._buttonToggles.forEach(toggle => {
        toggle.tabIndex = -1;
      });
      if (this.selected) {
        (this.selected as CuteButtonToggle).tabIndex = 0;
      } else {
        for (let i = 0; i < this._buttonToggles.length; i++) {
          const toggle = this._buttonToggles.get(i)!;

          if (!toggle.disabled) {
            toggle.tabIndex = 0;
            break;
          }
        }
      }
      this._markButtonsForCheck();
    }
  }

  /**
   * Implemented as part of ControlValueAccessor.
   *
   * @inheritDoc
   */
  override setDisabledState(newState: BooleanInput, emitEvent?: boolean): boolean {
    return super.setDisabledState(newState, emitEvent);
  }

  /**
   * Sets the model value. Implemented as part of ControlValueAccessor.
   * @param value Value to be set to the model.
   */
  writeValue(value: any) {
    this.value = value;
    this.markForCheck();
  }

  // Implemented as part of ControlValueAccessor.
  registerOnChange(fn: (value: any) => void) {
    this._controlValueAccessorChangeFn = fn;
  }

  // Implemented as part of ControlValueAccessor.
  registerOnTouched(fn: any) {
    this._onTouched = fn;
  }


  /** Handle keydown event calling to single-select button toggle. */
  protected _keydown(event: KeyboardEvent) {
    if (this.multiple || this.disabled || hasModifierKey(event) ||  !this._buttonToggles) {
      return;
    }

    const target = event.target as HTMLButtonElement;
    const buttonId = target.id;
    const index = this._buttonToggles.toArray().findIndex(toggle => {
      return toggle.buttonId === buttonId;
    });

    if (index == -1) { return; }

    let nextButton: CuteButtonToggle | null = null;
    switch (event.keyCode) {
      case SPACE:
      case ENTER:
        nextButton = this._buttonToggles.get(index) || null;
        //nextButton.checked = true;
        break;
      case UP_ARROW:
        nextButton = this._getNextButton(index, -1);
        break;
      case LEFT_ARROW:
        nextButton = this._getNextButton(index, this.dir === 'ltr' ? -1 : 1);
        break;
      case DOWN_ARROW:
        nextButton = this._getNextButton(index, 1);
        break;
      case RIGHT_ARROW:
        nextButton = this._getNextButton(index, this.dir === 'ltr' ? 1 : -1);
        break;
      default:
        return;
    }

    if (nextButton) {
      event.preventDefault();
      nextButton._onButtonClick();
      nextButton.focus();
    }
  }

  /** Dispatch change event with current selection and group value. */
  private _emitChangeEvent(toggle: CuteButtonToggle): void {
    const event = new CuteButtonToggleChange(toggle, this.value);
    this._rawValue = event.value;
    this._controlValueAccessorChangeFn(event.value);
    this.change.emit(event);
  }

  /**
   * Syncs a button toggle's selected state with the model value.
   * @param toggle Toggle to be synced.
   * @param select Whether the toggle should be selected.
   * @param isUserInput Whether the change was a result of a user interaction.
   * @param deferEvents Whether to defer emitting the change events.
   */
  _syncButtonToggle(
    toggle: CuteButtonToggle,
    select: boolean,
    isUserInput = false,
    deferEvents = false,
  ) {
    // Deselect the currently selected toggle if we're in single-selection
    // mode and the button being toggled isn't selected at the moment.
    if (!this.multiple && this.selected && !toggle.checked) {
      (this.selected as CuteButtonToggle).checked = false;
    }

    if (this._selectionModel) {
      if (select) {
        this._selectionModel.select(toggle);
      } else {
        this._selectionModel.deselect(toggle);
      }
    } else {
      deferEvents = true;
    }

    // We need to defer in some cases in order to avoid "changed after checked errors", however,
    // the side effect is that we may end up updating the model value out of sequence in others
    // The `deferEvents` flag allows us to decide whether to do it on a case-by-case basis.
    if (deferEvents) {
      Promise.resolve().then(() => this._updateModelValue(toggle, isUserInput));
    } else {
      this._updateModelValue(toggle, isUserInput);
    }
  }

  /** Checks whether a button toggle is selected. */
  _isSelected(toggle: CuteButtonToggle): boolean {
    return this._selectionModel ? this._selectionModel.isSelected(toggle) : false;
  }

  /** Determines whether a button toggle should be checked on init. */
  _isPrechecked(toggle: CuteButtonToggle) {
    if (typeof this._rawValue === 'undefined') {
      return false;
    }

    if (this.multiple && Array.isArray(this._rawValue)) {
      return this._rawValue.some(value => toggle.value != null && value === toggle.value);
    }

    return toggle.value === this._rawValue;
  }

  /** Obtains the subsequent toggle to which the focus shifts. */
  private _getNextButton(startIndex: number, offset: number): CuteButtonToggle | null {
    const items = this._buttonToggles;

    if (items) {
      for (let i = 1; i <= items.length; i++) {
        const index = (startIndex + offset * i + items.length) % items.length;
        const item = items.get(index);

        if (item && !item.disabled) {
          return item;
        }
      }
    }

    return null;
  }

  /** Updates the selection state of the toggles in the group based on a value. */
  private _setSelectionByValue(value: any | any[]) {
    this._rawValue = value;

    if (!this._buttonToggles) {
      return;
    }

    const toggles = this._buttonToggles.toArray();

    if (this.multiple && value) {
      if (!Array.isArray(value) && isDevMode() ) {
        throw Error('Value must be an array in multiple-selection mode.');
      }

      this._clearSelection();
      value.forEach((currentValue: any) => this._selectValue(currentValue, toggles));
    } else {
      this._clearSelection();
      this._selectValue(value, toggles);
    }

    // In single selection mode, we need at least one enabled toggle to always be focusable.
    if (!this.multiple && toggles.every(toggle => toggle.tabIndex === -1)) {
      for (const toggle of toggles) {
        if (!toggle.disabled) {
          toggle.tabIndex = 0;
          break;
        }
      }
    }
  }

  /** Clears the selected toggles. */
  private _clearSelection() {
    this._selectionModel?.clear();
    this._buttonToggles?.forEach(toggle => {
      toggle.checked = false;
      // If the button toggle is in single select mode, initialize the tabIndex.
      if (!this.multiple) {
        toggle.tabIndex = -1;
      }
    });
  }

  /** Selects a value if there's a toggle that corresponds to it. */
  private _selectValue(value: any, toggles: CuteButtonToggle[]) {
    if (this._selectionModel) {
      for (const toggle of toggles) {
        if (toggle.value != null && toggle.value === value) {
          toggle.checked = true;
          this._selectionModel.select(toggle);
          if (!this.multiple) {
            // If the button toggle is in single select mode, reset the tabIndex.
            toggle.tabIndex = 0;
          }
          break;
        }
      }
    }
  }

  /** Syncs up the group's value with the model and emits the change event. */
  private _updateModelValue(toggle: CuteButtonToggle, isUserInput: boolean) {
    // Only emit the change event for user input.
    if (isUserInput) {
      this._emitChangeEvent(toggle);
    }

    // Note: we emit this one no matter whether it was a user interaction, because
    // it is used by Angular to sync up the two-way data binding.
    this.valueChange.emit(this.value);
  }

}
