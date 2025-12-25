/**
 * @license Apache-2.0
 *
 * Copyright (c) 2025 CuteWidgets Team. All Rights Reserved.
 *
 * You may not use this file except in compliance with the License
 * that can be found at http://www.apache.org/licenses/LICENSE-2.0
 */
import {NgModule, Type} from '@angular/core';
import {CommonModule} from '@angular/common';
import {CdkScrollableModule} from "@angular/cdk/scrolling";
import {CuteDrawer, CuteDrawerContainer, CuteDrawerContent} from "./drawer";
import {CuteSidenav, CuteSidenavContainer, CuteSidenavContent} from "./sidenav";

const TYPES: (Type<any>)[] = [
    CuteDrawer,
    CuteDrawerContainer,
    CuteDrawerContent,
    CuteSidenav,
    CuteSidenavContainer,
    CuteSidenavContent,
];

@NgModule({
    declarations: [],
    imports: [CommonModule, CdkScrollableModule,  ...TYPES],
    exports: TYPES,
})
export class CuteSidenavModule {
}
