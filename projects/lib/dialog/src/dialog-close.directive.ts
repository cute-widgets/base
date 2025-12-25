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
  Directive,
  ElementRef,
  Input,
  OnChanges,
  OnInit,
  Optional,
  SimpleChanges,
} from '@angular/core';

import {CuteDialog} from './dialog.service';
import {_closeDialogVia, CuteDialogRef} from './dialog-ref';

/**
 * Button that will close the current dialog.
 */
@Directive({
  selector: '[cute-dialog-close], [cuteDialogClose]',
  exportAs: 'cuteDialogClose',
  standalone: true,
  host: {
    '(click)': '_onButtonClick($event)',
    '[attr.aria-label]': 'ariaLabel || null',
    '[attr.type]': 'type',
  },
})
export class CuteDialogClose implements OnInit, OnChanges {
  /** Screen-reader label for the button. */
  @Input('aria-label') ariaLabel: string | undefined;

  /** Default to "button" to prevent accidental form submits. */
  @Input() type: 'submit' | 'button' | 'reset' = 'button';

  /** Dialog close input. */
  @Input('cute-dialog-close') dialogResult: any = undefined;
  @Input('cuteDialogClose') _cuteDialogClose: any = undefined;  // Handled in `ngOnChanges`

  constructor(
    // The dialog title directive is always used in combination with a `CuteDialogRef`.
    @Optional() public dialogRef: CuteDialogRef<any>,
    private _elementRef: ElementRef<HTMLElement>,
    private _dialog: CuteDialog,
  ) {}

  ngOnInit() {
    if (!this.dialogRef) {
      // When this directive is included in a dialog via TemplateRef (rather than being
      // in a Component), the DialogRef isn't available via injection because embedded
      // views cannot be given a custom injector. Instead, we look up the `DialogRef` by
      // ID. This must occur in `onInit`, as the ID binding for the dialog container won't
      // be resolved at constructor time.
      this.dialogRef = getClosestDialog(this._elementRef, this._dialog.openDialogs)!;
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    const proxiedChange = changes['_cuteDialogClose'];

    if (proxiedChange) {
      this.dialogResult = proxiedChange.currentValue;
    }
  }

  protected _onButtonClick(event: MouseEvent) {
    // Determinate the focus origin using the click event, because using the FocusMonitor will
    // result in incorrect origins. Most of the time, close buttons will be auto focused in the
    // dialog, and therefore clicking the button won't result in a focus change. This means that
    // the FocusMonitor won't detect any origin change, and will always output `program`.
    _closeDialogVia(
      this.dialogRef,
      event.screenX === 0 && event.screenY === 0 ? 'keyboard' : 'mouse',
      this.dialogResult,
    );
  }
}

/**
 * Finds the closest CuteDialogRef to an element by looking at the DOM.
 * @param element Element relative to which to look for a dialog.
 * @param openDialogs References to the currently open dialogs.
 */
function getClosestDialog(element: ElementRef<HTMLElement>, openDialogs: CuteDialogRef<any>[]) {
  let parent: HTMLElement | null = element.nativeElement.parentElement;

  while (parent && !parent.classList.contains('cute-dialog-container')) {
    parent = parent.parentElement;
  }

  return parent ? openDialogs.find(dialog => dialog.id === parent!.id) : null;
}
