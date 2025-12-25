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
  CdkFooterRow,
  CdkFooterRowDef,
  CdkHeaderRow,
  CdkHeaderRowDef,
  CdkRow,
  CdkRowDef,
  CdkNoDataRow,
  CdkCellOutlet,
} from '@angular/cdk/table';
import {
  booleanAttribute,
  ChangeDetectionStrategy,
  Component,
  Directive,
  Input,
  ViewEncapsulation
} from '@angular/core';
import {ThemeColor} from "@cute-widgets/base/core";

// We can't reuse `CDK_ROW_TEMPLATE` because it's incompatible with local compilation mode.
const ROW_TEMPLATE = `<ng-container cdkCellOutlet></ng-container>`;

/**
 * Header row definition for the `cute-table`.
 * Captures the header row's template and other header properties such as the columns to display.
 */
@Directive({
  selector: '[cuteHeaderRowDef]',
  providers: [{provide: CdkHeaderRowDef, useExisting: CuteHeaderRowDef}],
  inputs: [
    {name: 'columns', alias: 'cuteHeaderRowDef'},
    {name: 'sticky', alias: 'cuteHeaderRowDefSticky', transform: booleanAttribute},
  ],
})
export class CuteHeaderRowDef extends CdkHeaderRowDef {}

/**
 * Footer row definition for the `cute-table`.
 * Captures the footer row's template and other footer properties such as the columns to display.
 */
@Directive({
  selector: '[cuteFooterRowDef]',
  providers: [{provide: CdkFooterRowDef, useExisting: CuteFooterRowDef}],
  inputs: [
    {name: 'columns', alias: 'cuteFooterRowDef'},
    {name: 'sticky', alias: 'cuteFooterRowDefSticky', transform: booleanAttribute},
  ],
})
export class CuteFooterRowDef extends CdkFooterRowDef {}

/**
 * Data row definition for the `cute-table`.
 * Captures the data row's template and other properties such as the columns to display and
 * a when predicate that describes when this row should be used.
 */
@Directive({
  selector: '[cuteRowDef]',
  providers: [{provide: CdkRowDef, useExisting: CuteRowDef}],
  inputs: ['columns: cuteRowDefColumns', 'when: cuteRowDefWhen'],
})
export class CuteRowDef<T> extends CdkRowDef<T> {}

/** Header template container that contains the cell outlet. Adds the right class and role. */
@Component({
    selector: 'cute-header-row, tr[cute-header-row]',
    template: ROW_TEMPLATE,
    host: {
        'class': 'cute-header-row',
        '[class]': 'color ? "table-"+color : ""',
        'role': 'row',
    },
    // See note on CdkTable for explanation on why this uses the default change detection strategy.
    // tslint:disable-next-line:validate-decorators
    changeDetection: ChangeDetectionStrategy.Default,
    encapsulation: ViewEncapsulation.None,
    exportAs: 'cuteHeaderRow',
    providers: [{ provide: CdkHeaderRow, useExisting: CuteHeaderRow }],
    imports: [CdkCellOutlet]
})
export class CuteHeaderRow extends CdkHeaderRow {

  /* Cells' default color in the `<thead>` table section. */
  @Input() color: ThemeColor | undefined;

}

/** Footer template container that contains the cell outlet. Adds the right class and role. */
@Component({
    selector: 'cute-footer-row, tr[cute-footer-row]',
    template: ROW_TEMPLATE,
    host: {
        'class': 'cute-footer-row',
        '[class]': 'color ? "table-"+color : ""',
        'role': 'row',
    },
    // See note on CdkTable for explanation on why this uses the default change detection strategy.
    // tslint:disable-next-line:validate-decorators
    changeDetection: ChangeDetectionStrategy.Default,
    encapsulation: ViewEncapsulation.None,
    exportAs: 'cuteFooterRow',
    providers: [{ provide: CdkFooterRow, useExisting: CuteFooterRow }],
    imports: [CdkCellOutlet]
})
export class CuteFooterRow extends CdkFooterRow {

  /* Cells' default color in the `<tfoot>` table section. */
  @Input() color: ThemeColor | undefined;

}

/** Data row template container that contains the cell outlet. Adds the right class and role. */
@Component({
    selector: 'cute-row, tr[cute-row]',
    template: ROW_TEMPLATE,
    host: {
        'class': 'cute-row',
        '[class.table-active]': 'active',
        '[class]': 'color ? "table-"+color : ""',
        'role': 'row',
    },
    // See note on CdkTable for explanation on why this uses the default change detection strategy.
    // tslint:disable-next-line:validate-decorators
    changeDetection: ChangeDetectionStrategy.Default,
    encapsulation: ViewEncapsulation.None,
    exportAs: 'cuteRow',
    providers: [{ provide: CdkRow, useExisting: CuteRow }],
    imports: [CdkCellOutlet]
})
export class CuteRow extends CdkRow {

  /* Cells' default color in the `<tbody>` table section */
  @Input() color: ThemeColor | undefined;

  /* Whether the row has an active state */
  @Input({transform: booleanAttribute})
  active: boolean = false;

}

/** Row that can be used to display a message when no data is shown in the table. */
@Directive({
  selector: 'ng-template[cuteNoDataRow]',
  providers: [{provide: CdkNoDataRow, useExisting: CuteNoDataRow}],
  standalone: true,
})
export class CuteNoDataRow extends CdkNoDataRow {
  override _cellSelector = 'td, cute-cell, [cute-cell], .cute-cell';

  constructor() {
    super();
    this._contentClassNames.push('cute-no-data-row', 'cute-row');
    this._cellClassNames.push('cute-cell', 'cute-no-data-cell');
  }
}
