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

export type CuteDateFormats = {
  parse: {
    dateInput: any;
    timeInput?: any;
  };
  display: {
    dateInput: any;
    monthLabel?: any;
    monthYearLabel: any;
    dateA11yLabel: any;
    monthYearA11yLabel: any;
    timeInput?: any;
    timeOptionLabel?: any;
  };
};

export const CUTE_DATE_FORMATS = new InjectionToken<CuteDateFormats>('cute-date-formats');
