/**
 * @license Apache-2.0
 *
 * Copyright (c) 2025 CuteWidgets Team. All Rights Reserved.
 *
 * You may not use this file except in compliance with the License
 * that can be found at http://www.apache.org/licenses/LICENSE-2.0
 */
import {Directive} from "@angular/core";
import {LayoutDirection} from "@cute-widgets/base/core";
import {CuteStack} from "./stack.directive";

/**
 * Use for horizontal layouts. Stacked items are vertically centered by default and only take up their necessary width.
 */
@Directive({
  selector: 'cute-hstack',
  exportAs: "cuteStack",
  standalone: true,
})
export class CuteHStack extends CuteStack {

  constructor() {
    super();
    this._direction = "row";
  }

  protected override setDirection(value: LayoutDirection) {
    // do nothing
  }

}
