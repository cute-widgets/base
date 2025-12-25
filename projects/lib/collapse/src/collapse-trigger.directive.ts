/**
 * @license Apache-2.0
 *
 * Copyright (c) 2025 CuteWidgets Team. All Rights Reserved.
 *
 * You may not use this file except in compliance with the License
 * that can be found at http://www.apache.org/licenses/LICENSE-2.0
 */
import {Directive, Input} from "@angular/core";
import {CuteCollapse} from "./collapse.component";

@Directive({
  selector: '[cuteCollapseTriggerFor]',
  exportAs: 'cuteCollapseTrigger',
  host: {
    'class': 'cute-collapse-trigger',
    '[class.collapsed]': 'collapseControl?.collapsed',
    '[attr.aria-expanded]': 'collapseControl ? collapseControl.expanded : null',
    '[attr.aria-controls]':  'collapseControl?.id || null',
    '(click)': 'collapseControl?.toggle()',
  },
  standalone: true,
})
export class CuteCollapseTrigger {

  /** Reference to the `cute-collapse` component to toggle its visibility */
  @Input("cuteCollapseTriggerFor")
  get collapseControl(): CuteCollapse | null {return this._collapseControl;}
  set collapseControl(collapse: CuteCollapse | null) {
    this._collapseControl = collapse;
  }
  private _collapseControl: CuteCollapse | null = null;

}
