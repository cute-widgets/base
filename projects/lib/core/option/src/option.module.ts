import {NgModule, Type} from '@angular/core';
import {CuteOption} from './option.component';
import {CuteOptgroup} from './optgroup.component';

const TYPES: (any | Type<any>)[] = [
  CuteOption,
  CuteOptgroup,
];

@NgModule({
  imports: TYPES,
  exports: TYPES,
  declarations: [],
})
export class CuteOptionModule {
}
