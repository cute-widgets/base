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
import {CuteDialogHeader} from "./dialog-header.component";
import {CuteDialogContainer} from "./dialog-container.component";
import {CuteDialogClose, CuteDialogTitle, CuteDialogBody, CuteDialogFooter} from "./dialog-content-directives";
import {CuteDialog} from "./dialog.service";

const TYPES: (any | Type<any>)[] = [
  CuteDialogBody,
  CuteDialogClose,
  CuteDialogFooter,
  CuteDialogHeader,
  CuteDialogTitle,
  CuteDialogContainer,
];

@NgModule({
  imports: [CommonModule, ...TYPES],
  exports: TYPES,
  declarations: [],
  providers: [CuteDialog],
})
export class CuteDialogModule {
}
