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
import {CdkTree} from '@angular/cdk/tree';
import {
  ChangeDetectionStrategy,
  Component, EventEmitter, Input,
  Output,
  ViewChild,
  ViewEncapsulation
} from '@angular/core';
import {CuteTreeNodeOutlet} from './outlet';
import {Subject, throttleTime} from "rxjs";
import {takeUntilDestroyed} from "@angular/core/rxjs-interop";
import {distinctUntilChanged} from "rxjs/operators";
import {ListRange} from "@angular/cdk/collections";

/**
 * Wrapper for the CdkTable with **CuteWidgets** design styles.
 */
@Component({
    selector: 'cute-tree',
    exportAs: 'cuteTree',
    template: `<ng-container cuteTreeNodeOutlet></ng-container>`,
    host: {
        'class': 'cute-tree',
        'role': 'tree',
    },
    styleUrls: ['./tree.scss'],
    encapsulation: ViewEncapsulation.None,
    // See note on CdkTree for explanation on why this uses the default change detection strategy.
    // tslint:disable-next-line:validate-decorators
    changeDetection: ChangeDetectionStrategy.Default,
    providers: [{ provide: CdkTree, useExisting: CuteTree }],
    imports: [CuteTreeNodeOutlet]
})
export class CuteTree<T, K = T> extends CdkTree<T, K> {

  private _renderChanges = new Subject<T[]>();

  /** Event emitted on each change in the rendered data. */
  @Output() renderNodesChange = new EventEmitter<T[]>();

  // Outlets within the tree's template where the dataNodes will be inserted.
  // We need an initializer here to avoid a TS error. The value will be set in `ngAfterViewInit`.
  @ViewChild(CuteTreeNodeOutlet, {static: true}) override _nodeOutlet: CuteTreeNodeOutlet =
    undefined!;

  constructor() {
    super();
    this._renderChanges
      .pipe(takeUntilDestroyed())
      .subscribe(nodes => this.renderNodesChange.emit(nodes));
  }

  override renderNodeChanges(data: T[]) {
    // We generate an event before calling the ancestor, otherwise
    // the content of `data` array will not be correct !!!???
    this._renderChanges.next(data);
    super.renderNodeChanges(data);
  }

  override ngOnDestroy() {
    super.ngOnDestroy();
    this._renderChanges.complete();
  }

}
