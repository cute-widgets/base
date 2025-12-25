/**
 * @license Apache-2.0
 *
 * Copyright (c) 2025 CuteWidgets Team. All Rights Reserved.
 *
 * You may not use this file except in compliance with the License
 * that can be found at http://www.apache.org/licenses/LICENSE-2.0
 */
import {Directive, Input, ElementRef, HostListener, inject, Output, EventEmitter} from '@angular/core';

/**
 * Allows users to copy a text to _system_ clipboard using the `Clipboard API`. The Clipboard API allows users to
 * programmatically read and write text and other kinds of data to and from the system clipboard in _secure contexts_.
 *
 * @example
 * ```HTML
 * <button [cuteCopyToClipboard]="'Text to copy'"> Copy to Clipboard </button>
 * ```
 */
@Directive({
  selector: '[cuteCopyToClipboard]',
  standalone: true,
})
export class CuteCopyToClipboard {
  private el = inject(ElementRef);

  /** Text to copy to clipboard when the user clicks on the element that directive belongs to  */
  @Input("cuteCopyToClipboard") data?: string | ClipboardItem | ClipboardItems | (() => string|ClipboardItem|ClipboardItems);

  /** Emits when some text is copied to the clipboard. The emitted value indicates whether copying was successful. */
  @Output() cuteCopyToClipboardCopied = new EventEmitter<boolean>();

  constructor() {}

  @HostListener('click')
  onClick() {
    if (this.data) {
      if (window.isSecureContext) {
        try {
          let dataToWrite;
          if (this.data instanceof Function) {
            dataToWrite = this.data()
          } else {
            dataToWrite = this.data;
          }
          if (typeof dataToWrite === "string") {
            navigator.clipboard
              .writeText(dataToWrite)
              .then(() => this.cuteCopyToClipboardCopied.next(true))
              .catch(() => {
                this.cuteCopyToClipboardCopied.next(false);
              });
          } else {
            let items: ClipboardItems;
            if (dataToWrite instanceof ClipboardItem) {
              items = [dataToWrite];
            } else {
              items = dataToWrite;
            }
            navigator.clipboard
              .write(items)
              .then(() => this.cuteCopyToClipboardCopied.next(true))
              .catch(() => {
                this.cuteCopyToClipboardCopied.next(false);
              });
          }
        } catch (err: any) {
          console.error(err.message);
        }
      } else {
        console.error("The Clipboard API is available only in secure contexts (HTTPS)");
        this.cuteCopyToClipboardCopied.next(false);
      }
    } else {
      this.cuteCopyToClipboardCopied.next(false);
    }
  }
}
