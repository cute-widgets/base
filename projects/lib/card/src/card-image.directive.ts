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
import {Directive, inject, Input} from "@angular/core";
import {CuteCard} from "./card.component";

/**
 * Primary image content for a card, intended for use within `<cute-card>`. Can be applied to
 * any media element, such as `<img>` or `<picture>`.
 *
 * This component is an optional convenience for use with other convenience elements, such as
 * `<cute-card-body>`; any custom media element may be used in its place.
 *
 * `CuteCardImage` provides no behaviors, instead serving as a purely visual treatment.
 */
@Directive({
  selector: '[cute-card-image], [cuteCardImage]',
  host: {
    'class': 'cute-card-image',
    '[class]': "'card-img'+(position=='top'||position=='bottom' ? '-'+position : '')",
    //'[class.cute-card-image-cover]': 'position=="cover"',
    '[class.img-fluid]': 'position=="fluid"',
    '[style.border-radius]': "position=='top' && card?._header ? 0 : (position=='bottom' && card?._footer ? 0 : undefined)",
    '[style.--cute-card-image-height]': 'height>=0 ? height+"px" : undefined'
  },
  standalone: true,
})
export class CuteCardImage {
  protected card= inject(CuteCard);

  /** Image position in the card layout */
  @Input() position: "top"|"bottom"|"fluid" = "top";

  /** Image height in pixels */
  @Input()
  get height(): number|undefined {return this._height;}
  set height(value: number|string|undefined) {
    if (typeof value==="string") {
      value = parseInt(value);
      if (isNaN(value)) value = undefined;
    }
    this._height = value;
  }
  private _height: number | undefined;

}
