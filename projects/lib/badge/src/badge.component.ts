/**
 * @license Apache-2.0
 *
 * Copyright (c) 2025 CuteWidgets Team. All Rights Reserved.
 *
 * You may not use this file except in compliance with the License
 * that can be found at http://www.apache.org/licenses/LICENSE-2.0
 */
import {booleanAttribute, ChangeDetectionStrategy, Component, Input, ViewEncapsulation} from "@angular/core";
import {CuteBaseControl} from "@cute-widgets/base/abstract";
import {toTextBgCssClass} from "@cute-widgets/base/core";

/**
 * Small count and labeling component
 */
@Component({
  selector: 'cute-badge',
  exportAs: "cuteBadge",
  templateUrl: './badge.component.html',
  styleUrls: ['./badge.component.scss'],
  host: {
    'class': 'cute-badge badge',
    //'[class]' : 'color ? "text-bg-"+color : ""',
    '[class]': 'color ? toTextBgCssClass(color) : ""',
    '[class.rounded-pill]': 'roundedPill',
  },
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CuteBadge extends CuteBaseControl {

  /** Makes a badge more rounded with a larger border-radius. */
  @Input({transform: booleanAttribute})
  roundedPill: boolean = false;

  constructor() {
    super();
  }

  protected override generateId(): string {
    // none
    return "";
  }

  protected readonly toTextBgCssClass = toTextBgCssClass;
}
