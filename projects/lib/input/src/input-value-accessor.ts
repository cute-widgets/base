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
import {InjectionToken, WritableSignal} from '@angular/core';

/**
 * This token is used to inject the object whose value should be set into `CuteInput`. If none is
 * provided, the native `HTMLInputElement` is used. Directives like `CuteDatepickerInput` can provide
 * themselves for this token, in order to make `CuteInput` delegate the getting and setting of the
 * value to them.
 */
export const CUTE_INPUT_VALUE_ACCESSOR = new InjectionToken<{value: any  | WritableSignal<any>}>(
    'CUTE_INPUT_VALUE_ACCESSOR',
);
