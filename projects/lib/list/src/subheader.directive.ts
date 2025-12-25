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
import {Directive} from '@angular/core';

/**
 * Directive whose purpose is to add the `cute-` CSS styling to this selector.
 */
@Directive({
  selector: '[cute-subheader], [cuteSubheader]',
  // TODO(mmalerba): MDC's subheader font looks identical to the list item font, figure out why and
  //  make a change in one of the repos to visually distinguish.
  host: {'class': 'cute-subheader cute-list-group__subheader'},
  standalone: true,
})
export class CuteListSubheaderCssStyler {}
