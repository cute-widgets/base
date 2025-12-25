/**
 * @license Apache-2.0
 *
 * Copyright (c) 2025 CuteWidgets Team. All Rights Reserved.
 *
 * You may not use this file except in compliance with the License
 * that can be found at http://www.apache.org/licenses/LICENSE-2.0
 */
import {InjectionToken} from '@angular/core';

export function createValueToken<T>(value: T): InjectionToken<T> {
    return createFactoryToken(() => value);
}

export function createFactoryToken<T>(factory: () => T): InjectionToken<T> {
    return new InjectionToken<T>(`createFactoryToken`, {factory});
}
