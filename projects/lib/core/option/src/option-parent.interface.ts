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
import {InjectionToken, Signal} from '@angular/core';

/**
 * Describes a parent component that manages a list of options.
 * Contains properties that the options can inherit.
 */
export interface CuteOptionParentComponent {
  disableRipple?: boolean| Signal<boolean>;
  multiple?: boolean;
  inertGroups?: boolean;
  hideSingleSelectionIndicator?: boolean;
}

/**
 * Injection token used to provide the parent component to options.
 */
export const CUTE_OPTION_PARENT_COMPONENT = new InjectionToken<CuteOptionParentComponent>(
  'CUTE_OPTION_PARENT_COMPONENT',
);
