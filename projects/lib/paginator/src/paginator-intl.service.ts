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
import {Injectable} from '@angular/core';
import {Subject} from 'rxjs';

/**
 * To modify the labels and text displayed, create a new instance of CutePaginatorIntl and
 * include it in a custom provider
 */
@Injectable({providedIn: 'root'})
export class CutePaginatorIntl {
  /**
   * Stream to emit from when labels are changed. Use this to notify components when the labels have
   * changed after initialization.
   */
  readonly changes: Subject<void> = new Subject<void>();

  /** A label for the page size selector. */
  itemsPerPageLabel: string = 'Items per page:';

  /** A label for the button that increments the current page. */
  nextPageLabel: string = 'Next';

  /** A hint for the button that increments the current page. */
  nextPageLabelHint: string = 'Next page';

  /** A label for the button that decrements the current page. */
  previousPageLabel: string = 'Previous';

  /** A hint for the button that decrements the current page. */
  previousPageLabelHint: string = 'Previous page';

  /** A label for the button that moves to the first page. */
  firstPageLabel: string = 'First';

  /** A hint for the button that moves to the first page. */
  firstPageLabelHint: string = 'First page';

  /** A label for the button that moves to the last page. */
  lastPageLabel: string = 'Last';

  /** A hint for the button that moves to the last page. */
  lastPageLabelHint: string = 'Last page';

  /** A label for the range of items within the current page and the length of the whole list. */
  getRangeLabel: (page: number, pageSize: number, length: number) => string = (
    page: number,
    pageSize: number,
    length: number,
  ) => {

    let range = "0";

    if (length != 0 && pageSize != 0) {
      length = Math.max(length, 0);

      const startIndex = page * pageSize;
      // If the start index exceeds the list length, do not try and fix the end index to the end.
      const endIndex =
        startIndex < length ? Math.min(startIndex + pageSize, length) : startIndex + pageSize;

      range = `${startIndex + 1} – ${endIndex}`;
    }

    return `${range} of ${length}`;
  };
}
