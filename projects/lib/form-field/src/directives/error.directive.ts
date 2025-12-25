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
import {Attribute, Directive, ElementRef, inject, InjectionToken, Input, OnDestroy, OnInit} from '@angular/core';
import {_IdGenerator} from '@angular/cdk/a11y';

/**
 * Injection token that can be used to reference instances of `CuteError`. It serves as
 * an alternative token to the actual `CuteError` class, which could cause unnecessary
 * retention of the class and its directive metadata.
 */
export const CUTE_ERROR = new InjectionToken<CuteError>('CuteError');

/** Single error message to be shown underneath the form-field. */
@Directive({
  selector: 'cute-error, [cuteError]',
  host: {
    'class': 'cute-form-field-error cute-form-field-bottom-align invalid-feedback',
    'aria-atomic': 'true',
    '[id]': 'id',
    '[attr.cuteErrorAttr]': 'true',
  },
  providers: [{provide: CUTE_ERROR, useExisting: CuteError}],
})
export class CuteError implements OnInit, OnDestroy {
  @Input() id: string = inject(_IdGenerator).getId('cute-error-');

  constructor(...args: unknown[]);
  constructor(@Attribute('aria-live') ariaLive: string, elementRef: ElementRef) {
    // If no aria-live value is set, add 'polite' as a default. This is preferred over setting
    // role='alert' so that screen readers do not interrupt the current task to read this aloud.
    if (!ariaLive) {
      elementRef.nativeElement.setAttribute('aria-live', 'polite');
    }
  }

  ngOnInit() {
    console.log("cute-error init.");
  }

  ngOnDestroy() {
    console.log("cute-error destroy.");
  }
}
