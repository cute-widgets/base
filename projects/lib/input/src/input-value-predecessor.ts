/**
 * @license Apache-2.0
 *
 * Copyright (c) 2025 CuteWidgets Team. All Rights Reserved.
 *
 * You may not use this file except in compliance with the License
 * that can be found at http://www.apache.org/licenses/LICENSE-2.0
 */
import {InjectionToken} from "@angular/core";

export interface CuteInputValuePredecessor {
  beforeWriteValue(value: any): string;
  beforeOnChange(value: string): any;
}

/**
 * This token is used to inject an object with special methods that will be invoked before _ControlValueAccessor_'s methods do.
 * The typical example of such object is a _CuteEditMask_, that needs to get masked value before assign it to the view and
 * get cleaned value before send it to the model (form control).
 */
export const CUTE_INPUT_VALUE_PREDECESSOR = new InjectionToken<CuteInputValuePredecessor>(
  'CUTE_INPUT_VALUE_PREDECESSOR',
);
