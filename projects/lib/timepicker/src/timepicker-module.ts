/**
 * @license Apache-2.0
 *
 * Copyright (c) 2025 CuteWidgets Team. All Rights Reserved.
 *
 * You may not use this file except in compliance with the License
 * that can be found at http://www.apache.org/licenses/LICENSE-2.0
 */
import {NgModule} from '@angular/core';
import {CdkScrollableModule} from '@angular/cdk/scrolling';
import {CuteTimepicker} from './timepicker';
import {CuteTimepickerInput} from './timepicker-input';
import {CuteTimepickerToggle} from './timepicker-toggle';

@NgModule({
  imports: [CuteTimepicker, CuteTimepickerInput, CuteTimepickerToggle],
  exports: [CdkScrollableModule, CuteTimepicker, CuteTimepickerInput, CuteTimepickerToggle],
})
export class CuteTimepickerModule {}
