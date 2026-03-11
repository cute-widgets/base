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
import {CuteBaseControl} from "@cute-widgets/base/abstract";
import {toTextBgCssClass} from "@cute-widgets/base/core";

/**
 * Small count and labeling component.
 */
@Component({
  selector: 'cute-badge',
  exportAs: "cuteBadge",
  templateUrl: './badge.component.html',
  styleUrls: ['./badge.component.scss'],
  host: {
    'class': 'cute-badge badge',
    '[class.cute-badge-positioned]': 'position ?? null',
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

  /** Badge's position in the corner of parent link or button. */
  @Input() position: "top-start"|"top-end"|"bottom-start"|"bottom-end" | undefined;

  @HostBinding('class')
  protected get classList(): string[] {
    let classes: string[] = [];
    if (this.color) {
      classes.push( toTextBgCssClass(this.color) );
    }
    if (this.position) {
      let xClass="", yClass="";
      switch (this.position) {
        case "top-start":  xClass = "start-0"; yClass = "top-0"; break;
        case "top-end":  xClass = "start-100"; yClass = "top-0"; break;
        case "bottom-start":  xClass = "start-0"; yClass = "top-100"; break;
        case "bottom-end":  xClass = "start-100"; yClass = "top-100"; break;
      }
      classes.push(xClass, yClass);
    }
    return classes;
  }

  constructor() {
    super();
  }

  protected override generateId(): string {
    // none
    return "";
  }
}
