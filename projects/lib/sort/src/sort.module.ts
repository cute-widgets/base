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
import {NgModule, Type} from '@angular/core';
import {CommonModule} from '@angular/common';
import {CuteSort} from "./sort";
import {CuteSortHeader} from "./sort-header";
import {CUTE_SORT_HEADER_INTL_PROVIDER} from "./sort-header-intl";

const TYPES: (any | Type<any>)[] = [CuteSort, CuteSortHeader];

@NgModule({
  imports: [CommonModule, ...TYPES],
  exports: TYPES,
  providers: [CUTE_SORT_HEADER_INTL_PROVIDER],
  declarations: [],
})
export class CuteSortModule {
}
