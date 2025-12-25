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
import {ENTER, SPACE} from '@angular/cdk/keycodes';
import {Directive} from '@angular/core';
import {CuteChipAction} from './chip-action';
import {CUTE_CHIP_AVATAR, CUTE_CHIP_EDIT, CUTE_CHIP_REMOVE, CUTE_CHIP_TRAILING_ICON} from './tokens';

/** Avatar image within a chip. */
@Directive({
  selector: 'cute-chip-avatar, [cuteChipAvatar]',
  host: {
    'class': 'cute-chip-avatar cute-chip__icon cute-chip__icon--primary',
    'role': 'img',
  },
  providers: [{provide: CUTE_CHIP_AVATAR, useExisting: CuteChipAvatar}],
  standalone: true,
})
export class CuteChipAvatar {}

/** Non-interactive trailing icon in a chip. */
@Directive({
  selector: 'cute-chip-trailing-icon, [cuteChipTrailingIcon]',
  host: {
    'class':
      'cute-chip-trailing-icon cute-chip__icon cute-chip__icon--trailing',
    'aria-hidden': 'true',
  },
  providers: [{provide: CUTE_CHIP_TRAILING_ICON, useExisting: CuteChipTrailingIcon}],
  standalone: true,
})
export class CuteChipTrailingIcon extends CuteChipAction {
  /**
   * MDC considers all trailing actions as a remove icon,
   * but we support non-interactive trailing icons.
   */
  override isInteractive = false;

  override _isPrimary = false;
}

/**
 * Directive to edit the parent chip when the leading action icon is clicked or
 * when the ENTER key is pressed on it.
 *
 * Recommended for use with the Material Design "edit" icon
 * available at https://material.io/icons/#ic_edit.
 *
 * Example:
 *
 * ```
 * <cute-chip>
 *   <button cuteChipEdit aria-label="Edit">
 *     <cute-icon>edit</cute-icon>
 *   </button>
 * </cute-chip>
 * ```
 */

@Directive({
  selector: '[cuteChipEdit]',
  host: {
    'class':
      'cute-chip-edit cute-chip-avatar cute-focus-indicator ' +
      'cute-chip__icon cute-chip__icon--primary',
    'role': 'button',
    '[attr.aria-hidden]': 'null',
  },
  providers: [{provide: CUTE_CHIP_EDIT, useExisting: CuteChipEdit}],
})
export class CuteChipEdit extends CuteChipAction {
  override _isPrimary = false;
  override _isLeading = true;

  override _handleClick(event: MouseEvent): void {
    if (!this.disabled) {
      event.stopPropagation();
      event.preventDefault();
      this._parentChip._edit();
    }
  }

  override _handleKeydown(event: KeyboardEvent) {
    if ((event.keyCode === ENTER || event.keyCode === SPACE) && !this.disabled) {
      event.stopPropagation();
      event.preventDefault();
      this._parentChip._edit();
    }
  }
}

/**
 * Directive to remove the parent chip when the trailing icon is clicked or
 * when the ENTER key is pressed on it.
 *
 * Recommended for use with the Material Design "cancel" icon
 * available at https://material.io/icons/#ic_cancel.
 *
 * Example:
 *
 * ```
 * <cute-chip>
 *   <cute-icon cuteChipRemove>cancel</cute-icon>
 * </cute-chip>
 * ```
 */

@Directive({
  selector: '[cuteChipRemove]',
  host: {
    'class':
      'cute-chip-remove cute-chip-trailing-icon cute-focus-indicator ' +
      'cute-chip__icon cute-chip__icon--trailing cute-chip__action',
    'role': 'button',
    '[attr.aria-hidden]': 'null',
  },
  providers: [{provide: CUTE_CHIP_REMOVE, useExisting: CuteChipRemove}],
  standalone: true,
})
export class CuteChipRemove extends CuteChipAction {
  override _isPrimary = false;

  override _handleClick(event: MouseEvent): void {
    if (!this.disabled) {
      event.stopPropagation();
      event.preventDefault();
      this._parentChip.remove();
    }
  }

  override _handleKeydown(event: KeyboardEvent) {
    if ((event.keyCode === ENTER || event.keyCode === SPACE) && !this.disabled) {
      event.stopPropagation();
      event.preventDefault();
      this._parentChip.remove();
    }
  }
}
