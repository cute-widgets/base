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
import {CuteExpansionPanel} from "./expansion-panel.component";
import {CuteExpansionPanelContent} from "./expansion-panel-content.directive";
import {
    CuteExpansionPanelDescription,
    CuteExpansionPanelHeader,
    CuteExpansionPanelTitle
} from "./expansion-panel-header.component";
import {CuteExpansionPanelActionRow} from "./expansion-panel-action-row.directive";
import {CuteAccordion} from "./accordion.directive";

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    CuteAccordion,
    CuteExpansionPanel,
    CuteExpansionPanelContent,
    CuteExpansionPanelHeader,
    CuteExpansionPanelActionRow,
    CuteExpansionPanelTitle,
    CuteExpansionPanelDescription,
  ],
  exports: [
    CuteAccordion,
    CuteExpansionPanel,
    CuteExpansionPanelContent,
    CuteExpansionPanelHeader,
    CuteExpansionPanelActionRow,
    CuteExpansionPanelTitle,
    CuteExpansionPanelDescription,
  ]
})
export class CuteExpansionModule { }
