/**
 * @license Apache-2.0
 *
 * Copyright (c) 2025 CuteWidgets Team. All Rights Reserved.
 *
 * You may not use this file except in compliance with the License
 * that can be found at http://www.apache.org/licenses/LICENSE-2.0
 */
import {NgModule, Type} from '@angular/core';
import { CommonModule } from '@angular/common';
import {CuteList} from "./list";
import {CuteListItem} from "./list-item.component";
import {
  CuteListItemLine,
  CuteListItemTitle,
  CuteListItemMeta,
  CuteListItemAvatar,
  CuteListItemIcon
} from "./list-item-sections";
import {CuteListOption} from "./list-option.component";
import {CuteSelectionList} from "./selection-list.component";
import {CuteActionList} from "./action-list.component";
import {CuteNavList} from "./nav-list.directive";
import {CuteListSubheaderCssStyler} from "./subheader.directive";
import {CuteListBox} from "./listbox/listbox.component";
import {CuteListBoxOption} from "./listbox/listbox-option.component";

const TYPES: (any | Type<any>)[] = [
  CuteActionList,
  CuteList,
  CuteListItem,
  CuteListItemLine,
  CuteListItemTitle,
  CuteListItemMeta,
  CuteListItemAvatar,
  CuteListItemIcon,
  CuteListOption,
  CuteListSubheaderCssStyler,
  CuteListBox,
  CuteListBoxOption,
  CuteNavList,
  CuteSelectionList,
];

@NgModule({
  declarations: [],
  imports: [ CommonModule, ...TYPES ],
  exports: [ ...TYPES]
})
export class CuteListModule { }
