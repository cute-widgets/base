/**
 * @license Apache-2.0
 *
 * Copyright (c) 2025 CuteWidgets Team. All Rights Reserved.
 *
 * You may not use this file except in compliance with the License
 * that can be found at http://www.apache.org/licenses/LICENSE-2.0
 */
import {
  booleanAttribute,
  ChangeDetectionStrategy,
  Component,
  HostBinding,
  Input,
  ViewEncapsulation
} from "@angular/core";

@Component({
  selector: 'cute-divider',
  template: '',
  styleUrls: ['./divider.component.scss'],
  host: {
    'class': 'cute-divider',
    '[class.cute-divider-horizontal]': '!vertical',
    '[class.cute-divider-vertical]': 'vertical',
    '[class.vr]': 'vertical',
    '[class.cute-divider-inset]': 'inset',
    '[attr.aria-orientation]': 'vertical ? "vertical" : "horizontal"',
    'role': 'separator',
    'tabindex': '-1',
  },
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CuteDivider {

  /** Divider's line style. */
  @Input() lineStyle: "solid"|"double"|"dotted"|"dashed"|"shelf"|"blurry"|"washed"|"gradient" = "solid";

  /** Whether the divider is vertically aligned. */
  @Input({transform: booleanAttribute}) vertical: boolean = false;

  /** Whether the divider is an inset divider. */
  @Input({transform: booleanAttribute}) inset: boolean = false;

  @HostBinding("class")
  get classBinding(): string {
    if (this.lineStyle) {
      return `cute-divider-${this.vertical?"vertical":"horizontal"}-${this.lineStyle}`;
    }
    return "";
  }

}
