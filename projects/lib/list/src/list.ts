/**
 * @license Apache-2.0
 *
 * Copyright (c) 2025 CuteWidgets Team. All Rights Reserved.
 *
 * You may not use this file except in compliance with the License
 * that can be found at http://www.apache.org/licenses/LICENSE-2.0
 *
 * This code is a modification of the `@angular/material` original
 * code licensed under MIT-style License (https://angular.dev/license).
 */
import {ChangeDetectionStrategy, Component, InjectionToken, ViewEncapsulation} from "@angular/core";
import {CuteListBase} from "./list-base.directive";

/**
 * Injection token that can be used to inject instances of `CuteList`. It serves as
 * an alternative token to the actual `CuteList` class which could cause unnecessary
 * retention of the class and its component metadata.
 */
export const CUTE_LIST = new InjectionToken<CuteList>('CuteList');

/**
 * Flexible and powerful component for displaying a series of content.
 */
@Component({
  selector: 'cute-list',
  exportAs: 'cuteList',
  template: '<ng-content></ng-content>',
  host: {
    'class': 'cute-list',
  },
  styleUrls: ['./list.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [{provide: CuteListBase, useExisting: CuteList}],
  standalone: true,
})
export class CuteList extends CuteListBase {

  constructor() {
    super();
  }

}
