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
import {Directive, ElementRef, inject, Inject, DOCUMENT} from '@angular/core';


/**
 * A directive that makes a <span> editable and exposes functions to modify and retrieve the
 * element's contents.
 */
@Directive({
  selector: 'span[cuteChipEditInput]',
  host: {
    'class': 'cute-chip-edit-input',
    'role': 'textbox',
    'tabindex': '-1',
    'contenteditable': 'true',
  },
  standalone: true,
})
export class CuteChipEditInput {
  private readonly _elementRef = inject(ElementRef);
  private readonly _document = inject(DOCUMENT);

  constructor(...args: unknown[]);
  constructor() {}

  initialize(initialValue: string) {
    this.getNativeElement().focus();
    this.setValue(initialValue);
  }

  getNativeElement(): HTMLElement {
    return this._elementRef.nativeElement;
  }

  setValue(value: string) {
    this.getNativeElement().textContent = value;
    this._moveCursorToEndOfInput();
  }

  getValue(): string {
    return this.getNativeElement().textContent || '';
  }

  private _moveCursorToEndOfInput() {
    const range = this._document.createRange();
    range.selectNodeContents(this.getNativeElement());
    range.collapse(false);
    const sel = window.getSelection()!;
    sel.removeAllRanges();
    sel.addRange(range);
  }
}
