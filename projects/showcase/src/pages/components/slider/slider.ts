import { Component } from '@angular/core';
import {CuteVStack} from '@cute-widgets/base/layout';
import {CuteInputModule} from '@cute-widgets/base/input';
import {FormControl, FormsModule, ReactiveFormsModule} from '@angular/forms';
import {CuteSliderModule} from '@cute-widgets/base/slider';
import {CuteCheckbox} from '@cute-widgets/base/checkbox';

@Component({
  selector: 'app-slider',
  imports: [
    ReactiveFormsModule,
    CuteVStack,
    CuteInputModule,
    CuteSliderModule,
    FormsModule,
    CuteCheckbox
  ],
  templateUrl: './slider.html',
  styleUrl: './slider.scss',
})
export class SliderPage {

  rangeValue: number = 3;
  rangeControl = new FormControl({ min: 20, max: 80 });

}
