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
import {CdkTreeNodePadding} from '@angular/cdk/tree';
import {Directive, Input, numberAttribute} from '@angular/core';

/**
 * Wrapper for the CdkTree padding with **CuteWidgets** design styles.
 */
@Directive({
  selector: '[cuteTreeNodePadding]',
  providers: [{provide: CdkTreeNodePadding, useExisting: CuteTreeNodePadding}],
  standalone: true,
})
export class CuteTreeNodePadding<T, K = T> extends CdkTreeNodePadding<T, K> {
  /** The level of depth of the tree node. The padding will be `level * indent` pixels. */
  @Input({alias: 'cuteTreeNodePadding', transform: numberAttribute})
  override get level(): number { return this._level; }
  override set level(value: number) { this._setLevelInput(value); }

  /** The indent for each level. Default number 40px from material design menu submenu spec. */
  @Input('cuteTreeNodePaddingIndent')
  override get indent(): number | string { return this._indent; }
  override set indent(indent: number | string) { this._setIndentInput(indent); }
}
