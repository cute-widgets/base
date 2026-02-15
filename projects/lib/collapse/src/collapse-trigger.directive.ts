/**
 * @license Apache-2.0
 *
 * Copyright (c) 2025 CuteWidgets Team. All Rights Reserved.
 *
 * You may not use this file except in compliance with the License
 * that can be found at http://www.apache.org/licenses/LICENSE-2.0
 */
import {Directive, Input} from "@angular/core";
import {Expandable} from '@cute-widgets/base/abstract';

@Directive({
  selector: '[cuteCollapseTriggerFor]',
  exportAs: 'cuteCollapseTrigger',
  host: {
    'class': 'cute-collapse-trigger',
    '[class.collapsed]': '!collapseControl?.expanded',
    '[attr.aria-expanded]': 'collapseControl ? collapseControl.expanded : null',
    '[attr.aria-controls]':  'collapseControl?.id || null',
    '(click)': 'collapseControl?.toggle()',
  },
  standalone: true,
})
export class CuteCollapseTrigger {

  /** Reference to the `cute-collapse` component to toggle its visibility */
  @Input("cuteCollapseTriggerFor")
  get collapseControl(): Expandable | null {return this._collapseControl;}
  set collapseControl(collapse: Expandable | null) {
    this._collapseControl = collapse;
  }
  private _collapseControl: Expandable | null = null;

}
