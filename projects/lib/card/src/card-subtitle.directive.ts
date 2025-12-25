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
import {Directive, Input} from "@angular/core";
import {ThemeColor} from "@cute-widgets/base/core";

/**
 * Subtitle of a card, intended for use within `<cute-card-body>` beneath a `<cute-card-title>`. This
 * component is an optional convenience for use with other convenience elements, such as
 * `<cute-card-title>`.
 *
 * CuteCardSubtitle provides no behaviors, instead serving as a purely visual treatment.
 */
@Directive({
  selector: `cute-card-subtitle, [cute-card-subtitle], [cuteCardSubtitle]`,
  host: {
    'class': 'cute-card-subtitle card-subtitle mb-2',
    '[class]': 'color ? "text-"+color : ""',
  },
  standalone: true
})
export class CuteCardSubtitle {
  /** Subtitle text color */
  @Input() color: ThemeColor = "secondary";
}
