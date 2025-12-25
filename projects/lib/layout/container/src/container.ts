/**
 * @license Apache-2.0
 *
 * Copyright (c) 2025 CuteWidgets Team. All Rights Reserved.
 *
 * You may not use this file except in compliance with the License
 * that can be found at http://www.apache.org/licenses/LICENSE-2.0
 */
import {booleanAttribute, ChangeDetectionStrategy, Component, Input} from "@angular/core";
import {CuteLayoutControl} from "@cute-widgets/base/abstract";

/**
 * A responsive, fixed-width container, meaning its `max-width` changes when the `breakpoint` input parameter is specified.
 * After the breakpoint is reached, the content will scale up to the higher breakpoint(s).
 */
@Component({
  selector: 'cute-container',
  exportAs: 'cuteContainer',
  template: '<ng-content></ng-content>',
  styles: [`
    :host {
      display: block;
    }
  `],
  standalone: true,
  host: {
    'class': 'cute-container',
    '[class]': '"container"+(fluid ? "-fluid" : (breakpoint ? "-"+breakpoint : ""))',
    //'[style.display]': "'block'",
    //'style': '--bs-gutter-x: 0; --bs-gutter-y: 0;',   // disable default gutter values for container's
  },
  //encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CuteContainer extends CuteLayoutControl {

  /** A full width container, spanning the entire width of the viewport. */
  @Input({transform: booleanAttribute}) fluid: boolean = false;

  constructor() {
    super();
  }

  protected override generateId(): string {return "";}

}
