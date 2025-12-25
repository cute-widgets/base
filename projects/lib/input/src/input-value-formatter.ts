/**
 * @license Apache-2.0
 *
 * Copyright (c) 2025 CuteWidgets Team. All Rights Reserved.
 *
 * You may not use this file except in compliance with the License
 * that can be found at http://www.apache.org/licenses/LICENSE-2.0
 */
import {InjectionToken} from "@angular/core";

/** Object that can be used to format the current value of the input. */
export interface CuteInputValueFormatter {
  /**
   * Applies some formatting to the original value
   * @param value Value to format
   * @param args  Any number of arguments
   * @returns The final transformed or unchanged value
   */
  format(value: any, ...args: any[]): any
}

/** This token is used to inject an object that will be applied to format a raw input value */
export const CUTE_INPUT_VALUE_FORMATTER = new InjectionToken<CuteInputValueFormatter>('CUTE_INPUT_VALUE_FORMATTER');
