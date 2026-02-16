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
import {Platform} from '@angular/cdk/platform';

import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ContentChildren,
  Directive, inject,
  isDevMode,
  QueryList,
  ViewEncapsulation,
  DOCUMENT
} from '@angular/core';
import {CuteLayoutControl} from "@cute-widgets/base/abstract";

let nextUniqueId = 0;

@Directive({
  selector: 'cute-toolbar-row',
  exportAs: 'cuteToolbarRow',
  host: {'class': 'cute-toolbar-row'},
  standalone: true,
})
export class CuteToolbarRow {}

@Component({
  selector: 'cute-toolbar',
  exportAs: 'cuteToolbar',
  templateUrl: './toolbar.html',
  styleUrl: './toolbar.scss',
  host: {
    'class': 'cute-toolbar',
    '[class.cute-toolbar-multiple-rows]': '_toolbarRows ? _toolbarRows.length > 0 : false',
    '[class.cute-toolbar-single-row]': '_toolbarRows ? _toolbarRows.length === 0 : false',
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  standalone: true,
})
export class CuteToolbar extends CuteLayoutControl implements AfterViewInit {
  private _platform = inject(Platform);
  private _document = inject(DOCUMENT);

  /** Reference to all toolbar row elements that have been projected. */
  @ContentChildren(CuteToolbarRow, {descendants: true}) _toolbarRows: QueryList<CuteToolbarRow> | undefined;

  constructor(...args: unknown[]);
  constructor() {
    super();
  }

  override generateId(): string {
    return `cute-toolbar-${++nextUniqueId}`;
  }

  override ngAfterViewInit() {
    super.ngAfterViewInit();
    if (this._platform.isBrowser) {
      this._checkToolbarMixedModes();
      this._toolbarRows?.changes.subscribe(() => this._checkToolbarMixedModes());
    }
  }

  /**
   * Throws an exception when developers are attempting to combine the different toolbar row modes.
   */
  private _checkToolbarMixedModes() {
    if (this._toolbarRows?.length && isDevMode()) {
      // Check if there are any other DOM nodes that can display content but aren't inside a
      // <cute-toolbar-row> element.
      const isCombinedUsage = Array.from<HTMLElement>(this._elementRef.nativeElement.childNodes as NodeListOf<HTMLElement>)
                                    .filter(node => !(node.classList && node.classList.contains('cute-toolbar-row')))
                                    .filter(node => node.nodeType !== (this._document ? this._document.COMMENT_NODE : 8))
                                    .some(node => !!(node.textContent && node.textContent.trim()));
      if (isCombinedUsage) {
        throwToolbarMixedModesError();
      }
    }
  }
}

/**
 * Throws an exception when attempting to combine the different toolbar row modes.
 */
export function throwToolbarMixedModesError() {
  throw Error(
    'CuteToolbar: Attempting to combine different toolbar modes. ' +
    'Either specify multiple `<cute-toolbar-row>` elements explicitly or just place content ' +
    'inside a `<cute-toolbar>` for a single row.',
  );
}
