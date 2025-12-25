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
import {
  CDK_TREE_NODE_OUTLET_NODE,
  CdkNestedTreeNode,
  CdkTreeNode,
  CdkTreeNodeDef,
} from '@angular/cdk/tree';
import {
  AfterContentInit,
  Directive,
  Input,
  OnDestroy,
  OnInit,
  booleanAttribute,
  numberAttribute, inject, HostAttributeToken,
} from '@angular/core';
import {NoopTreeKeyManager, TreeKeyManagerItem, TreeKeyManagerStrategy} from "@angular/cdk/a11y";

/**
 * Determine if argument TreeKeyManager is the NoopTreeKeyManager. This function is safe to use with SSR.
 */
function isNoopTreeKeyManager<T extends TreeKeyManagerItem>(
  keyManager: TreeKeyManagerStrategy<T>,
): keyManager is NoopTreeKeyManager<T> {
  return !!(keyManager as NoopTreeKeyManager<T>)._isNoopTreeKeyManager;
}

/**
 * Wrapper for the CdkTree node with CuteWidget's design styles.
 */
@Directive({
  selector: 'cute-tree-node',
  exportAs: 'cuteTreeNode',
  inputs: ['cdkTreeNodeTypeaheadLabel: cuteTreeNodeTypeaheadLabel'],
  outputs: ['activation', 'expandedChange'],
  providers: [{provide: CdkTreeNode, useExisting: CuteTreeNode}],
  host: {
    'class': 'cute-tree-node',
    '[attr.aria-expanded]': '_getAriaExpanded()',
    '[attr.aria-level]': 'level + 1',
    '[attr.aria-posinset]': '_getPositionInSet()',
    '[attr.aria-setsize]': '_getSetSize()',
    '(click)': '_focusItem()',
    '[tabindex]': '_getTabindexAttribute()',
  },
  standalone: true,
})
export class CuteTreeNode<T, K = T> extends CdkTreeNode<T, K> implements OnInit, OnDestroy {
  /**
   * The tabindex of the tree node.
   *
   * @deprecated By default CuteTreeNode manages focus using TreeKeyManager instead of tabIndex.
   *   Recommend to avoid setting tabIndex directly to prevent TreeKeyManager from getting into
   *   an unexpected state. Tabindex to be removed in a future version.
   * @breaking-change 21.0.0 Remove this attribute.
   */
  @Input({
    transform: (value: unknown) => (value == null ? 0 : numberAttribute(value)),
    alias: 'tabIndex',
  })
  get tabIndexInputBinding(): number { return this._tabIndexInputBinding; }
  set tabIndexInputBinding(value: number) {
    // If the specified tabIndex value is null or undefined, fall back to the default value.
    this._tabIndexInputBinding = value;
  }
  private _tabIndexInputBinding: number = 0;

  /**
   * The default tabindex of the tree node.
   *
   * @deprecated By default CuteTreeNode manages focus using TreeKeyManager instead of tabIndex.
   *   Recommend to avoid setting tabIndex directly to prevent TreeKeyManager form getting into
   *   an unexpected state. Tabindex to be removed in a future version.
   * @breaking-change 21.0.0 Remove this attribute.
   */
  defaultTabIndex = 0;

  protected _getTabindexAttribute() {
    if (isNoopTreeKeyManager(this._tree._keyManager)) {
      return this.tabIndexInputBinding;
    }
    return this._tabindex;
  }

  /**
   * Whether the component is disabled.
   *
   * @deprecated This is an alias for `isDisabled`.
   * @breaking-change 21.0.0 Remove this input
   */
  @Input({transform: booleanAttribute})
  get disabled(): boolean { return this.isDisabled; }
  set disabled(value: boolean) { this.isDisabled = value; }

  constructor(...args: unknown[]);
  constructor() {
    super();
    const tabIndex = inject(new HostAttributeToken('tabindex'), {optional: true});
    this.tabIndexInputBinding = Number(tabIndex) || this.defaultTabIndex;
  }

  // This is a workaround for https://github.com/angular/angular/issues/23091
  // In aot mode, the lifecycle hooks from parent class are not called.
  override ngOnInit() {
    super.ngOnInit();
  }

  override ngOnDestroy() {
    super.ngOnDestroy();
  }
}

/**
 * Wrapper for the CdkTree node definition with CuteWidgets' design styles.
 * Captures the node's template and a `when` predicate that describes when this node should be used.
 */
@Directive({
  selector: '[cuteTreeNodeDef]',
  inputs: ['when: cuteTreeNodeDefWhen'],
  providers: [{provide: CdkTreeNodeDef, useExisting: CuteTreeNodeDef}],
  standalone: true,
})
export class CuteTreeNodeDef<T> extends CdkTreeNodeDef<T> {
  @Input('cuteTreeNode') data: T | undefined;
}

/**
 * Wrapper for the CdkTree nested node with CuteWidgets' design styles.
 */
@Directive({
  selector: 'cute-nested-tree-node',
  exportAs: 'cuteNestedTreeNode',
  outputs: ['activation', 'expandedChange'],
  providers: [
    {provide: CdkNestedTreeNode, useExisting: CuteNestedTreeNode},
    {provide: CdkTreeNode, useExisting: CuteNestedTreeNode},
    {provide: CDK_TREE_NODE_OUTLET_NODE, useExisting: CuteNestedTreeNode},
  ],
  host: {
    'class': 'cute-nested-tree-node',
  },
  standalone: true,
})
export class CuteNestedTreeNode<T, K = T> extends CdkNestedTreeNode<T, K>
                                          implements AfterContentInit, OnDestroy, OnInit
{
  @Input('cuteNestedTreeNode') node: T | undefined;

  /**
   * Whether the node is disabled.
   *
   * @deprecated This is an alias for `isDisabled`.
   * @breaking-change 21.0.0 Remove this input
   */
  @Input({transform: booleanAttribute})
  get disabled(): boolean {return this.isDisabled; }
  set disabled(value: boolean) {this.isDisabled = value;}

  /** Tabindex of the node. */
  @Input({
    transform: (value: unknown) => (value == null ? 0 : numberAttribute(value)),
  })
  get tabIndex(): number { return this.isDisabled ? -1 : this._tabIndex; }
  set tabIndex(value: number) {
    // If the specified tabIndex value is null or undefined, fall back to the default value.
    this._tabIndex = value;
  }
  private _tabIndex: number = 0;

  // This is a workaround for https://github.com/angular/angular/issues/19145
  // In aot mode, the lifecycle hooks from parent class are not called.
  // TODO(tinayuangao): Remove when the angular issue #19145 is fixed
  override ngOnInit() {
    super.ngOnInit();
  }

  override ngAfterContentInit() {
    super.ngAfterContentInit();
  }

  override ngOnDestroy() {
    super.ngOnDestroy();
  }
}
