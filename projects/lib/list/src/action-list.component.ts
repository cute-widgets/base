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

import {ChangeDetectionStrategy, Component, ViewEncapsulation} from '@angular/core';
import {CuteListBase} from './list-base.directive';

@Component({
  selector: 'cute-action-list',
  exportAs: 'cuteActionList',
  template: '<ng-content></ng-content>',
  host: {
    'class': 'cute-action-list',
    'role': 'group',
  },
  styleUrl: './list.scss',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [{provide: CuteListBase, useExisting: CuteActionList}],
  standalone: true,
})
export class CuteActionList extends CuteListBase {
  // A navigation list is considered interactive, but does not extend the interactive list
  // base class. We do this because as per MDC, items of interactive lists are only reachable
  // through keyboard shortcuts. We want all items for the navigation list to be reachable
  // through a tab key as we do not intend to provide any special accessibility treatment. The
  // accessibility treatment depends on how the end-user will interact with it.
  override _isNonInteractive = false;
}
