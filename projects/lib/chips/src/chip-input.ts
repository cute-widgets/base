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
import {BACKSPACE, hasModifierKey} from '@angular/cdk/keycodes';
import {
  Directive,
  ElementRef,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  Output,
  booleanAttribute, inject,
} from '@angular/core';
import {CuteFormField, CUTE_FORM_FIELD} from '@cute-widgets/base/form-field';
import {CuteChipsDefaultOptions, CUTE_CHIPS_DEFAULT_OPTIONS} from './tokens';
import {CuteChipGrid} from './chip-grid';
import {CuteChipTextControl} from './chip-text-control';

/** Represents an input event on a `matChipInput`. */
export interface CuteChipInputEvent {
  /**
   * The native `<input>` element that the event is being fired for.
   * @deprecated Use `CuteChipInputEvent#chipInput.inputElement` instead.
   * @breaking-change 13.0.0 This property will be removed.
   */
  input: HTMLInputElement;

  /** The value of the input. */
  value: string;

  /** Reference to the chip input that emitted the event. */
  chipInput: CuteChipInput;
}

// Increasing integer for generating unique ids.
let nextUniqueId = 0;

/**
 * Directive that adds chip-specific behaviors to an input element inside `<cute-form-field>`.
 * May be placed inside or outside a `<cute-chip-grid>`.
 */
@Directive({
  selector: 'input[cuteChipInputFor]',
  exportAs: 'cuteChipInput, cuteChipInputFor',
  host: {
    'class': 'cute-chip-input',
    '(keydown)': '_keydown($event)',
    '(blur)': '_blur()',
    '(focus)': '_focus()',
    '(input)': '_onInput()',
    '[id]': 'id',
    '[attr.disabled]': 'disabled && !disabledInteractive ? "" : null',
    '[attr.placeholder]': 'placeholder || null',
    '[attr.aria-invalid]': 'chipGrid && chipGrid.ngControl ? chipGrid.ngControl.invalid : null',
    '[attr.aria-required]': '(chipGrid && chipGrid.required) || null',
    '[attr.aria-disabled]': 'disabled && disabledInteractive ? "true" : null',
    '[attr.readonly]': '_getReadonlyAttribute()',
    '[attr.required]': '(chipGrid && chipGrid.required) || null',
  },
  standalone: true,
})
export class CuteChipInput implements CuteChipTextControl, OnChanges, OnDestroy {
  protected _elementRef = inject<ElementRef<HTMLInputElement>>(ElementRef);

  /** Used to prevent focus moving to chips while user is holding backspace */
  private _focusLastChipOnBackspace: boolean = false;

  /** Whether the control is focused. */
  focused: boolean = false;

  /** Register input for a chip list */
  @Input('cuteChipInputFor')
  get chipGrid(): CuteChipGrid | undefined { return this._chipGrid; }
  set chipGrid(value: CuteChipGrid) {
    if (value) {
      this._chipGrid = value;
      this._chipGrid.registerInput(this);
    }
  }
  private _chipGrid: CuteChipGrid | undefined;

  /**
   * Whether the `chipEnd` event will be emitted when the input is blurred.
   */
  @Input({alias: 'cuteChipInputAddOnBlur', transform: booleanAttribute})
  addOnBlur: boolean = false;

  /**
   * The list of key codes that will trigger a `chipEnd` event.
   *
   * Defaults to `[ENTER]`.
   */
  @Input('cuteChipInputSeparatorKeyCodes')
  separatorKeyCodes: readonly number[] | ReadonlySet<number>;

  /** Emitted when a chip is to be added. */
  @Output('cuteChipInputTokenEnd')
  readonly chipEnd: EventEmitter<CuteChipInputEvent> = new EventEmitter<CuteChipInputEvent>();

  /** The input's placeholder text. */
  @Input() placeholder: string = '';

  /** Unique id for the input. */
  @Input() id: string = `cute-chip-list-input-${nextUniqueId++}`;

