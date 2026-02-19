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
import {
  ChangeDetectionStrategy,
  Component,
  ViewEncapsulation,
} from '@angular/core';

import {CuteButtonBase, CUTE_BUTTON_BASE} from "./button-base.directive";
import {toThemeColor} from "@cute-widgets/base/core";

@Component({
  selector: `button[cuteButton],
             button[cute-button],
             a[cuteButton],
             a[cute-button],
  `,
  templateUrl: './button.component.html',
  styleUrls: ['./button.component.scss'],
  exportAs: "cuteButton",
  imports: [],
  host: {
    'class': 'cute-button',
    '[class.cute-anchor]': '_isAnchor',
    '[class.btn-close]': 'buttonStyle == "close"',
    '[class.rounded-pill]': 'buttonStyle=="pill"',
    '[class.rounded-circle]': 'buttonStyle=="circle"',
    '[class.raised]': 'buttonStyle=="raised" && !disabled',
    '[class.icon-link]': 'toThemeColor(color)=="link"',
    '[class.cute-button-expandable]': 'withAriaExpandedIndicator',
    //'[class.focus-ring]': 'buttonStyle=="base" && hasClass("cdk-keyboard-focused")', // See: CuteButtonBase.ngDoCheck()
    '[class.disabled]': '(_isAnchor || buttonStyle=="icon" || disabledInteractive) && disabled',
    '[class.cute-button-disabled-interactive]': 'disabledInteractive',
    '[class.cute-unthemed]': '!color',
    '[attr.tabindex]': '_getTabIndex()', //'disabled  ? -1 : tabIndex',
    '[attr.disabled]': '_getDisabledAttribute()',
    '[attr.aria-disabled]': '_getAriaDisabled()',
    '[attr.id]': 'id || null',
    '[attr.aria-label]': 'ariaLabel || null',
  },
  providers: [
    { provide: CUTE_BUTTON_BASE, useExisting: CuteButton }
  ],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CuteButton extends CuteButtonBase {

  constructor() {
    super();
  }

  protected readonly toThemeColor = toThemeColor;
}
