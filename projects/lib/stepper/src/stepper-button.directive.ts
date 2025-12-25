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
import {CdkStepperNext, CdkStepperPrevious} from '@angular/cdk/stepper';
import {Directive} from '@angular/core';

/** Button that moves to the next step in a stepper workflow. */
@Directive({
  selector: 'button[cuteStepperNext]',
  host: {
    'class': 'cute-stepper-next',
    '[type]': 'type',
  },
  standalone: true,
})
export class CuteStepperNext extends CdkStepperNext {}

/** Button that moves to the previous step in a stepper workflow. */
@Directive({
  selector: 'button[cuteStepperPrevious]',
  host: {
    'class': 'cute-stepper-previous',
    '[type]': 'type',
  },
  standalone: true,
})
export class CuteStepperPrevious extends CdkStepperPrevious {}
