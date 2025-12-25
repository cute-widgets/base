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
import {CollectionViewer, DataSource} from '@angular/cdk/collections';
import {BehaviorSubject, merge, Observable} from 'rxjs';
import {map} from 'rxjs/operators';

/**
 * Data source for a nested tree.
 *
 * The data source for a nested tree doesn't have to consider node flattener, or the way to expand
 * or collapse. The expansion/collapsion will be handled by TreeControl and each non-leaf node.
 */
export class CuteTreeNestedDataSource<T> extends DataSource<T> {
  /**
   * Data for the nested tree
   */
  get data(): T[] { return this._data.value; }
  set data(value: T[]) {
    this._data.next(value);
  }
  private readonly _data = new BehaviorSubject<T[]>([]);

  connect(collectionViewer: CollectionViewer): Observable<T[]> {
    return merge(...([collectionViewer.viewChange, this._data] as Observable<unknown>[])).pipe(
      map(() => this.data),
    );
  }

  disconnect() {
    // no op
  }
}
