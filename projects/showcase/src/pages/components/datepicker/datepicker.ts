import { Component } from '@angular/core';
import {CuteHStack, CuteVStack} from '@cute-widgets/base/layout';
import {CuteFormFieldModule} from '@cute-widgets/base/form-field';
import {FormControl, FormGroup, FormsModule, ReactiveFormsModule} from '@angular/forms';
import {CuteCalendarCellClassFunction, CuteDatepickerModule} from '@cute-widgets/base/datepicker';
import {CuteButtonModule} from '@cute-widgets/base/button';
import {CuteInputModule} from '@cute-widgets/base/input';
import {CuteIconModule} from '@cute-widgets/base/icon';
import {CuteCardModule} from '@cute-widgets/base/card';

const today = new Date();
const month = today.getMonth();
const year = today.getFullYear();

@Component({
  selector: 'app-datepicker',
  imports: [
    FormsModule,
    ReactiveFormsModule,
    CuteVStack,
    CuteHStack,
    CuteFormFieldModule,
    CuteInputModule,
    CuteButtonModule,
    CuteIconModule,
    CuteCardModule,
    CuteDatepickerModule,
  ],
  templateUrl: './datepicker.html',
  styleUrl: './datepicker.scss',
})
export class DatepickerPage {
  protected startDate = new Date(1990, 0, 1);
  protected selected: Date | null = null;
  protected fcStartDate = new FormControl<any>(null, {updateOn: "change"}); //"change"

  campaignOne = new FormGroup({
    start: new FormControl(new Date(year, month, 13)),
    end: new FormControl(new Date(year, month, 16)),
  });
  campaignTwo = new FormGroup({
    start: new FormControl(new Date(year, month, 15)),
    end: new FormControl(new Date(year, month, 19)),
  });

  dateClass: CuteCalendarCellClassFunction<Date> = (cellDate, view) => {
    // Only highlight dates inside the month view.
    if (view === 'month') {
      const date = cellDate.getDate();

      // Highlight the 1st and 20th day of each month.
      return date === 1 || date === 20 ? 'example-custom-date-class' : '';
    }

    return '';
  };


  protected myDateFilter = (d: Date | null): boolean => {
    const day = (d || new Date()).getDay();
    // Prevent Saturday and Sunday from being selected.
    return day !== 0 && day !== 6;
  };

}
