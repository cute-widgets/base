/**
 * @license Apache-2.0
 *
 * Copyright (c) 2025 CuteWidgets Team. All Rights Reserved.
 *
 * You may not use this file except in compliance with the License
 * that can be found at http://www.apache.org/licenses/LICENSE-2.0
 */
import {Component} from "@angular/core";

/**
 * Use _card groups_ to render cards as a single, attached element with equal width and height columns.
 * When using card groups with footers, their content will automatically line up.
 */
@Component({
  selector: 'cute-card-group',
  exportAs: 'cuteCardGroup',
  template: '<ng-content></ng-content>',
  styles: [`
    :host { display: block; }
  `],
  host: {
    'class': 'cute-card-group card-group'
  },
  standalone: true,
})
export class CuteCardGroup /* extends ... */ {

  constructor() {
  }

}