  /** Whether the input is disabled. */
  @Input({transform: booleanAttribute})
  get disabled(): boolean {
    return (this._disabled || (this._chipGrid && this._chipGrid.disabled)) ?? false;
  }
  set disabled(value: boolean) {
    this._disabled = value;
  }
  private _disabled: boolean = false;

  /** Whether the input is readonly. */
  @Input({transform: booleanAttribute})
  readonly: boolean = false;

  /** Whether the input should remain interactive when it is disabled. */
  @Input({alias: 'cuteChipInputDisabledInteractive', transform: booleanAttribute})
  disabledInteractive: boolean = false;

  /** Whether the input is empty. */
  get empty(): boolean {
    return !this.inputElement.value;
  }

  /** The native input element to which this directive is attached. */
  readonly inputElement!: HTMLInputElement;

  constructor(...args: unknown[]);

  constructor() {
    const defaultOptions = inject<CuteChipsDefaultOptions>(CUTE_CHIPS_DEFAULT_OPTIONS);
    const formField = inject<CuteFormField>(CUTE_FORM_FIELD, {optional: true});

    this.inputElement = this._elementRef.nativeElement as HTMLInputElement;
    this.separatorKeyCodes = defaultOptions.separatorKeyCodes;
    this.disabledInteractive = defaultOptions.inputDisabledInteractive ?? false;

    if (formField) {
      this.inputElement.classList.add('cute-form-field-input-control');
    }
  }

  ngOnChanges() {
    this._chipGrid?.stateChanges.next();
  }

  ngOnDestroy(): void {
    this.chipEnd.complete();
  }

  /** Utility method to make host definition/tests more clear. */
  _keydown(event: KeyboardEvent) {
    if (this.empty && event.keyCode === BACKSPACE) {
      // Ignore events where the user is holding down backspace
      // so that we don't accidentally remove too many chips.
      if (!event.repeat) {
        this._chipGrid?._focusLastChip();
      }
      event.preventDefault();
    } else {
      this._emitChipEnd(event);
    }
  }

  /** Checks to see if the blur should emit the (chipEnd) event. */
  _blur() {
    if (this.addOnBlur) {
      this._emitChipEnd();
    }
    this.focused = false;
    // Blur the chip list if it is not focused
    if (this._chipGrid) {
      if (!this._chipGrid.focused) {
        this._chipGrid._blur();
      }
      this._chipGrid.stateChanges.next();
    }
  }

  _focus() {
    this.focused = true;
    this._focusLastChipOnBackspace = this.empty;
    this._chipGrid?._toggleFocusedStyle(true);
    this._chipGrid?.stateChanges.next();
  }

  /** Checks to see if the (chipEnd) event needs to be emitted. */
  _emitChipEnd(event?: KeyboardEvent) {
    if (!event || this._isSeparatorKey(event)) {
      this.chipEnd.emit({
        input: this.inputElement,
        value: this.inputElement.value,
        chipInput: this,
      });

      event?.preventDefault();
    }
  }

  _onInput() {
    // Let the chip list know whenever the value changes.
    this._chipGrid?.stateChanges.next();
  }

  /** Focuses the input. */
  focus(): void {
    this.inputElement.focus();
  }

  /** Clears the input */
  clear(): void {
    this.inputElement.value = '';
    this._focusLastChipOnBackspace = true;
  }

  setDescribedByIds(ids: string[]): void {
    const element = this._elementRef.nativeElement;

    // Set the value directly in the DOM since this binding
    // is prone to "changed after checked" errors.
    if (ids.length) {
      element.setAttribute('aria-describedby', ids.join(' '));
    } else {
      element.removeAttribute('aria-describedby');
    }
  }

  /** Checks whether a keycode is one of the configured separators. */
  private _isSeparatorKey(event: KeyboardEvent) {
    return !hasModifierKey(event) && new Set(this.separatorKeyCodes).has(event.keyCode);
  }

  /** Gets the value to set on the `readonly` attribute. */
  protected _getReadonlyAttribute(): string | null {
    return this.readonly || (this.disabled && this.disabledInteractive) ? 'true' : null;
  }
}
