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
import {Directive} from "@angular/core";

/**
 * Header region of a card, intended for use within `<cute-card>`.
 * This component is an optional convenience for use with other convenience elements, such as `<cute-card-footer>`;
 * any custom header block element may be used in its place.
 *
 * `CuteCardHeader` provides no behaviors, instead serving as a purely visual treatment.
 */
@Directive({
  selector: 'cute-card-header',
  host: {'class': 'cute-card-header card-header'},
  standalone: true
})
export class CuteCardHeader {}
