/**
 * @license Apache-2.0
 *
 * Copyright (c) 2025 CuteWidgets Team. All Rights Reserved.
 *
 * You may not use this file except in compliance with the License
 * that can be found at http://www.apache.org/licenses/LICENSE-2.0
 */
import {NgModule, Type} from '@angular/core';
import {CuteMenu} from "./menu";
import {CuteMenuItem} from "./menu-item";
import {CuteMenuContent} from "./menu-content";
import {CuteMenuTrigger} from "./menu-trigger";
import {CuteContextMenuTrigger} from './context-menu-trigger';
import {OverlayModule} from '@angular/cdk/overlay';
import {CdkScrollableModule} from '@angular/cdk/scrolling';


const TYPES: (any | Type<any>)[] = [
  CuteMenu,
  CuteMenuItem,
  CuteMenuContent,
  CuteMenuTrigger,
  CuteContextMenuTrigger,
];

@NgModule({
  imports: [OverlayModule, ...TYPES],
  exports: [CdkScrollableModule, ...TYPES],
})
export class CuteMenuModule { }
