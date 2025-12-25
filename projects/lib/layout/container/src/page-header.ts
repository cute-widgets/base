/**
 * @license Apache-2.0
 *
 * Copyright (c) 2025 CuteWidgets Team. All Rights Reserved.
 *
 * You may not use this file except in compliance with the License
 * that can be found at http://www.apache.org/licenses/LICENSE-2.0
 */
import {ChangeDetectionStrategy, Component, ViewEncapsulation} from "@angular/core";

@Component({
  selector: 'cute-page-header',
  template: '<ng-content></ng-content>',
  styles: [`
    .cute-page-header {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      z-index: 2;
    }
  `],
  exportAs: 'cutePageHeader',
  host: {
    'class': 'cute-page-header'
  },
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CutePageHeader /* extends ... */ {

  constructor() {
  }

}
