/**
 * @license Apache-2.0
 *
 * Copyright (c) 2025 CuteWidgets Team. All Rights Reserved.
 *
 * You may not use this file except in compliance with the License
 * that can be found at http://www.apache.org/licenses/LICENSE-2.0
 *
 * This code is a modification of the `@angular/material` original
 * code licensed under MIT-style License (https://angular.dev/license).
 */
import {Directive, ElementRef, inject, Inject, Optional} from "@angular/core";
import {LIST_OPTION, ListOption} from "./list-option-types";

/**
 * Directive capturing the title of a list item. A list item usually consists of a
 * title and optional secondary or tertiary lines.
 *
 * Text content for the title never wraps. There can only be a single title per-list item.
 */
@Directive({
  selector: '[cuteListItemTitle]',
  host: {'class': 'cute-list-item-title'},
  standalone: true,
})
export class CuteListItemTitle {
  constructor(public _elementRef: ElementRef<HTMLElement>) {}
}

/**
 * Directive capturing a line in a list item. A list item usually consists of a
 * title and optional secondary or tertiary lines.
 *
 * Text content inside a line never wraps. There can be at maximum two lines per list item.
 */
@Directive({
  selector: '[cuteListItemLine]',
  host: {'class': 'cute-list-item-line'},
  standalone: true,
})
export class CuteListItemLine {
  constructor(public _elementRef: ElementRef<HTMLElement>) {}
}

/**
 * Directive matching an optional meta-section for list items.
 *
 * List items can reserve space at the end of an item to display a control,
 * button or additional text content.
 */
@Directive({
  selector: '[cuteListItemMeta]',
  host: {'class': 'cute-list-item-meta'},
  standalone: true,
})
export class CuteListItemMeta {}

/**
 * CuteWidgets uses the very intuitively named classes `.cute-list-item__start` and `.cute-list-item__end` to
 * position content such as icons or checkboxes/radios that comes either before or after the text
 * content respectively. This directive detects the placement of the checkbox/radio and applies the
 * correct CuteWidgets class to position the icon/avatar on the opposite side.
 */
@Directive({
    host: {
        '[class.cute-list-item__start]': '_isAlignedAtStart()',
        '[class.cute-list-item__end]': '!_isAlignedAtStart()',
    }
})
export abstract class _CuteListItemGraphicBase {
  public _listOption = inject<ListOption>(LIST_OPTION, {optional: true});

  _isAlignedAtStart() {
    // By default, in all list items, the graphic is aligned at start. In list options,
    // the graphic is only aligned at the start if the checkbox/radio is at the end.
    return !this._listOption || this._listOption?._getTogglePosition() === 'after';
  }
}

/**
 * Directive matching an optional avatar within a list item.
 *
 * List items can reserve space at the beginning of an item to display an avatar.
 */
@Directive({
  selector: '[cuteListItemAvatar]',
  host: {'class': 'cute-list-item-avatar'},
  standalone: true,
})
export class CuteListItemAvatar extends _CuteListItemGraphicBase {}

/**
 * Directive matching an optional icon within a list item.
 *
 * List items can reserve space at the beginning of an item to display an icon.
 */
@Directive({
  selector: '[cuteListItemIcon]',
  host: {'class': 'cute-list-item-icon'},
  standalone: true,
})
export class CuteListItemIcon extends _CuteListItemGraphicBase {}
