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
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  Directive, inject,
  OnDestroy,
  TemplateRef,
  ViewChild,
  ViewContainerRef,
  ViewEncapsulation,
} from '@angular/core';
import {TemplatePortal} from '@angular/cdk/portal';
import {CuteDatepickerBase, CuteDatepickerControl} from './datepicker-base';

/** Button that will close the datepicker and assign the current selection to the data model. */
@Directive({
  selector: '[cuteDatepickerApply], [cuteDateRangePickerApply]',
  host: {'(click)': '_applySelection()'},
  standalone: true,
})
export class CuteDatepickerApply {
  private _datepicker =
    inject<CuteDatepickerBase<CuteDatepickerControl<any>, unknown>>(CuteDatepickerBase);

  constructor(...args: unknown[]);
  constructor() {}

  _applySelection() {
    this._datepicker._applyPendingSelection();
    this._datepicker.close();
  }
}

/** Button that will close the datepicker and discard the current selection. */
@Directive({
  selector: '[cuteDatepickerCancel], [cuteDateRangePickerCancel]',
  host: {'(click)': '_datepicker.close()'},
  standalone: true,
})
export class CuteDatepickerCancel {
  _datepicker = inject<CuteDatepickerBase<CuteDatepickerControl<any>, unknown>>(CuteDatepickerBase);

  constructor(...args: unknown[]);
  constructor() {}
}

/**
 * Container that can be used to project a row of action buttons
 * to the bottom of a datepicker or date range picker.
 */
@Component({
  selector: 'cute-datepicker-actions, cute-date-range-picker-actions',
  styleUrl: './datepicker-actions.scss',
  template: `
    <ng-template>
      <div class="cute-datepicker-actions">
        <ng-content></ng-content>
      </div>
    </ng-template>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  standalone: true,
})
export class CuteDatepickerActions implements AfterViewInit, OnDestroy {
  private _datepicker =
    inject<CuteDatepickerBase<CuteDatepickerControl<any>, unknown>>(CuteDatepickerBase);
  private _viewContainerRef = inject(ViewContainerRef);

  @ViewChild(TemplateRef) _template!: TemplateRef<unknown>;
  private _portal!: TemplatePortal;

  constructor(...args: unknown[]);
  constructor() {}

  ngAfterViewInit() {
    this._portal = new TemplatePortal(this._template, this._viewContainerRef);
    this._datepicker.registerActions(this._portal);
  }

  ngOnDestroy() {
    this._datepicker.removeActions(this._portal);

    // Needs to be null checked since we initialize it in `ngAfterViewInit`.
    if (this._portal && this._portal.isAttached) {
      this._portal?.detach();
    }
  }
}
