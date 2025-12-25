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
import {ENTER} from '@angular/cdk/keycodes';
import {InjectionToken} from '@angular/core';

/** Default options, for the chips module, that can be overridden. */
export interface CuteChipsDefaultOptions {
  /** The list of key codes that will trigger a chipEnd event. */
  separatorKeyCodes: readonly number[] | ReadonlySet<number>;

  /** Whether icon indicators should be hidden for single-selection. */
  hideSingleSelectionIndicator?: boolean;

  /** Whether the chip input should be interactive while disabled by default. */
  inputDisabledInteractive?: boolean;
}

/** Injection token to be used to override the default options for the chips module. */
export const CUTE_CHIPS_DEFAULT_OPTIONS = new InjectionToken<CuteChipsDefaultOptions>(
  'cute-chips-default-options',
  {
    providedIn: 'root',
    factory: () => ({
      separatorKeyCodes: [ENTER],
    }),
  },
);

/**
 * Injection token that can be used to reference instances of `CuteChipAvatar`. It serves as
 * an alternative token to the actual `CuteChipAvatar` class which could cause unnecessary
 * retention of the class and its directive metadata.
 */
export const CUTE_CHIP_AVATAR = new InjectionToken('CuteChipAvatar');

/**
 * Injection token that can be used to reference instances of `CuteChipTrailingIcon`. It serves as
 * an alternative token to the actual `CuteChipTrailingIcon` class, which could cause unnecessary
 * retention of the class and its directive metadata.
 */
export const CUTE_CHIP_TRAILING_ICON = new InjectionToken('CuteChipTrailingIcon');

/**
 * Injection token that can be used to reference instances of `CuteChipEdit`. It serves as
 * alternative token to the actual `CuteChipEdit` class which could cause unnecessary
 * retention of the class and its directive metadata.
 */
export const CUTE_CHIP_EDIT = new InjectionToken('CuteChipEdit');

/**
 * Injection token that can be used to reference instances of `CuteChipRemove`. It serves as
 * an alternative token to the actual `CuteChipRemove` class, which could cause unnecessary
 * retention of the class and its directive metadata.
 */
export const CUTE_CHIP_REMOVE = new InjectionToken('CuteChipRemove');

/**
 * Injection token used to avoid a circular dependency between the `CuteChip` and `CuteChipAction`.
 */
export const CUTE_CHIP = new InjectionToken('CuteChip');
