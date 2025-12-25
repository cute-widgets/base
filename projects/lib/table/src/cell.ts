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
import {booleanAttribute, Directive, Input} from '@angular/core';
import {
  CdkCell,
  CdkCellDef,
  CdkColumnDef,
  CdkFooterCell,
  CdkFooterCellDef,
  CdkHeaderCell,
  CdkHeaderCellDef,
} from '@angular/cdk/table';
import {ThemeColor} from "@cute-widgets/base/core";

/**
 * Cell definition for the `cute-table`.
 * Captures the template of a column's data row cell as well as cell-specific properties.
 */
@Directive({
  selector: '[cuteCellDef]',
  providers: [{provide: CdkCellDef, useExisting: CuteCellDef}],
})
export class CuteCellDef extends CdkCellDef {}

/**
 * Header cell definition for the `cute-table`.
 * Captures the template of a column's header cell and as well as cell-specific properties.
 */
@Directive({
  selector: '[cuteHeaderCellDef]',
  providers: [{provide: CdkHeaderCellDef, useExisting: CuteHeaderCellDef}],
})
export class CuteHeaderCellDef extends CdkHeaderCellDef {}

/**
 * Footer cell definition for the `cute-table`.
 * Captures the template of a column's footer cell and as well as cell-specific properties.
 */
@Directive({
  selector: '[cuteFooterCellDef]',
  providers: [{provide: CdkFooterCellDef, useExisting: CuteFooterCellDef}],
})
export class CuteFooterCellDef extends CdkFooterCellDef {}

/**
 * Column definition for the `cute-table`.
 * Defines a set of cells available for a table column.
 */
@Directive({
  selector: '[cuteColumnDef]',
  inputs: [{name: 'sticky', transform: booleanAttribute}],
  providers: [
    {provide: CdkColumnDef, useExisting: CuteColumnDef},
    {provide: 'CUTE_SORT_HEADER_COLUMN_DEF', useExisting: CuteColumnDef},
  ],
  standalone: true,
})
export class CuteColumnDef extends CdkColumnDef {
  /** Unique name for this column. */
  @Input('cuteColumnDef')
  override get name(): string { return this._name; }
  override set name(name: string) {this._setNameInput(name);}

  /**
   * Add "cute-column-" prefix in addition to "cdk-column-" prefix.
   * In the future, this will only add "cute-column-" and columnCssClassName
   * will change from type string[] to string.
   */
  protected override _updateColumnCssClassName() {
    super._updateColumnCssClassName();
    this._columnCssClassName!.push(`cute-column-${this.cssClassFriendlyName}`);
  }
}

/** Header cell template container that adds the right classes and role. */
@Directive({
  selector: 'cute-header-cell, th[cute-header-cell]',
  host: {
    'class': 'cute-header-cell',
    '[class]': 'color ? "table-"+color : ""',
    'role': 'columnheader',
  },
  standalone: true,
})
export class CuteHeaderCell extends CdkHeaderCell {

  /* Header cell's theme color. */
  @Input() color: ThemeColor | undefined;

}

/** Footer cell template container that adds the right classes and role. */
@Directive({
  selector: 'cute-footer-cell, td[cute-footer-cell]',
  host: {
    'class': 'cute-footer-cell',
    '[class]': 'color ? "table-"+color : ""',
  },
  standalone: true,
})
export class CuteFooterCell extends CdkFooterCell {

  /* Footer cell's theme color */
  @Input() color: ThemeColor | undefined;

}

/** Cell template container that adds the right classes and role. */
@Directive({
  selector: 'cute-cell, td[cute-cell]',
  host: {
    'class': 'cute-cell',
    '[class.table-active]': 'active',
    '[class]': 'color ? "table-"+color : ""',
  },
  standalone: true,
})
export class CuteCell extends CdkCell {

  /* Body cell's theme color */
  @Input() color: ThemeColor | undefined;

  /* Body cell's activity state */
  @Input({transform: booleanAttribute})
  active: boolean = false;

}
