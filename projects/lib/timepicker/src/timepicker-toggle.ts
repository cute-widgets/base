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
  booleanAttribute,
  ChangeDetectionStrategy,
  Component,
  computed,
  HostAttributeToken,
  inject,
  input,
  InputSignal,
  InputSignalWithTransform,
  ViewEncapsulation,
} from '@angular/core';
import {CUTE_TIMEPICKER_CONFIG} from './util';
import type {CuteTimepicker} from './timepicker';
import {CuteButton} from "@cute-widgets/base/button";

/** Button that can be used to open a `cute-timepicker`. */
@Component({
  selector: 'cute-timepicker-toggle',
  templateUrl: 'timepicker-toggle.html',
  host: {
    'class': 'cute-timepicker-toggle',
    '[attr.tabindex]': 'null',
    // Bind the `click` on the host, rather than the inner `button`, so that we can call
    // `stopPropagation` on it without affecting the user's `click` handlers. We need to stop
    // it so that the input doesn't get focused automatically by the form field (See #21836).
    '(click)': '_open($event)',
  },
  exportAs: 'cuteTimepickerToggle',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CuteButton],
})
export class CuteTimepickerToggle<D> {
  private _defaultConfig = inject(CUTE_TIMEPICKER_CONFIG, {optional: true});
  private _defaultTabIndex = (() => {
    const value = inject(new HostAttributeToken('tabindex'), {optional: true});
    const parsed = Number(value);
    return isNaN(parsed) ? null : parsed;
  })();

  protected _isDisabled = computed(() => {
    const timepicker = this.timepicker();
    return this.disabled() || timepicker.disabled();
  });

  /** Timepicker instance that the button will toggle. */
  readonly timepicker: InputSignal<CuteTimepicker<D>> = input.required<CuteTimepicker<D>>({
    alias: 'for',
  });

  /** Screen-reader label for the button. */
  readonly ariaLabel = input<string | undefined>(undefined, {
    alias: 'aria-label',
  });

  /** Screen-reader labelled by id for the button. */
  readonly ariaLabelledby = input<string | undefined>(undefined, {
    alias: 'aria-labelledby',
  });

  /** Default aria-label for the toggle if none is provided. */
  private readonly _defaultAriaLabel = 'Open timepicker options';

  /** Whether the toggle button is disabled. */
  readonly disabled: InputSignalWithTransform<boolean, unknown> = input(false, {
    transform: booleanAttribute,
    alias: 'disabled',
  });

  /** Tabindex for the toggle. */
  readonly tabIndex: InputSignal<number | null> = input(this._defaultTabIndex);

  /** Whether ripples on the toggle should be disabled. */
  readonly disableRipple: InputSignalWithTransform<boolean, unknown> = input(
    this._defaultConfig?.disableRipple ?? false,
    {transform: booleanAttribute},
  );

  /** Opens the connected timepicker. */
  protected _open(event: Event): void {
    if (this.timepicker() && !this._isDisabled()) {
      this.timepicker().open();
      event.stopPropagation();
    }
  }

  /**
   * Checks for ariaLabelledby and if empty uses custom
   * aria-label or defaultAriaLabel if neither is provided.
   */
  getAriaLabel(): string | null {
    return this.ariaLabelledby() ? null : this.ariaLabel() || this._defaultAriaLabel;
  }
}
