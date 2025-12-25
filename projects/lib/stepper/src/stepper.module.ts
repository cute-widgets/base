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
import {NgModule, Type} from '@angular/core';
import {CommonModule} from '@angular/common';
import {CuteStep} from "./step.component";
import {CuteStepLabel, CuteStepLabelDescription, CuteStepLabelTitle} from "./step-label.directive";
import {CuteStepperNext, CuteStepperPrevious} from "./stepper-button.directive";
import {CuteStepper} from "./stepper.component";
import {CuteStepHeader} from "./step-header.component";
import {CuteStepContent} from "./step-content.directive";
import {CuteStepperIcon} from "./stepper-icon.directive";
import {CdkStepperModule} from "@angular/cdk/stepper";
import {ErrorStateMatcher} from "@cute-widgets/base/core/error";

const TYPES: (any | Type<any>)[] = [
  CuteStepper,
  CuteStep,
  CuteStepLabel,
  CuteStepLabelTitle,
  CuteStepLabelDescription,
  CuteStepHeader,
  CuteStepContent,
  CuteStepperIcon,
  CuteStepperNext,
  CuteStepperPrevious
];

@NgModule({
  imports: [CommonModule, CdkStepperModule, ...TYPES],
  exports: TYPES,
  declarations: [],
  providers: [ErrorStateMatcher],
})
export class CuteStepperModule {
}
