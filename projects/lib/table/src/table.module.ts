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
import {
  CuteCell,
  CuteCellDef,
  CuteColumnDef,
  CuteFooterCell,
  CuteFooterCellDef,
  CuteHeaderCell,
  CuteHeaderCellDef
} from "./cell";
import {
  CuteFooterRow,
  CuteFooterRowDef,
  CuteHeaderRow,
  CuteHeaderRowDef,
  CuteNoDataRow,
  CuteRow,
  CuteRowDef
} from "./row";
import {CuteTextColumn} from "./text-column";
import {CuteRecycleRows, CuteTable} from "./table";
import {CdkTableModule} from "@angular/cdk/table";

const TYPES: (any | Type<any>)[] = [
  // Table
  CuteTable,
  CuteRecycleRows,

  // Template defs
  CuteHeaderCellDef,
  CuteHeaderRowDef,
  CuteColumnDef,
  CuteCellDef,
  CuteRowDef,
  CuteFooterCellDef,
  CuteFooterRowDef,

  // Cell directives
  CuteHeaderCell,
  CuteCell,
  CuteFooterCell,

  // Row directives
  CuteHeaderRow,
  CuteRow,
  CuteFooterRow,
  CuteNoDataRow,

  CuteTextColumn,
];

@NgModule({
  imports: [CommonModule, CdkTableModule, ...TYPES],
  exports: TYPES,
  declarations: [],
})
export class CuteTableModule {
}
