import {NgModule, Provider} from '@angular/core';
import {DateAdapter} from "./date-adapter";
import {NativeDateAdapter} from "./native-date-adapter";
import {CUTE_NATIVE_DATE_FORMATS} from "./native-date-format";
import {CuteDateFormats, CUTE_DATE_FORMATS} from "./date-format";

@NgModule({
  providers: [{provide: DateAdapter, useClass: NativeDateAdapter}],
})
export class NativeDateModule {}

@NgModule({
  providers: [provideNativeDateAdapter()],
})
export class CuteNativeDateModule {}

export function provideNativeDateAdapter(
  formats: CuteDateFormats = CUTE_NATIVE_DATE_FORMATS,
): Provider[] {
  return [
    {provide: DateAdapter, useClass: NativeDateAdapter},
    {provide: CUTE_DATE_FORMATS, useValue: formats},
  ];
}

