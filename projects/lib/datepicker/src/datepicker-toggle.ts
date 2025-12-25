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
  AfterContentInit,
  Attribute,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ContentChild,
  Directive,
  Input,
  OnChanges,
  OnDestroy,
  SimpleChanges,
  ViewEncapsulation,
  ViewChild,
  booleanAttribute, inject, HostAttributeToken,
} from '@angular/core';
import {CuteButton /*, CuteIconButton*/} from '@cute-widgets/base/button';
import {merge, Observable, of as observableOf, Subscription} from 'rxjs';
import {CuteDatepickerIntl} from './datepicker-intl';
import {CuteDatepickerControl, CuteDatepickerPanel} from './datepicker-base';

/** Can be used to override the icon of a `cuteDatepickerToggle`. */
@Directive({
  selector: '[cuteDatepickerToggleIcon]',
  standalone: true,
})
export class CuteDatepickerToggleIcon {}

@Component({
    selector: 'cute-datepicker-toggle',
    templateUrl: './datepicker-toggle.html',
    styleUrl: './datepicker-toggle.scss',
    host: {
        'class': 'cute-datepicker-toggle',
        '[attr.tabindex]': 'null',
        '[class.cute-datepicker-toggle-active]': 'datepicker && datepicker.opened',
        '[class.cute-primary]': 'datepicker && datepicker.color === "primary"',
        '[class.cute-warning]': 'datepicker && datepicker.color === "warning"',
        // Used by the test harness to tie this toggle to its datepicker.
        '[attr.data-cute-calendar]': 'datepicker ? datepicker.id : null',
        // Bind the `click` on the host, rather than the inner `button`, so that we can call
        // `stopPropagation` on it without affecting the user's `click` handlers. We need to stop
        // it so that the input doesn't get focused automatically by the form field (See #21836).
        '(click)': '_open($event)',
    },
    exportAs: 'cuteDatepickerToggle',
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [CuteButton, /*CuteIconButton*/]
})
export class CuteDatepickerToggle<D> implements AfterContentInit, OnChanges, OnDestroy {
  _intl = inject(CuteDatepickerIntl);
  private _changeDetectorRef = inject(ChangeDetectorRef);
  private _stateChanges = Subscription.EMPTY;

  /** Datepicker instance that the button will toggle. */
  @Input('for') datepicker: CuteDatepickerPanel<CuteDatepickerControl<any>, D> | undefined;

  /** Tabindex for the toggle. */
  @Input() tabIndex: number | null;

  /** Screen-reader label for the button. */
  @Input('aria-label') ariaLabel: string | undefined;

  /** Whether the toggle button is disabled. */
  @Input({transform: booleanAttribute})
  get disabled(): boolean {
    if (this._disabled === undefined && this.datepicker) {
      return this.datepicker.disabled;
    }
    return !!this._disabled;
  }
  set disabled(value: boolean) {
    this._disabled = value;
  }
  private _disabled: boolean | undefined = undefined;

  /** Whether ripples on the toggle should be disabled. */
  @Input() disableRipple: boolean = false;

  /** Custom icon set by the consumer. */
  @ContentChild(CuteDatepickerToggleIcon) _customIcon: CuteDatepickerToggleIcon | undefined;

  /** Underlying button element. */
  @ViewChild('button') _button: CuteButton | undefined;

  constructor(...args: unknown[]);
  constructor() {
    const defaultTabIndex = inject(new HostAttributeToken('tabindex'), {optional: true});
    const parsedTabIndex = Number(defaultTabIndex);
    this.tabIndex = parsedTabIndex || parsedTabIndex === 0 ? parsedTabIndex : null;
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['datepicker']) {
      this._watchStateChanges();
    }
  }

  ngOnDestroy() {
    this._stateChanges.unsubscribe();
  }

  ngAfterContentInit() {
    this._watchStateChanges();
  }

  _open(event: Event): void {
    if (this.datepicker && !this.disabled) {
      this.datepicker.open();
      event.stopPropagation();
    }
  }

  private _watchStateChanges() {
    const datepickerStateChanged = this.datepicker ? this.datepicker.stateChanges : observableOf();
    const inputStateChanged =
      this.datepicker && this.datepicker.datepickerInput
        ? this.datepicker.datepickerInput.stateChanges
        : observableOf();
    const datepickerToggled = this.datepicker
      ? merge(this.datepicker.openedStream, this.datepicker.closedStream)
      : observableOf();

    this._stateChanges.unsubscribe();
    this._stateChanges = merge(
      this._intl.changes,
      datepickerStateChanged as Observable<void>,
      inputStateChanged,
      datepickerToggled,
    ).subscribe(() => this._changeDetectorRef.markForCheck());
  }
}
