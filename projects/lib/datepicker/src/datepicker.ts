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
import {ChangeDetectionStrategy, Component, ViewEncapsulation} from '@angular/core';
import {CuteDatepickerBase, CuteDatepickerControl} from './datepicker-base';
import {CUTE_SINGLE_DATE_SELECTION_MODEL_PROVIDER} from './date-selection-model';

// TODO(mmalerba): We use a component instead of a directive here so the user can use implicit
// template reference variables (e.g. #d vs #d="cuteDatepicker"). We can change this to a directive
// if angular adds support for `exportAs: '$implicit'` on directives.
/** Component responsible for managing the datepicker popup/dialog. */
@Component({
  selector: 'cute-datepicker',
  template: '',
  exportAs: 'cuteDatepicker',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  providers: [
    CUTE_SINGLE_DATE_SELECTION_MODEL_PROVIDER,
    {provide: CuteDatepickerBase, useExisting: CuteDatepicker},
  ],
  standalone: true,
})
export class CuteDatepicker<D> extends CuteDatepickerBase<CuteDatepickerControl<D>, D | null, D> {}
