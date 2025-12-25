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
import {
  ChangeDetectionStrategy,
  Component,
  ContentChildren, ElementRef,
  Input,
  QueryList,
  ViewChild,
  ViewEncapsulation
} from "@angular/core";
import {coerceBooleanProperty} from "@angular/cdk/coercion";
import {CuteListItemBase} from "./list-item-base.directive";
import {CuteListItemTitle, CuteListItemLine, CuteListItemMeta} from "./list-item-sections";
import {CdkObserveContent} from "@angular/cdk/observers";

@Component({
    selector: `cute-list-item, a[cute-list-item], button[cute-list-item]`,
    templateUrl: './list-item.component.html',
    styleUrls: ['./list-item.component.scss'],
    exportAs: 'cuteListItem',
    host: {
      'class': 'cute-list-item',
      '[class.active]': 'activated',
      '[attr.aria-current]': '_getAriaCurrent()',
    },
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [CdkObserveContent],
})
export class CuteListItem extends CuteListItemBase {

  @ContentChildren(CuteListItemLine, {descendants: true}) _lines: QueryList<CuteListItemLine> | undefined;
  @ContentChildren(CuteListItemTitle, {descendants: true}) _titles: QueryList<CuteListItemTitle> | undefined;
  @ContentChildren(CuteListItemMeta, {descendants: true}) _meta: QueryList<CuteListItemMeta> | undefined;
  @ViewChild('unscopedContent') _unscopedContent: ElementRef<HTMLSpanElement> | undefined;
  @ViewChild('text') _itemText: ElementRef<HTMLElement> | undefined;

  /** Indicates whether an item in a `<cute-nav-list>` is the currently active page. */
  @Input()
  get activated(): boolean { return this._activated; }
  set activated(activated: any) {
    this._activated = coerceBooleanProperty(activated);
  }
  private _activated: boolean = false;

  /**
   * Determine the value of `aria-current`. Return 'page' if this item is an activated anchor tag.
   * Otherwise, return `null`. This method is safe to use with server-side rendering.
   */
  protected _getAriaCurrent(): string | null {
    return this._hostElement.nodeName === 'A' && this._activated ? 'page' : null;
  }

  // protected _hasBothLeadingAndTrailing(): boolean {
  //   return this._meta.length !== 0 && (this._avatars.length !== 0 || this._icons.length !== 0);
  // }

}

