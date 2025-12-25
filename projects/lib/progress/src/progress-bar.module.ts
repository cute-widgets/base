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
import {CuteProgressBar} from "./progress-bar.component";
import {CuteProgressStacked} from "./progress-stacked.component";

const TYPES: (any | Type<any>)[] = [
  CuteProgressBar,
  CuteProgressStacked,
];

@NgModule({
  imports: [CommonModule, ...TYPES],
  exports: TYPES,
  declarations: [],
})
export class CuteProgressBarModule {
}
