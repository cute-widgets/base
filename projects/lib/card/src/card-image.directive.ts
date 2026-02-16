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
import {Directive, HostAttributeToken, inject, Input, isDevMode} from "@angular/core";
import {CuteCard} from "./card.component";

export type CuteCardImagePosition = "top"|"bottom"|"fluid";

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
  selector: '[cute-card-image], [cute-card-top-image], [cute-card-bottom-image], [cute-card-fluid-image]',
  host: {
    'class': 'cute-card-image',
    '[class]': "'card-img'+(_position=='top'||_position=='bottom' ? '-'+_position : '')",
    '[class.img-fluid]': '_position=="fluid"',
    '[attr.height]': 'height',
    '[style.border-radius]': "_position=='top' && card?._header() ? 0 : (_position=='bottom' && card?._footer() ? 0 : undefined)",
    '[style.--cute-card-image-height]': 'height!=null && height>=0 ? height+"px" : undefined'
  },
  standalone: true,
})
export class CuteCardImage {
  protected card= inject(CuteCard);

  /** Image position in the card layout */
  protected readonly _position: CuteCardImagePosition = "top";

  /** The intrinsic height of the image, in pixels. */
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

  constructor() {
    let attribs: (string|null)[] = [];
    attribs[0] = inject(new HostAttributeToken("cute-card-top-image"), {optional: true});
    attribs[1] = inject(new HostAttributeToken("cute-card-bottom-image"), {optional: true});
    attribs[2] = inject(new HostAttributeToken("cute-card-fluid-image"), {optional: true});

    if (attribs.filter(v => v != null).length > 1 && isDevMode()) {
      throw new Error("Only one attribute with name 'cute-card-*-image' should be applied.")
    }

    // We take into account the first value only
    const attrInd = attribs.findIndex(v => v != null);
    switch (attrInd) {
      case 0: this._position = "top"; break;
      case 1: this._position = "bottom"; break;
      case 2: this._position = "fluid"; break;
    }
    this.card.markForCheck();
  }

}
