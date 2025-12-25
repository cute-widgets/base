/**
 * @license Apache-2.0
 *
 * Copyright (c) 2025 CuteWidgets Team. All Rights Reserved.
 *
 * You may not use this file except in compliance with the License
 * that can be found at http://www.apache.org/licenses/LICENSE-2.0
 */
import {NgModule, Type} from '@angular/core';
import {CommonModule} from '@angular/common';
import {CuteFormField} from "./form-field.component";
import {CuteLabel} from "./directives/label.directive";
import {CuteIntro} from "./directives/intro.directive";
import {CuteHint} from "./directives/hint.directive";
import {CutePrefix} from "./directives/prefix.directive";
import {CuteSuffix} from "./directives/suffix.directive";
import {CuteError} from "./directives/error.directive";

const TYPES: (any | Type<any>)[] = [
  CuteFormField,
  CuteLabel,
  CuteIntro,
  CuteHint,
  CutePrefix,
  CuteSuffix,
  CuteError,
];

@NgModule({
    declarations: [],
    imports: [CommonModule, ...TYPES],
    exports: TYPES,
})
export class CuteFormFieldModule {
}
