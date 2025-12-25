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

import {A11yModule} from '@angular/cdk/a11y';
import {OverlayModule} from '@angular/cdk/overlay';
import {PortalModule} from '@angular/cdk/portal';
import {CommonModule} from '@angular/common';
import {NgModule, Type} from '@angular/core';
import {CuteButtonModule} from '@cute-widgets/base/button';
import {CdkScrollableModule} from '@angular/cdk/scrolling';
//import {CuteCommonModule} from '@angular/material/core';
import {CuteCalendar, CuteCalendarHeader} from './calendar';
import {CuteCalendarBody} from './calendar-body';
import {CuteDatepicker} from './datepicker';
import {
  CuteDatepickerContent,
} from './datepicker-base';
import {CuteDatepickerInput} from './datepicker-input';
import {CuteDatepickerIntl} from './datepicker-intl';
import {CuteDatepickerToggle, CuteDatepickerToggleIcon} from './datepicker-toggle';
import {CuteMonthView} from './month-view';
import {CuteMultiYearView} from './multi-year-view';
import {CuteYearView} from './year-view';
import {CuteDateRangeInput} from './date-range-input';
import {CuteStartDate, CuteEndDate} from './date-range-input-parts';
import {CuteDateRangePicker} from './date-range-picker';
import {CuteDatepickerActions, CuteDatepickerApply, CuteDatepickerCancel} from './datepicker-actions';

const TYPES: (any | Type<any>)[] = [
  CuteCalendar,
  CuteCalendarBody,
  CuteDatepicker,
  CuteDatepickerContent,
  CuteDatepickerInput,
  CuteDatepickerToggle,
  CuteDatepickerToggleIcon,
  CuteMonthView,
  CuteYearView,
  CuteMultiYearView,
  CuteCalendarHeader,
  CuteDateRangeInput,
  CuteStartDate,
  CuteEndDate,
  CuteDateRangePicker,
  CuteDatepickerActions,
  CuteDatepickerCancel,
  CuteDatepickerApply,
];


@NgModule({
  imports: [
    CommonModule,
    CuteButtonModule,
    OverlayModule,
    A11yModule,
    PortalModule,
  //  CuteCommonModule,
    ...TYPES,
  ],
  exports: [
    CdkScrollableModule,
    ...TYPES,
  ],
  providers: [CuteDatepickerIntl],
})
export class CuteDatepickerModule {}
