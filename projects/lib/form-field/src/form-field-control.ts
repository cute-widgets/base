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
import {Observable} from 'rxjs';
import {AbstractControlDirective, NgControl} from '@angular/forms';
import {Directive, ElementRef} from '@angular/core';

/** An interface which allows a control to work inside a `CuteFormField`. */
@Directive()
export abstract class CuteFormFieldControl<T> {
  /** The value of the control. */
  value: T | null = null;

  /**
   * Stream that emits whenever the state of the control changes such that the parent `CuteFormField`
   * needs to run change detection.
   */
  readonly stateChanges: Observable<void> | undefined;

  /** The element ID for this control. */
  readonly id: string | undefined;

  /** The placeholder for this control. */
  readonly placeholder: string | undefined;

  /** Gets the `AbstractControlDirective` for this control. */
  readonly ngControl: NgControl | AbstractControlDirective | null = null;

  /** Whether the control is focused. */
  readonly focused: boolean = false;

  /** Whether the control is empty. */
  readonly empty: boolean = false;

  /** Whether the `CuteFormField` label should try to float. */
  readonly shouldLabelFloat: boolean= false;

  /** Whether the control is required. */
  readonly required: boolean = false;

  /** Whether the control is disabled. */
  readonly disabled: boolean = false;

  /** Whether the control is in an error state. */
  readonly errorState: boolean = false;

  /**
   * An optional name for the control type that can be used to distinguish `cute-form-field` elements
   * based on their control type. The form field will add a class,
   * `cute-form-field-type-{{controlType}}` to its root element.
   */
  readonly controlType?: string;

  /**
   * Whether the input is currently in an autofilled state. If property is not present on the
   * control, it is assumed to be false.
   */
  readonly autofilled?: boolean;

  /**
   * Value of `aria-describedby` that should be merged with the described-by ids,
   * which are set by the form-field.
   */
  readonly userAriaDescribedBy?: string;

  /**
   * Whether to automatically assign the ID of the form field as the `for` attribute
   * on the `<label>` inside the form field. Set this to true to prevent the form
   * field from associating the label with non-native elements.
   */
  readonly disableAutomaticLabeling?: boolean;

  /** Gets the list of element IDs that currently describe this control. */
  readonly describedByIds?: string[];

  /** Sets the list of element IDs that currently describe this control. */
  abstract setDescribedByIds(ids: string[]): void;

  /** Handles a click on the control's container. */
  abstract onContainerClick(event: MouseEvent): void;

  //++ CWT
  /** Gets the `ElementRef` for this control. */
  readonly controlElementRef: ElementRef | undefined;

  //++ CWT
  /** Changes the disabled state of this control. */
  abstract setDisabledState(value: boolean): void

}
