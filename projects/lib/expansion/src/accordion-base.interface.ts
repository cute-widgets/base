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
import {CdkAccordion} from '@angular/cdk/accordion';

/** CuteAccordion's display modes. */
export type CuteAccordionDisplayMode = 'default' | 'flush';

/** CuteAccordion's toggle positions. */
export type CuteAccordionTogglePosition = 'before' | 'after';

/**
 * Base interface for a `CuteAccordion`.
 * @docs-private
 */
export interface CuteAccordionBase extends CdkAccordion {
  /** Whether the expansion indicator should be hidden. */
  hideToggle: boolean;

  /** Display mode used for all expansion panels in the accordion. */
  displayMode: CuteAccordionDisplayMode;

  /** The position of the expansion indicator. */
  togglePosition: CuteAccordionTogglePosition;

  /** Handles keyboard events coming in from the panel headers. */
  _handleHeaderKeydown: (event: KeyboardEvent) => void;

  /** Handles focus events on the panel headers. */
  _handleHeaderFocus: (header: any) => void;
}

/**
 * Token used to provide a `CuteAccordion` to `CuteExpansionPanel`.
 * Used primarily to avoid circular imports between `CuteAccordion` and `CuteExpansionPanel`.
 */
export const CUTE_ACCORDION = new InjectionToken<CuteAccordionBase>('CUTE_ACCORDION');
