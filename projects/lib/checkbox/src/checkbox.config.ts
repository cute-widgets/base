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
import {InjectionToken} from '@angular/core';
import {ThemeColor} from "@cute-widgets/base/core";

/**
 * Checkbox click action when a user clicks on an input element.
 * noop: Do not toggle checked or indeterminate.
 * check: Only toggle checked status, ignore indeterminate.
 * check-indeterminate: Toggle checked status, set indeterminate to false. Default behavior.
 * undefined: Same as `check-indeterminate`.
 */
export type CuteCheckboxClickAction = 'noop' | 'check' | 'check-indeterminate' | undefined;

/** Default `cute-checkbox` options that can be overridden. */
export interface CuteCheckboxDefaultOptions {
  /** Default theme color palette to be used for checkboxes. */
  color?: ThemeColor;
  /** Default checkbox click action for checkboxes. */
  clickAction?: CuteCheckboxClickAction;
  /** Whether disabled checkboxes should be interactive. */
  disabledInteractive?: boolean;
}

/** Injection token to be used to override the default options for `cute-checkbox`. */
export const CUTE_CHECKBOX_DEFAULT_OPTIONS = new InjectionToken<CuteCheckboxDefaultOptions>(
    'cute-checkbox-default-options',
    {
        providedIn: 'root',
        factory: CUTE_CHECKBOX_DEFAULT_OPTIONS_FACTORY,
    },
);

/** @docs-private */
export function CUTE_CHECKBOX_DEFAULT_OPTIONS_FACTORY(): CuteCheckboxDefaultOptions {
    return {
      color: 'primary',
      clickAction: 'check-indeterminate',
      disabledInteractive: false,
    };
}
