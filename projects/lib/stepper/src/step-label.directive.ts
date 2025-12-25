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
import {Directive, ElementRef, Inject} from '@angular/core';
import {CdkStepLabel} from '@angular/cdk/stepper';

@Directive({
  selector: '[cuteStepLabel], [cute-step-label]',
  standalone: true,
})
export class CuteStepLabel extends CdkStepLabel {}

@Directive({
  selector: '[cuteStepLabelTitle], [cute-step-label-title]',
  host: {
    '[class.fw-bold]': 'true',
  },
  standalone: true,
})
export class CuteStepLabelTitle {}

@Directive({
  selector: '[cuteStepLabelDescription], [cuteStepLabelDesc], [cute-step-label-desc]',
  host: {
    //'[class]': '!isErrorState() ? "text-body-secondary": "opacity-75"',
    '[class.opacity-75]': 'true',
    '[style.font-size]': '"smaller"', //'"calc(var(--bs-body-font-size)*0.875)"',
    '[style.margin-bottom.px]': '0',
  },
  standalone: true,
})
export class CuteStepLabelDescription {
  constructor(private _elementRef: ElementRef<HTMLElement>) {
  }
  protected isErrorState(): boolean {
    return this._elementRef.nativeElement.closest(".cute-step-label-error") != null;
  }
}

