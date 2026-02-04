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
  ElementRef, inject,
  Input,
  OnChanges, OnDestroy,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import {_IdGenerator} from '@angular/cdk/a11y';
import {HorizontalEdge} from '@cute-widgets/base/core/types';
import {_closeDialogVia, CuteDialogRef} from './dialog-ref';
import {CuteDialogHeader} from './dialog-header.component';
import {CuteDialog} from './dialog.service';

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
  dialogRef = inject<CuteDialogRef<any>>(CuteDialogRef, {optional: true})!;
  private _elementRef = inject<ElementRef<HTMLElement>>(ElementRef);
  private _dialog = inject(CuteDialog);

  /** Screen-reader label for the button. */
  @Input('aria-label') ariaLabel: string | undefined;

  /** Default to "button" to prevent accidental form submits. */
  @Input() type: 'submit' | 'button' | 'reset' = 'button';

  /** Dialog close input. */
  @Input('cute-dialog-close') dialogResult: any = undefined;
  @Input('cuteDialogClose') _cuteDialogClose: any = undefined;  // Handled in `ngOnChanges`

  constructor(...args: unknown[]);
  constructor() {}

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

@Directive()
export abstract class CuteDialogLayoutSection implements OnInit, OnDestroy {
  protected _dialogRef = inject<CuteDialogRef<any>>(CuteDialogRef, {optional: true})!;
  private _elementRef = inject<ElementRef<HTMLElement>>(ElementRef);
  private _dialog = inject(CuteDialog);

  protected abstract _onAdd(): void;
  protected abstract _onRemove(): void;

  ngOnInit() {
    if (!this._dialogRef) {
      this._dialogRef = getClosestDialog(this._elementRef, this._dialog.openDialogs)!;
    }

    if (this._dialogRef) {
      Promise.resolve().then(() => {
        this._onAdd();
      });
    }
  }

  ngOnDestroy() {
    // Note: we null check because there are some internal
    // tests that are mocking out `MatDialogRef` incorrectly.
    const instance = this._dialogRef?._containerInstance;

    if (instance) {
      Promise.resolve().then(() => {
        this._onRemove();
      });
    }
  }
}

/**
 * Title of a dialog element. Stays fixed to the top of the dialog when scrolling.
 */
@Directive({
  selector: '[cute-dialog-title], [cuteDialogTitle]',
  exportAs: 'cuteDialogTitle',
  host: {
    'class': 'cute-dialog-title modal-title user-select-none',
    '[id]': 'id || null',
    '[style]': '{"pointer-events":"none", "padding": !_header ? "var(--bs-modal-header-padding)" : undefined}',
  },
})
export class CuteDialogTitle extends CuteDialogLayoutSection {
  protected _header = inject(CuteDialogHeader, {optional: true, host: true});

  @Input() id: string = inject(_IdGenerator).getId('cute-dialog-title-');

  constructor() {
    super();
  }

  protected _onAdd() {
    // Note: we null check the queue, because there are some internal
    // tests that are mocking out `MatDialogRef` incorrectly.
    this._dialogRef._containerInstance?._addAriaLabelledBy?.(this.id);
  }

  protected override _onRemove(): void {
    this._dialogRef?._containerInstance?._removeAriaLabelledBy?.(this.id);
  }
}

/**
 * Scrollable content container of a dialog.
 */
@Directive({
  selector: `cute-dialog-body, [cute-dialog-body], [cuteDialogBody],
             cute-dialog-content, [cute-dialog-content], [cuteDialogContent]
  `,
  exportAs: 'cuteDialogBody',
  host: {
    'class': 'cute-dialog-body modal-body',
  },
  standalone: true,
})
export class CuteDialogBody {}

/**
 * Container for the bottom action buttons in a dialog.
 * Stays fixed to the bottom when scrolling.
 */
@Directive({
  selector: `cute-dialog-footer, [cute-dialog-footer], [cuteDialogFooter],
             cute-dialog-actions, [cute-dialog-actions], [cuteDialogActions]
  `,
  exportAs: 'cuteDialogFooter, cuteDialogActions',
  host: {
    'class': 'cute-dialog-footer cute-dialog-actions modal-footer',
    '[style.justify-content]': 'align',
  },
  standalone: true,
})
export class CuteDialogFooter extends CuteDialogLayoutSection {

  /** Horizontal alignment of the footer's content */
  @Input() align: HorizontalEdge | 'center' = 'end';

  protected _onAdd() {
    this._dialogRef._containerInstance?._updateActionSectionCount?.(1);
  }

  protected override _onRemove(): void {
    this._dialogRef._containerInstance?._updateActionSectionCount?.(-1);
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
