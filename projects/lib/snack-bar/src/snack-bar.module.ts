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
import {SimpleSnackBar} from "./simple-snack-bar";
import {
  CuteSnackBarAction,
  CuteSnackBarActions,
  CuteSnackBarBody,
  CuteSnackBarHeader,
  CuteSnackBarLabel
} from "./snack-bar-content";
import {CuteSnackBarContainer} from "./snack-bar-container";
import {CuteSnackBar} from './snack-bar.service';

const TYPES: (any | Type<any>)[] = [
  CuteSnackBarContainer,
  CuteSnackBarActions,
  CuteSnackBarAction,
  CuteSnackBarBody,
  CuteSnackBarHeader,
  CuteSnackBarLabel,
];

@NgModule({
  imports: [CommonModule, SimpleSnackBar, ...TYPES],
  exports: TYPES,
  providers: [CuteSnackBar],
  declarations: [],
})
export class CuteSnackbarModule {
}
