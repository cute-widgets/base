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

import {ChangeDetectionStrategy, Component, InjectionToken, ViewEncapsulation} from '@angular/core';
import {CuteListBase} from './list-base.directive';

/**
 * Injection token that can be used to inject instances of `CuteNavList`. It serves as
 * an alternative token to the actual `CuteNavList` class which could cause unnecessary
 * retention of the class and its component metadata.
 */
export const CUTE_NAV_LIST = new InjectionToken<CuteNavList>('CuteNavList');

@Component({
  selector: 'cute-nav-list',
  exportAs: 'cuteNavList',
  template: '<ng-content></ng-content>',
  host: {
    'class': 'cute-nav-list nav',
    'role': 'navigation',
  },
  styleUrl: './list.scss',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {provide: CuteListBase, useExisting: CuteNavList},
    {provide: CUTE_NAV_LIST, useExisting: CuteNavList},
  ],
  standalone: true,
})
export class CuteNavList extends CuteListBase {
  // A navigation list is considered interactive, but does not extend the interactive list
  // base class. We do this because as per MDC, items of interactive lists are only reachable
  // through keyboard shortcuts. We want all items for the navigation list to be reachable
  // through a tab key as we do not intend to provide any special accessibility treatment. The
  // accessibility treatment depends on how the end-user will interact with it.
  override _isNonInteractive = false;
}
