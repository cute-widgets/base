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
import {Directive, ElementRef, QueryList} from '@angular/core';
import {startWith} from 'rxjs/operators';

/**
 * Shared directive to count lines inside a text area, such as a list item.
 * Line elements can be extracted with a @ContentChildren(CuteLine) query, then
 * counted by checking the query list's length.
 */
@Directive({
  selector: '[cute-line], [cuteLine]',
  host: {'class': 'cute-line'},
  standalone: true,
})
export class CuteLine {}

/**
 * Helper that takes a query list of lines and sets the correct class on the host.
 */
export function setLines(
  lines: QueryList<unknown>,
  element: ElementRef<HTMLElement>,
  prefix = 'cute',
) {
  // Note: doesn't need to unsubscribe, because `changes`
  // gets completed by Angular when the view is destroyed.
  lines.changes.pipe(startWith(lines)).subscribe(({length}) => {
    setClass(element, `${prefix}-2-line`, false);
    setClass(element, `${prefix}-3-line`, false);
    setClass(element, `${prefix}-multi-line`, false);

    if (length === 2 || length === 3) {
      setClass(element, `${prefix}-${length}-line`, true);
    } else if (length > 3) {
      setClass(element, `${prefix}-multi-line`, true);
    }
  });
}

/** Adds or removes a class from an element. */
function setClass(element: ElementRef<HTMLElement>, className: string, isAdd: boolean): void {
  element.nativeElement.classList.toggle(className, isAdd);
}
