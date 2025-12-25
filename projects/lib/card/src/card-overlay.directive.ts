/**
 * @license Apache-2.0
 *
 * Copyright (c) 2025 CuteWidgets Team. All Rights Reserved.
 *
 * You may not use this file except in compliance with the License
 * that can be found at http://www.apache.org/licenses/LICENSE-2.0
 */
import {Directive} from "@angular/core";

/**
 * Turn an image into a card background and overlay the card’s text.
 */
@Directive({
  selector: 'cute-card-overlay',
  exportAs: 'cuteCardOverlay',
  host: {
    'class': 'card-img-overlay d-flex flex-column'
  },
  standalone: true,
})
export class CuteCardOverlay /* extends ... */ {

  constructor() {
  }

}
