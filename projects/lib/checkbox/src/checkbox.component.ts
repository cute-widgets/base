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
  booleanAttribute,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  EventEmitter,
  forwardRef, inject,
  Input,
  Output, SimpleChanges,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import {AbstractControl, NG_VALIDATORS, NG_VALUE_ACCESSOR, ValidationErrors, Validator} from "@angular/forms";
import {
  CUTE_CHECKBOX_DEFAULT_OPTIONS,
  CUTE_CHECKBOX_DEFAULT_OPTIONS_FACTORY,
  CuteCheckboxDefaultOptions
} from "./checkbox.config";
import {CuteInputControl} from '@cute-widgets/base/abstract';
import {CommonModule} from "@angular/common";
import {RelativeSize} from "@cute-widgets/base/core";

/** Change event object emitted by checkbox. */
export interface CuteCheckboxChange {
  /** The source checkbox of the event. */
  source: CuteCheckbox;
  /** The new `checked` value of the checkbox. */
  checked: boolean;
}
// Increasing integer for generating unique ids for checkbox components.
let nextUniqueId = 0;

// Default checkbox configuration.
const defaults = CUTE_CHECKBOX_DEFAULT_OPTIONS_FACTORY();

@Component({
    selector: 'cute-checkbox, cute-slide-toggle:not([cuteToggleSwitch])',
    templateUrl: './checkbox.component.html',
    styleUrls: ['./checkbox.component.scss'],
    exportAs: "cuteCheckbox",
    host: {
      'class': 'cute-checkbox',
      '[class.cute-checkbox-disabled]': 'disabled',
      '[class.cute-checkbox-disabled-interactive]': 'disabledInteractive',
      '[attr.tabindex]': 'null',
      '[attr.aria-label]': 'null',
      '[attr.aria-labelledby]': 'null',
      '[attr.role]': 'null',
      '[id]': 'id',
    },
    imports: [CommonModule],
    providers: [
      {
        provide: NG_VALUE_ACCESSOR,
        useExisting: forwardRef(() => CuteCheckbox),
        multi: true,
      },
      {
        provide: NG_VALIDATORS,
        useExisting: CuteCheckbox,
        multi: true,
      },
    ],
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class CuteCheckbox extends CuteInputControl implements Validator {

  private readonly _options = inject<CuteCheckboxDefaultOptions>(CUTE_CHECKBOX_DEFAULT_OPTIONS, {
    optional: true,
  });

  private _validatorChangeFn = () => {};

  /** Users can specify the `aria-expanded` attribute which will be forwarded to the input element  */
  @Input({alias: 'aria-expanded', transform: booleanAttribute}) ariaExpanded: boolean | undefined;

  /** Users can specify the `aria-controls` attribute which will be forwarded to the input element */
  @Input('aria-controls') ariaControls: string | undefined;

  /** Users can specify the `aria-owns` attribute which will be forwarded to the input element */
  @Input('aria-owns') ariaOwns: string | undefined;

  @Input()
  override get value(): any {return this._value}
  override set value(v: any) {this._value = v;}
  private _value: any;

  @Input()
  get valueOn(): unknown {return this._valueOn;}
  set valueOn(v: unknown) {this._valueOn = v;}
  private _valueOn: unknown;

  @Input()
  get valueOff(): unknown {return this._valueOff;}
  set valueOff(v: unknown) {this._valueOff = v;}
  private _valueOff: unknown;

  /** Group checkboxes on the same horizontal row */
  @Input({transform: booleanAttribute})
  inline: boolean = false;

  /** Whether the checkbox is checked. */
  @Input({transform: booleanAttribute})
  get checked(): boolean { return this._checked; }
  set checked(newVal: boolean) {
    if (newVal != this.checked) {
      this._checked = newVal;
      //this.value = this.checked ? this.valueOn : this.valueOff;
      this.markForCheck();
    }
  }
  private _checked: boolean = false;
  /**
   * Whether the checkbox is indeterminate. This is also known as "mixed" mode and can be used to
   * represent a checkbox with three states, e.g. a checkbox that represents a nested list of
   * checkable items. Note that whenever checkbox is manually clicked, indeterminate is immediately
   * set to false.
   */
  @Input({transform: booleanAttribute})
  get indeterminate(): boolean { return this._indeterminate; }
  set indeterminate(value: boolean) {
    const changed = value != this._indeterminate;
    this._indeterminate = value;

    if (changed) {
      this.indeterminateChange.emit(this._indeterminate);
    }

    this._syncIndeterminate(this._indeterminate);
  }
  private _indeterminate: boolean = false;

  /** Whether the label should appear after or before the checkbox. Defaults to 'after' */
  @Input()
  labelPosition: 'before' | 'after' = 'after';

  /** Whether the checkbox should remain interactive when it is disabled. */
  @Input({transform: booleanAttribute})
  disabledInteractive: boolean = false;

  /** Relative size of the checkbox icon. */
  @Input() iconSize: RelativeSize = "middle";

  /** Event emitted when the checkbox's `checked` value changes. */
  @Output() readonly change = new EventEmitter<CuteCheckboxChange>();

  /** Event emitted when the checkbox's `indeterminate` value changes. */
  @Output() readonly indeterminateChange: EventEmitter<boolean> = new EventEmitter<boolean>();

  /** The native `<input type="checkbox">` element */
  @ViewChild('input')
  readonly _inputElement: ElementRef<HTMLInputElement> | undefined;

  /** The native `<label>` element */
  @ViewChild('label')
  private _labelElement!: ElementRef<HTMLInputElement>;

  constructor(...args: unknown[]);
  constructor() {
    super();
    this._options = this._options || defaults;
    this.color = this._options.color || defaults.color;
    this.disabledInteractive = this._options?.disabledInteractive ?? false;
    //++ CWT
    if (this._nativeElement.nodeName.toLowerCase()==="cute-slide-toggle") {
      this.role = "switch";
    }
    //this.value = this.valueOn = "on";
    //this.valueOff = "off";
    //--
  }

  override ngOnChanges(changes: SimpleChanges) {
    super.ngOnChanges(changes);
    if (changes['required']) {
      this._validatorChangeFn();
    }
  }

  override ngAfterViewInit() {
    super.ngAfterViewInit();
    this._syncIndeterminate(this._indeterminate);
  }

  // Implemented as a part of Validator.
  validate(control: AbstractControl<boolean>): ValidationErrors | null {
    return this.required && control.value !== true ? {'required': true} : null;
  }

  // Implemented as a part of Validator.
  registerOnValidatorChange(fn: () => void): void {
    this._validatorChangeFn = fn;
  }

  override writeValue(value: any) {
    this.checked = !!value;
  }

  override generateId(): string {
    return `cute-checkbox-${nextUniqueId++}`;
  }

  private _emitChangeEvent() {
    this._onChange(this.checked);
    this.change.emit(this._createChangeEvent(this.checked));

    // Assigning the value again here is redundant, but we have to do it in case it was
    // changed inside the `change` listener which will cause the input to be out of sync.
    if (this._inputElement) {
      this._inputElement.nativeElement.checked = this.checked;
    }
  }

  /** Toggles the `checked` state of the checkbox. */
  toggle(): void {
    this.checked = !this.checked;
    this._onChange(this.checked);
  }

  /** Sets the `checked` state of the checkbox. */
  check(): void {
    this.checked = true;
    this._onChange(this.checked);
  }

  /** Clears the `checked` state of the checkbox. */
  uncheck(): void {
    this.checked = false;
    this._onChange(this.checked);
  }

  private _handleInputClick() {
    const clickAction = this._options?.clickAction;

    // If resetIndeterminate is false, and the current state is indeterminate, do nothing on click
    if (!this.disabled && clickAction !== 'noop') {
      // When a user manually clicks on the checkbox, `indeterminate` is set to false.
      if (this.indeterminate && clickAction !== 'check') {
        Promise.resolve().then(() => {
          this._indeterminate = false;
          this.indeterminateChange.emit(this._indeterminate);
        });
      }

      this._checked = !this._checked;

      // Emit our custom change event if the native input emitted one.
      // It is important to only emit it, if the native input triggered one, because
      // we don't want to trigger a change event, when the `checked` variable changes for example.
      this._emitChangeEvent();
    } else if (
      ((this.disabled && this.disabledInteractive) ||
       (!this.disabled && clickAction === 'noop')) && this._inputElement
    ) {
      // Reset native input when clicked with noop. The native checkbox becomes checked after
      // click, reset it to be aligned with `checked` value of `cute-checkbox`.
      this._inputElement.nativeElement.checked = this.checked;
      this._inputElement.nativeElement.indeterminate = this.indeterminate;
    }
  }

  /** Method being called whenever the label text changes. */
  _onLabelTextChange() {
    // Since the event of the `cdkObserveContent` directive runs outside the zone, the checkbox
    // component will be only marked for check, but no actual change detection runs automatically.
    // Instead of going back into the zone in order to trigger a change detection which causes
    // *all* components to be checked (if explicitly marked or not using OnPush), we only trigger
    // an explicit change detection for the checkbox view and its children.
    this._changeDetectorRef.detectChanges();
  }

  protected _onInputChange(event: Event): void {
    // We always have to stop propagation on the change event.
    // Otherwise, the change event from the input element will bubble up and
    // emit its event object to the `change` output.
    event.stopPropagation();
  }

  protected _onInputBlur(event: Event):void {
    // When a focused element becomes disabled, the browser *immediately* fires a blur event.
    // Angular does not expect events to be raised during change detection, so any state change
    // (such as a form control's 'ng-touched') will cause a changed-after-checked error.
    // See https://github.com/angular/angular/issues/17793. To work around this, we defer
    // telling the form control it has been touched until the next tick.
    Promise.resolve().then(() => {
      this._onTouched();
      this.markForCheck();
    });
  }

  protected _onInputClick(event: Event): void {
    this._handleInputClick();
  }

  protected _onTouchTargetClick(event: Event): void {
    this._handleInputClick();

    if (!this.disabled) {
      // Normally, the input should be focused already, but if the click
      // comes from the touch target, then we might have to focus it ourselves.
      this._inputElement?.nativeElement.focus();
    }
  }
  /**
   *  Prevent click events that come from the `<label/>` element from bubbling. This prevents the
   *  click handler on the host from triggering twice when clicking on the `<label/>` element. After
   *  the click event on the `<label/>` propagates, the browsers dispatches click on the associated
   *  `<input/>`. By preventing clicks on the label by bubbling, we ensure only one click event
   *  bubbles when the label is clicked.
   */
  protected _preventBubblingFromLabel(event: MouseEvent) {
    if (!!event.target && this._labelElement.nativeElement.contains(event.target as HTMLElement)) {
      event.stopPropagation();
    }
  }
  /**
   * Syncs the indeterminate value with the checkbox DOM node.
   *
   * We sync `indeterminate` directly on the DOM node, because in Ivy the check for whether a
   * property is supported on an element boils down to `if (propName in an element)`. Domino's
   * HTMLInputElement doesn't have an `indeterminate` property, so Ivy will warn during
   * server-side rendering.
   */
  private _syncIndeterminate(value: boolean) {
    const nativeCheckbox = this._inputElement;

    if (nativeCheckbox) {
      nativeCheckbox.nativeElement.indeterminate = value;
    }
  }

  /** Creates the change event that will be emitted by the checkbox. */
  protected _createChangeEvent(isChecked: boolean): CuteCheckboxChange {
    return {source: this, checked: isChecked};
  }

}
