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
import {DialogModule} from '@angular/cdk/dialog';
import {PortalModule} from '@angular/cdk/portal';
import {NgModule} from '@angular/core';
import {BidiModule} from '@angular/cdk/bidi';
import {CuteBottomSheetContainer} from './bottom-sheet.container';
import {CuteBottomSheet} from './bottom-sheet';

@NgModule({
  imports: [DialogModule, PortalModule, CuteBottomSheetContainer],
  exports: [CuteBottomSheetContainer, BidiModule],
  providers: [CuteBottomSheet],
})
export class CuteBottomSheetModule {}
