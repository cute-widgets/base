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
 * Injection token used to provide a grid list to a tile and to avoid circular imports.
 */
export const CUTE_GRID_LIST = new InjectionToken<CuteGridListBase>('CUTE_GRID_LIST');

/**
 * Base interface for a `CuteGridList`.
 */
export interface CuteGridListBase {
  cols: number;
  gutterSize: string;
  rowHeight: number | string;
}
