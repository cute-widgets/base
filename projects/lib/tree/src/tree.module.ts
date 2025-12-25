/**
 * @license Apache-2.0
 *
 * Copyright (c) 2025 CuteWidgets Team. All Rights Reserved.
 *
 * You may not use this file except in compliance with the License
 * that can be found at http://www.apache.org/licenses/LICENSE-2.0
 */
import {NgModule, Type} from '@angular/core';
import {CdkTreeModule} from "@angular/cdk/tree";
import {CuteNestedTreeNode, CuteTreeNode, CuteTreeNodeDef} from "./node";
import {CuteTreeNodeToggle} from "./toggle";
import {CuteTree} from "./tree";
import {CuteTreeNodeOutlet} from "./outlet";
import {CuteTreeNodePadding} from "./padding";

const TYPES: (any | Type<any>)[] = [
  CuteNestedTreeNode,
  CuteTreeNodeDef,
  CuteTreeNodePadding,
  CuteTreeNodeToggle,
  CuteTree,
  CuteTreeNode,
  CuteTreeNodeOutlet,
];

@NgModule({
  imports: [CdkTreeModule, ...TYPES],
  exports: TYPES,
  declarations: [],
})
export class CuteTreeModule {
}
