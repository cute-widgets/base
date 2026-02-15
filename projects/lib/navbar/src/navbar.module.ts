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
import {CuteNavbar} from "./navbar.component";
import {CuteNavbarBrand} from "./navbar-brand.directive";
import {CuteNavbarContent} from "./navbar-content.component";
import {CuteNavbarToggler} from "./navbar-toggler.directive";
import {CuteNavbarNav} from "./navbar-nav.directive";
import {CuteNavbarText} from "./navbar-text.directive";
import {CuteCollapseModule} from '@cute-widgets/base/collapse';

@NgModule({
  declarations: [],
  imports: [
    CuteCollapseModule,
    CuteNavbar,
    CuteNavbarBrand,
    CuteNavbarContent,
    CuteNavbarNav,
    CuteNavbarText,
    CuteNavbarToggler,
  ],
  exports: [
    CuteNavbar,
    CuteNavbarBrand,
    CuteNavbarContent,
    CuteNavbarNav,
    CuteNavbarText,
    CuteNavbarToggler,
  ],
  providers: [],
})
export class CuteNavbarModule { }
