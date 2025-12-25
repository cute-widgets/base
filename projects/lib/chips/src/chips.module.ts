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
import {CuteChipAvatar, CuteChipRemove, CuteChipTrailingIcon} from "./chip-icons";
import {CuteChip} from "./chip";
import {CuteChipEditInput} from "./chip-edit-input";
import {CuteChipGrid} from "./chip-grid";
import {CuteChipInput} from "./chip-input";
import {CuteChipListbox} from "./chip-listbox";
import {CuteChipOption} from "./chip-option";
import {CuteChipRow} from "./chip-row";
import {CuteChipSet} from "./chip-set";
import {ErrorStateMatcher} from "@cute-widgets/base/core/error";
import {CUTE_CHIPS_DEFAULT_OPTIONS, CuteChipsDefaultOptions} from "./tokens";
import {ENTER} from "@angular/cdk/keycodes";

const TYPES: (any | Type<any>)[] = [
  CuteChip,
  CuteChipAvatar,
  CuteChipEditInput,
  CuteChipGrid,
  CuteChipInput,
  CuteChipListbox,
  CuteChipOption,
  CuteChipRemove,
  CuteChipRow,
  CuteChipSet,
  CuteChipTrailingIcon,
];

@NgModule({
  imports: [CommonModule, ...TYPES],
  exports: TYPES,
  declarations: [],
  providers: [
    ErrorStateMatcher,
    {
      provide: CUTE_CHIPS_DEFAULT_OPTIONS,
      useValue: {
        separatorKeyCodes: [ENTER],
      } as CuteChipsDefaultOptions,
    },
  ],
})
export class CuteChipsModule {
}
