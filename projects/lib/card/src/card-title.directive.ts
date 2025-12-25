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
 * Title of a card, intended for use within `<cute-card-body>`. This component is an optional
 * convenience for one variety of card titles; any custom title element may be used in its place.
 *
 * CuteCardTitle provides no behaviors, instead serving as a purely visual treatment.
 */
@Directive({
  selector: `cute-card-title, [cute-card-title], [cuteCardTitle]`,
  host: {
    'class': 'cute-card-title card-title',
    '[class]': 'color ? "text-"+color : ""',
  },
  standalone: true
})
export class CuteCardTitle {
  /** Title text color */
  @Input() color: ThemeColor | undefined;
}
