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
import {CuteMenu} from "./menu";
import {CuteMenuItem} from "./menu-item";
import {CuteMenuContent} from "./menu-content";
import {CUTE_MENU_SCROLL_STRATEGY_FACTORY_PROVIDER, CuteMenuTrigger} from "./menu-trigger";

const TYPES: (any | Type<any>)[] = [
  CommonModule,
  CuteMenu,
  CuteMenuItem,
  CuteMenuContent,
  CuteMenuTrigger,
];

@NgModule({
  imports: [CommonModule, ...TYPES],
  exports: TYPES,
  declarations: [],
  providers: [CUTE_MENU_SCROLL_STRATEGY_FACTORY_PROVIDER],
})
export class CuteMenuModule { }
