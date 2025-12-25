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
import {ContentAlignment} from "@cute-widgets/base/core";

/**
 * Bottom area of a card that contains action buttons, intended for use within `<cute-card>`.
 * This component is an optional convenience for use with other convenience elements, such as
 * `<cute-card-content>`; any custom action block element may be used in its place.
 *
 * `CuteCardActions` provides no behaviors, instead serving as a purely visual treatment.
 */
@Directive({
  selector: 'cute-card-actions, [cute-card-actions], [cuteCardActions]',
  exportAs: 'cuteCardActions',
  host: {
    'class': 'cute-card-actions card-actions',
    '[class]': "'justify-content-'+align",
  },
  standalone: true,
})
export class CuteCardActions {
  /** Position of the actions inside the card. */
  @Input() align: ContentAlignment = "start";
}
