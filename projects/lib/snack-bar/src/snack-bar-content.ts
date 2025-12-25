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
import {ChangeDetectionStrategy, Component, Directive, ViewEncapsulation} from '@angular/core';


/** Directive that should be applied to the element containing the snack bar's header elements. */
@Component({
  selector: 'cute-snack-bar-header',
  template: `
    <ng-content></ng-content>
  `,
  styles: `
    .cute-snack-bar-header {
      display: flex;
    }
  `,
  host: {
    'class': 'cute-snack-bar-header toast-header',
  },
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CuteSnackBarHeader {}

/** Directive that should be applied to the element containing the snack bar's body elements. */
@Directive({
  selector: `[cuteSnackBarBody]`,
  host: {
    'class': 'cute-snack-bar-body toast-body user-select-none',
  },
})
export class CuteSnackBarBody {}


/** Directive that should be applied to the text element to be rendered in the snack bar. */
@Directive({
  selector: `[cuteSnackBarLabel]`,
  host: {
    'class': 'cute-snack-bar-label',
  },
})
export class CuteSnackBarLabel {}


/** Directive that should be applied to the element containing the snack bar's action buttons. */
@Directive({
  selector: `[cuteSnackBarActions]`,
  host: {
    'class': 'cute-snack-bar-actions',
  },
})
export class CuteSnackBarActions {}

/** Directive that should be applied to each of the snack bar's action buttons. */
@Directive({
  selector: `[cuteSnackBarAction]`,
  host: {
    'class': 'cute-snack-bar-action',
  },
})
export class CuteSnackBarAction {}

