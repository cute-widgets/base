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
import {CdkTreeNodeToggle} from '@angular/cdk/tree';
import {Directive} from '@angular/core';

/**
 * Wrapper for the CdkTree's toggle with **CuteWidgets** design styles.
 */
@Directive({
  selector: '[cuteTreeNodeToggle]',
  providers: [{provide: CdkTreeNodeToggle, useExisting: CuteTreeNodeToggle}],
  inputs: ['recursive: cuteTreeNodeToggleRecursive'],
  standalone: true,
})
export class CuteTreeNodeToggle<T, K = T> extends CdkTreeNodeToggle<T, K> {}
