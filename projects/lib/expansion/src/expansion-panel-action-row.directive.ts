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
import {Directive} from "@angular/core";

/**
 * Actions of a `<cute-expansion-panel>`.
 */
@Directive({
  selector: 'cute-action-row',
  host: {
    class: 'cute-action-row',
  },
  standalone: true,
})
export class CuteExpansionPanelActionRow {}
