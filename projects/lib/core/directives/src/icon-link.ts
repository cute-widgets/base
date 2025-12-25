/**
 * @license Apache-2.0
 *
 * Copyright (c) 2025 CuteWidgets Team. All Rights Reserved.
 *
 * You may not use this file except in compliance with the License
 * that can be found at http://www.apache.org/licenses/LICENSE-2.0
 */

import {booleanAttribute, Directive, HostAttributeToken, inject, Input} from "@angular/core";

/**
 * The icon link helper directive modifies the default link styles to enhance their appearance and
 * quickly align any pairing of icon and text.
 */
@Directive({
  selector: 'a[cuteIconLink]',
  exportAs: 'cuteIconLink',
  host: {
    'class': 'icon-link',
    '[class.icon-link-hover]': 'hovered',
    //'[style.cursor]': 'noHRef ? "pointer" : undefined',
  },
  standalone: true,
})
export class CuteIconLink /* extends ... */ {

  protected noHRef: boolean = false;

  /** Whether to move the icon to the right on hover. */
  @Input({transform: booleanAttribute})
  hovered: boolean = false;

  constructor() {
    const href = inject(new HostAttributeToken("href"), {optional: true});
    this.noHRef = !href;
  }

}
