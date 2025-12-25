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
import {CdkTextColumn} from '@angular/cdk/table';
import {ChangeDetectionStrategy, Component, ViewEncapsulation} from '@angular/core';
import {CuteColumnDef, CuteHeaderCellDef, CuteHeaderCell, CuteCellDef, CuteCell} from './cell';

/**
 * Column that simply shows text content for the header and row cells. Assumes that the table
 * is using the native table implementation (`<table>`).
 *
 * By default, the name of this column will be the header text and data property accessor.
 * The header text can be overridden with the `headerText` input. Cell values can be overridden with
 * the `dataAccessor` input. Change the text justification to the start or end using the `justify`
 * input.
 */
@Component({
    selector: 'cute-text-column',
    template: `
    <ng-container cuteColumnDef>
      <th cute-header-cell *cuteHeaderCellDef [style.text-align]="justify">
        {{headerText}}
      </th>
      <td cute-cell *cuteCellDef="let data" [style.text-align]="justify">
        {{dataAccessor(data, name)}}
      </td>
    </ng-container>
  `,
    encapsulation: ViewEncapsulation.None,
    // Change detection is intentionally not set to OnPush. This component's template will be provided
    // to the table to be inserted into its view. This is problematic when change detection runs since
    // the bindings in this template will be evaluated _after_ the table's view is evaluated, which
    // means the template in the table's view will not have the updated value (and in fact will cause
    // an ExpressionChangedAfterItHasBeenCheckedError).
    // tslint:disable-next-line:validate-decorators
    changeDetection: ChangeDetectionStrategy.Default,
    imports: [CuteColumnDef, CuteHeaderCellDef, CuteHeaderCell, CuteCellDef, CuteCell]
})
export class CuteTextColumn<T> extends CdkTextColumn<T> {}
