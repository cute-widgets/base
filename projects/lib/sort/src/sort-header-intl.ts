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
import {Injectable, SkipSelf, Optional} from '@angular/core';
import {Subject} from 'rxjs';

/**
 * To modify the labels and text displayed, create a new instance of CuteSortHeaderIntl and
 * include it in a custom provider.
 */
@Injectable({providedIn: 'root'})
export class CuteSortHeaderIntl {
  /**
   * Stream that emits whenever the labels here are changed. Use this to notify
   * components if the labels have changed after initialization.
   */
  readonly changes: Subject<void> = new Subject<void>();
}

/** @docs-private */
export function CUTE_SORT_HEADER_INTL_PROVIDER_FACTORY(parentIntl: CuteSortHeaderIntl) {
  return parentIntl || new CuteSortHeaderIntl();
}

/** @docs-private */
export const CUTE_SORT_HEADER_INTL_PROVIDER = {
  // If there is already an MatSortHeaderIntl available, use that. Otherwise, provide a new one.
  provide: CuteSortHeaderIntl,
  deps: [[new Optional(), new SkipSelf(), CuteSortHeaderIntl]],
  useFactory: CUTE_SORT_HEADER_INTL_PROVIDER_FACTORY,
};
