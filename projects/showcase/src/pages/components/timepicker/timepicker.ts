import {Component} from '@angular/core';
import {CuteFormFieldModule} from '@cute-widgets/base/form-field';
import {CuteInputModule} from '@cute-widgets/base/input';
import {CuteTimepickerModule} from '@cute-widgets/base/timepicker';
import {FormsModule} from '@angular/forms';
import {ComponentHeader} from '../../../shared/utils/component-header';

@Component({
  selector: 'app-timepicker',
  imports: [
    FormsModule,
    CuteFormFieldModule,
    CuteInputModule,
    CuteTimepickerModule,
    ComponentHeader
  ],
  templateUrl: './timepicker.html',
  styleUrl: './timepicker.scss',
})
export class TimepickerPage {

}
