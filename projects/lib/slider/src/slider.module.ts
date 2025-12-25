import {NgModule, Type} from '@angular/core';
import {CommonModule} from '@angular/common';
import {CuteSlider} from './slider';
import {CuteSliderThumb} from './slider-thumb';

const TYPES: (any | Type<any>)[] = [
  CuteSlider,
  CuteSliderThumb
];

@NgModule({
  imports: [CommonModule, ...TYPES],
  exports: TYPES,
  declarations: [],
})
export class CuteSliderModule {
}
