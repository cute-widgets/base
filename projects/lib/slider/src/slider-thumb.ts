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
import {Directive} from '@angular/core';
import {CuteInput} from '@cute-widgets/base/input';

/**
 * Directive that adds slider-specific behaviors to an input element inside `<cute-slider>`.
 * Up to two may be placed inside a `<cute-slider>`.
 *
 * If one is used, the selector `cuteSliderThumb` must be used, and the outcome will be a normal
 * slider. If two are used, the selectors `cuteSliderStartThumb` and `cuteSliderEndThumb` must be
 * used, and the outcome will be a range slider with two slider thumbs.
 */
@Directive({
  selector: 'input[cuteSliderThumb]',
  exportAs: 'cuteSliderThumb',
  host: {
    'class': 'cute-slider-thumb',
  },
})
export class CuteSliderThumb extends CuteInput {
  constructor() {
    super();
    this.type = "range";
  }
}

