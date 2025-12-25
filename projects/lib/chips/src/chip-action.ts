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
  booleanAttribute,
  numberAttribute, inject,
} from '@angular/core';
import {ENTER, SPACE} from '@angular/cdk/keycodes';
import {CUTE_CHIP} from './tokens';

/**
 * Section within a chip.
 * @docs-private
 */
@Directive({
  selector: '[cuteChipAction]',
  host: {
    'class': 'cute-chip__action cute-chip-action',
    '[class.cute-chip__action--primary]': '_isPrimary',
    '[class.cute-chip__action--presentational]': '!isInteractive',
    '[class.cute-chip__action--secondary]': '!_isPrimary',
    '[class.cute-chip__action--trailing]': '!_isPrimary && !_isLeading',
    '[attr.tabindex]': '_getTabindex()',
    '[attr.disabled]': '_getDisabledAttribute()',
    '[attr.aria-disabled]': 'disabled',
    '(click)': '_handleClick($event)',
    '(keydown)': '_handleKeydown($event)',
  },
  standalone: true,
})
export class CuteChipAction {
  _elementRef = inject<ElementRef<HTMLElement>>(ElementRef);
  protected _parentChip = inject<{
    _handlePrimaryActionInteraction(): void;
    remove(): void;
    disabled: boolean;
    _edit(): void;
    _isEditing?: boolean;
  }>(CUTE_CHIP);

  /** Whether the action is interactive. */
  @Input() isInteractive = true;

  /** Whether this is the primary action in the chip. */
  _isPrimary = true;

  /** Whether this is the leading action in the chip. */
  _isLeading = false; // TODO(adolgachev): consolidate usage to secondary css class

  /** Whether the action is disabled. */
  @Input({transform: booleanAttribute})
  get disabled(): boolean { return this._disabled || this._parentChip.disabled; }
  set disabled(value: boolean) { this._disabled = value; }
  private _disabled = false;

  /** Tab index of the action. */
  @Input({
    transform: (value: unknown) => (value == null ? -1 : numberAttribute(value)),
  })
  tabIndex: number = -1;

  /**
   * Private API to allow focusing this chip when it is disabled.
   */
  @Input()
  _allowFocusWhenDisabled = false;

  /**
   * Determine the value of the disabled attribute for this chip action.
   */
  protected _getDisabledAttribute(): string | null {
    // When this chip action is disabled and focusing disabled chips is not permitted, return empty
    // string to indicate that disabled attribute should be included.
    return this.disabled && !this._allowFocusWhenDisabled ? '' : null;
  }

  /**
   * Determine the value of the tabindex attribute for this chip action.
   */
  protected _getTabindex(): string | null {
    return (this.disabled && !this._allowFocusWhenDisabled) || !this.isInteractive
      ? null
      : this.tabIndex.toString();
  }

  constructor(...args: unknown[]);

  constructor() {
    if (this._elementRef.nativeElement.nodeName === 'BUTTON') {
      this._elementRef.nativeElement.setAttribute('type', 'button');
    }
  }

  focus() {
    this._elementRef.nativeElement.focus();
  }

  protected _handleClick(event: MouseEvent) {
    if (!this.disabled && this.isInteractive && this._isPrimary) {
      event.preventDefault();
      this._parentChip._handlePrimaryActionInteraction();
    }
  }

  protected _handleKeydown(event: KeyboardEvent) {
    if (
      (event.keyCode === ENTER || event.keyCode === SPACE) &&
      !this.disabled &&
      this.isInteractive &&
      this._isPrimary &&
      !this._parentChip._isEditing
    ) {
      event.preventDefault();
      this._parentChip._handlePrimaryActionInteraction();
    }
  }
}
