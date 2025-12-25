/**
 * @license Apache-2.0
 *
 * Copyright (c) 2025 CuteWidgets Team. All Rights Reserved.
 *
 * You may not use this file except in compliance with the License
 * that can be found at http://www.apache.org/licenses/LICENSE-2.0
 */
import {NgModule, Type} from '@angular/core';
import {CommonModule} from '@angular/common';
import {CuteAutocomplete} from "./autocomplete";
import {CuteAutocompleteTrigger} from "./autocomplete-trigger";
import {CuteAutocompleteOrigin} from "./autocomplete-origin";
import {CuteOptionModule} from '@cute-widgets/base/core/option';

const TYPES: (any | Type<any>)[] = [
  CuteOptionModule,
  CuteAutocomplete,
  CuteAutocompleteTrigger,
  CuteAutocompleteOrigin
];

@NgModule({
  imports: [CommonModule, ...TYPES],
  exports: TYPES,
  declarations: [],
})
export class CuteAutocompleteModule {
}
