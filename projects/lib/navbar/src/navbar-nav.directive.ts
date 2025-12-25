/**
 * @license Apache-2.0
 *
 * Copyright (c) 2025 CuteWidgets Team. All Rights Reserved.
 *
 * You may not use this file except in compliance with the License
 * that can be found at http://www.apache.org/licenses/LICENSE-2.0
 */
import {booleanAttribute, Directive, Input} from "@angular/core";
import {CuteNav, CUTE_NAV} from "@cute-widgets/base/core/nav";

@Directive({
  selector: '[cuteNavbarNav], [cute-navbar-nav]',
  exportAs: 'cuteNavbarNav',
  host: {
    'class': 'cute-navbar-nav navbar-nav align-items-start',
    '[class.navbar-nav-scroll]': 'scrollable',
    '[style.--bs-scroll-height]': 'scrollHeight',
  },
  standalone: true,
  providers: [{provide: CUTE_NAV, useExisting: CuteNavbarNav}],
})
export class CuteNavbarNav extends CuteNav {

  /**
   * Enable/disable vertical scrolling within the toggleable contents of a collapsed `navbar`.
   * By default, scrolling kicks in at 75vh (or 75% of the viewport height).
   */
  @Input({transform: booleanAttribute}) scrollable: boolean = false;

  /** The minimum height of the expanded content that triggers the scrolling mode when `scrollable` property is enabled. Default is **75vh**. */
  @Input()
  get scrollHeight(): string | undefined {return this._scrollHeight;}
  set scrollHeight(value: string | number | undefined) {
    if (value !== this._scrollHeight) {
      if (typeof value==="number") {
        value = `${value}px`;
      }
      this._scrollHeight = value;
    }
  }
  private _scrollHeight: string | undefined;

  constructor() {
    super();
  }

}
