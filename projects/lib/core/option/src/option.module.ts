import {NgModule, Type} from '@angular/core';
import {CommonModule} from '@angular/common';
import {CuteOption} from './option.component';
import {CuteOptgroup} from './optgroup.component';

const TYPES: (any | Type<any>)[] = [
  CuteOption,
  CuteOptgroup,
];

@NgModule({
  imports: [CommonModule, ...TYPES],
  exports: TYPES,
  declarations: [],
})
export class CuteOptionModule {
}
