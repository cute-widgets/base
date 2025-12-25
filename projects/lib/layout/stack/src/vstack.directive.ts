/**
 * @license Apache-2.0
 *
 * Copyright (c) 2025 CuteWidgets Team. All Rights Reserved.
 *
 * You may not use this file except in compliance with the License
 * that can be found at http://www.apache.org/licenses/LICENSE-2.0
 */
import {Directive} from "@angular/core";
import {CuteStack} from "./stack.directive";
import {LayoutDirection} from "@cute-widgets/base/core";

/**
 * Use to create vertical layouts. Stacked items are full-width by default.
 */
@Directive({
  selector: 'cute-vstack',
  exportAs: "cuteStack",
  standalone: true,
})
export class CuteVStack extends CuteStack {

  constructor() {
    super();
    this._direction = "column";
  }

  protected override setDirection(value: LayoutDirection) {
    // do nothing
  }

}
