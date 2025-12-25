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
import {CDK_TREE_NODE_OUTLET_NODE, CdkTreeNodeOutlet} from '@angular/cdk/tree';
import {Directive, inject, ViewContainerRef} from '@angular/core';

/**
 * Outlet for nested CdkNode. Put `[cuteTreeNodeOutlet]` on a tag to place children dataNodes
 * inside the outlet.
 */
@Directive({
  selector: '[cuteTreeNodeOutlet]',
  providers: [
    {
      provide: CdkTreeNodeOutlet,
      useExisting: CuteTreeNodeOutlet,
    },
  ],
  standalone: true,
})
export class CuteTreeNodeOutlet implements CdkTreeNodeOutlet {
  readonly viewContainer = inject(ViewContainerRef);
  readonly _node = inject(CDK_TREE_NODE_OUTLET_NODE, {optional: true});
}
