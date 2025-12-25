/**
 * @license Apache-2.0
 *
 * Copyright (c) 2025 CuteWidgets Team. All Rights Reserved.
 *
 * You may not use this file except in compliance with the License
 * that can be found at http://www.apache.org/licenses/LICENSE-2.0
 */
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {CuteStack} from "./stack.directive";
import {CuteVStack} from "./vstack.directive";
import {CuteHStack} from "./hstack.directive";

@NgModule({
    declarations: [],
    imports: [
        CommonModule,
        CuteStack,
        CuteVStack,
        CuteHStack,
    ],
    exports: [
        CuteStack,
        CuteVStack,
        CuteHStack,
    ]
})
export class CuteStackModule { }
