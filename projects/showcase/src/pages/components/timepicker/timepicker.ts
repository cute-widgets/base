import {Component} from '@angular/core';
import {CuteFormFieldModule} from '@cute-widgets/base/form-field';
import {CuteInputModule} from '@cute-widgets/base/input';
import {CuteTimepickerModule} from '@cute-widgets/base/timepicker';
import {FormsModule} from '@angular/forms';
import {ComponentViewer} from "../../component-viewer/component-viewer";
import {AbstractPage} from '../abstract/abstract-page';

@Component({
  selector: 'app-timepicker',
    imports: [
        FormsModule,
        CuteFormFieldModule,
        CuteInputModule,
        CuteTimepickerModule,
        ComponentViewer
    ],
  templateUrl: './timepicker.html',
  styleUrl: './timepicker.scss',
})
export class TimepickerPage extends AbstractPage {}
