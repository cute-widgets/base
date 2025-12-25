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
  Component,
  ViewEncapsulation,
  ElementRef,
  Input,
  ContentChildren,
  QueryList,
  AfterContentInit,
  Directive,
  ChangeDetectionStrategy,
  inject,
} from '@angular/core';
import {CuteLine, setLines} from '@cute-widgets/base/core';
import {coerceNumberProperty, NumberInput} from '@angular/cdk/coercion';
import {CUTE_GRID_LIST, CuteGridListBase} from './grid-list-base';

@Component({
  selector: 'cute-grid-tile',
  exportAs: 'cuteGridTile',
  host: {
    'class': 'cute-grid-tile',
    // Ensures that the "rowspan" and "colspan" input value is reflected in
    // the DOM. This is needed for the grid-tile harness.
    '[attr.rowspan]': 'rowspan',
    '[attr.colspan]': 'colspan',
  },
  templateUrl: 'grid-tile.html',
  styleUrls: ['grid-list.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
})
export class CuteGridTile {
  private _element = inject<ElementRef<HTMLElement>>(ElementRef);
  _gridList? = inject<CuteGridListBase>(CUTE_GRID_LIST, {optional: true});
  _rowspan: number = 1;
  _colspan: number = 1;

  constructor(...args: unknown[]);
  constructor() {}

  /** Number of rows that the grid tile takes up. */
  @Input()
  get rowspan(): number { return this._rowspan; }
  set rowspan(value: NumberInput) {
    this._rowspan = Math.round(coerceNumberProperty(value));
  }

  /** Number of columns that the grid tile takes up. */
  @Input()
  get colspan(): number { return this._colspan; }
  set colspan(value: NumberInput) {
    this._colspan = Math.round(coerceNumberProperty(value));
  }

  /**
   * Sets the style of the grid-tile element.  Needs to be set manually to avoid
   * "Changed after checked" errors that would occur with HostBinding.
   */
  _setStyle(property: string, value: any): void {
    (this._element.nativeElement.style as any)[property] = value;
  }
}

@Component({
  selector: 'cute-grid-tile-header, cute-grid-tile-footer',
  templateUrl: 'grid-tile-text.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  standalone: true,
})
export class CuteGridTileText implements AfterContentInit {
  private _element = inject<ElementRef<HTMLElement>>(ElementRef);
  @ContentChildren(CuteLine, {descendants: true}) _lines: QueryList<CuteLine> | undefined;

  constructor(...args: unknown[]);
  constructor() {}

  ngAfterContentInit() {
    if (this._lines) {
      setLines(this._lines, this._element);
    }
  }
}

/**
 * Directive whose purpose is to add the `cute-` CSS styling to this selector.
 */
@Directive({
  selector: '[cute-grid-avatar], [cuteGridAvatar]',
  host: {'class': 'cute-grid-avatar'},
  standalone: true,
})
export class CuteGridAvatarCssCuteStyler {}

/**
 * Directive whose purpose is to add the `cute-` CSS styling to this selector.
 */
@Directive({
  selector: 'cute-grid-tile-header',
  host: {'class': 'cute-grid-tile-header'},
  standalone: true,
})
export class CuteGridTileHeaderCssCuteStyler {}

/**
 * Directive whose purpose is to add the `cute-` CSS styling to this selector.
 */
@Directive({
  selector: 'cute-grid-tile-footer',
  host: {'class': 'cute-grid-tile-footer'},
  standalone: true,
})
export class CuteGridTileFooterCssCuteStyler {}
