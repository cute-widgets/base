import { Component } from '@angular/core';
import {CuteVStack} from '@cute-widgets/base/layout';
import {CuteInputModule} from '@cute-widgets/base/input';
import {FormControl, FormsModule, ReactiveFormsModule} from '@angular/forms';
import {CuteSliderModule} from '@cute-widgets/base/slider';
import {CuteCheckbox} from '@cute-widgets/base/checkbox';
import {ComponentViewer} from '../../component-viewer/component-viewer';
import {AbstractPage} from '../abstract/abstract-page';

@Component({
  selector: 'app-slider',
  imports: [
    ReactiveFormsModule,
    CuteVStack,
    CuteInputModule,
    CuteSliderModule,
    FormsModule,
    CuteCheckbox,
    ComponentViewer
  ],
  templateUrl: './slider.html',
  styleUrl: './slider.scss',
})
export class SliderPage extends AbstractPage {

  rangeValue: number = 3;
  rangeControl = new FormControl({ min: 20, max: 80 });

}
