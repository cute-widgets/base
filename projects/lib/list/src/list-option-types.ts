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
import {InjectionToken} from '@angular/core';

/**
 * Type describing possible positions of a checkbox or radio in a list option
 * with respect to the list item's text.
 */
export type CuteListOptionTogglePosition = 'before' | 'after';

/**
 * Interface describing a list option. This is used to avoid circular
 * dependencies between the list-option and the styler directives.
 * @docs-private
 */
export interface ListOption {
  _getTogglePosition(): CuteListOptionTogglePosition;
}

/**
 * Injection token that can be used to reference instances of an `ListOption`. It serves
 *  as an alternative token to an actual implementation which could result in undesired
 * retention of the class or circular references breaking runtime execution.
 * @docs-private
 */
export const LIST_OPTION = new InjectionToken<ListOption>('ListOption');
