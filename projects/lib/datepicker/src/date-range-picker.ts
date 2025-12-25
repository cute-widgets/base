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
import {CuteDatepickerBase, CuteDatepickerContent, CuteDatepickerControl} from './datepicker-base';
import {CUTE_RANGE_DATE_SELECTION_MODEL_PROVIDER, DateRange} from './date-selection-model';
import {CUTE_CALENDAR_RANGE_STRATEGY_PROVIDER} from './date-range-selection-strategy';

/**
 * Input that can be associated with a date range picker.
 * @docs-private
 */
export interface CuteDateRangePickerInput<D> extends CuteDatepickerControl<D> {
  _getEndDateAccessibleName(): string | null;
  _getStartDateAccessibleName(): string | null;
  comparisonStart: D | null;
  comparisonEnd: D | null;
}

// TODO(mmalerba): We use a component instead of a directive here so the user can use implicit
// template reference variables (e.g. #d vs #d="matDateRangePicker"). We can change this to a
// directive if angular adds support for `exportAs: '$implicit'` on directives.
/** Component responsible for managing the date range picker popup/dialog. */
@Component({
  selector: 'cute-date-range-picker',
  template: '',
  exportAs: 'cuteDateRangePicker',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  providers: [
    CUTE_RANGE_DATE_SELECTION_MODEL_PROVIDER,
    CUTE_CALENDAR_RANGE_STRATEGY_PROVIDER,
    {provide: CuteDatepickerBase, useExisting: CuteDateRangePicker},
  ],
  standalone: true,
})
export class CuteDateRangePicker<D> extends CuteDatepickerBase<
  CuteDateRangePickerInput<D>,
  DateRange<D>,
  D
> {
  protected override _forwardContentValues(instance: CuteDatepickerContent<DateRange<D>, D>) {
    super._forwardContentValues(instance);

    const input = this.datepickerInput;

    if (input) {
      instance.comparisonStart = input.comparisonStart;
      instance.comparisonEnd = input.comparisonEnd;
      instance.startDateAccessibleName = input._getStartDateAccessibleName();
      instance.endDateAccessibleName = input._getEndDateAccessibleName();
    }
  }
}
