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
import {NgModule, Type} from '@angular/core';
import {CuteIcon} from "./icon";

const TYPES: (any | Type<any>)[] = [
  CuteIcon
];

@NgModule({
    declarations: [],
    imports: TYPES,
    exports: TYPES,
})
export class CuteIconModule { }
