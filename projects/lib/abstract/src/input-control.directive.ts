/**
 * @license Apache-2.0
 *
 * Copyright (c) 2025 CuteWidgets Team. All Rights Reserved.
 *
 * You may not use this file except in compliance with the License
 * that can be found at http://www.apache.org/licenses/LICENSE-2.0
 */
import {booleanAttribute, Directive, Input} from '@angular/core';
import {ControlValueAccessor} from "@angular/forms";
import {BooleanInput, coerceBooleanProperty} from "@angular/cdk/coercion";
import {Subject} from "rxjs";
import {CuteFocusableControl} from './focusable-control.directive';

@Directive()
export abstract class CuteInputControl extends CuteFocusableControl implements ControlValueAccessor {

  private _isTouched: boolean = false;

  /**
   * Emits whenever the component state changes and should cause the parent
   * form-field to update. Implemented as part of `CuteFormFieldControl`.
   */
  readonly stateChanges = new Subject<void>();

  protected _onChange: (value: unknown) => void = () => {};
  protected _onTouched: Function = ()=>{};

  /** The value attribute of the native input element */
  abstract value: any;

  /** Name value will be applied to the input element if present */
  @Input()
  name: string | null = null;

  /** Whether the element's value input is required. */
  @Input({transform: booleanAttribute})
  get required(): boolean {return this._required ?? false;}
  set required(newValue: BooleanInput) {
    this._required = coerceBooleanProperty(newValue);
    this.stateChanges.next();
  }
  private _required: boolean | undefined;

  override get id(): string|undefined {return super.id;}
  override set id(value: string|undefined) {
    if (value !== super.id) {
      super.id = value;
      this.stateChanges.next();
    }
  }

  protected constructor() { super(); }

  /* ControlValueAccessor interface */
  //++
  registerOnChange(fn: (value: any) => void): void {
    this._onChange = fn;
  }
  registerOnTouched(fn: () => void): void {
    this._onTouched = fn;
  }
  override setDisabledState(isDisabled: BooleanInput, emitEvent: boolean = true): boolean {
    const changed = super.setDisabledState(isDisabled, emitEvent);
    if (changed && emitEvent) {
      this.stateChanges.next();
    }
    return changed;
  }
  abstract writeValue(obj: any): void;
  //--

  /**
   * Mark widget gets a touched state
   * @protected
   */
  protected markAsTouched() {
    if (!this._isTouched) {
      this._onTouched();
      this._isTouched = true;
    }
  }

  override ngOnDestroy() {
    super.ngOnDestroy();

    this.stateChanges.complete();
  }

}
