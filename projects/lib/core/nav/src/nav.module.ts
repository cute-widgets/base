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
import {CuteNavItem} from "./nav-item.component";
import {CuteNavLink} from "./nav-link.directive";
import {CuteNav} from "./nav.directive";
import {CuteNavOutlet} from "./nav-outlet.component";
import {CuteNavContent} from "./nav-content.directive";
import {CuteNavPane} from "./nav-pane.directive";

const TYPES: (any | Type<any>)[] = [
  CuteNav,
  CuteNavItem,
  CuteNavLink,
  CuteNavOutlet,
  CuteNavContent,
  CuteNavPane,
];

@NgModule({
  declarations: [],
  imports: [CommonModule, ...TYPES],
  exports: [TYPES],
  providers: [],
})
export class CuteNavModule { }
