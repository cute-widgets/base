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
import {Directive, inject, Input, TemplateRef} from '@angular/core';
import {StepState} from '@angular/cdk/stepper';

/** Template context available to an attached `cuteStepperIcon`. */
export interface CuteStepperIconContext {
  /** Index of the step. */
  index: number;
  /** Whether the step is currently active. */
  active: boolean;
  /** Whether the step is optional. */
  optional: boolean;
}

/**
 * Template to be used to override the icons inside the step header.
 */
@Directive({
  selector: 'ng-template[cuteStepperIcon]',
  standalone: true,
})
export class CuteStepperIcon {
  templateRef = inject<TemplateRef<CuteStepperIconContext>>(TemplateRef);
  /** Name of the icon to be overridden. */
  @Input('cuteStepperIcon') name: StepState | undefined;

  constructor(...args: unknown[]);
  constructor() {}
}
