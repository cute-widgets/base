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
import {CdkAccordionItem} from '@angular/cdk/accordion';

/**
 * Base interface for a `CuteExpansionPanel`.
 */
export interface CuteExpansionPanelBase extends CdkAccordionItem {
  /** Whether the toggle indicator should be hidden. */
  hideToggle: boolean;
}

/**
 * Token used to provide a `CuteExpansionPanel` to `CuteExpansionPanelContent`.
 * Used to avoid circular imports between `CuteExpansionPanel` and `CuteExpansionPanelContent`.
 */
export const CUTE_EXPANSION_PANEL = new InjectionToken<CuteExpansionPanelBase>('CUTE_EXPANSION_PANEL');
