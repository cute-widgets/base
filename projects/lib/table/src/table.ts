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
  booleanAttribute,
  ChangeDetectionStrategy,
  Component,
  Directive, HostBinding, InjectionToken, Input,
  OnInit,
  ViewEncapsulation,
} from '@angular/core';
import {
  CdkTable,
  CDK_TABLE,
  STICKY_POSITIONING_LISTENER,
  HeaderRowOutlet, DataRowOutlet, NoDataRowOutlet, FooterRowOutlet,
} from '@angular/cdk/table';
import {
  _DisposeViewRepeaterStrategy,
  _RecycleViewRepeaterStrategy,
  _VIEW_REPEATER_STRATEGY,
} from '@angular/cdk/collections';
import {ThemeColor} from "@cute-widgets/base/core";

//++ CWT
/**
 * Used to provide a table to some of the subcomponents without causing a circular dependency.
 */
export const CUTE_TABLE = new InjectionToken<CuteTable<any>>("CUTE_TABLE");

/** Type of table borders. `all` - on all sides of the table and cells, `none` - without borders */
export type TableBorders = "all" | "none";

/**
 * Enables the recycle view repeater strategy, which reduces rendering latency. Not compatible with
 * tables that animate rows.
 *
 * @deprecated This directive is a no-op and will be removed.
 * @breaking-change 23.0.0
 */
@Directive({
  selector: 'cute-table[recycleRows], table[cute-table][recycleRows]',
  providers: [{provide: _VIEW_REPEATER_STRATEGY, useClass: _RecycleViewRepeaterStrategy}],
  standalone: true,
})
export class CuteRecycleRows {}

@Component({
  selector: 'cute-table, table[cute-table]',
  exportAs: 'cuteTable',
  // Note that according to MDN, the `caption` element has to be projected as the **first**
  // element in the table. See https://developer.mozilla.org/en-US/docs/Web/HTML/Element/caption
  // We can't reuse `CDK_TABLE_TEMPLATE` because it's incompatible with local compilation mode.
  template: `
    <ng-content select="caption"/>
    <ng-content select="colgroup, col"/>

    <!--
      Unprojected content throws a hydration error so we need this to capture it.
      It gets removed on the client so it doesn't affect the layout.
    -->
    @if (_isServer) {
      <ng-content/>
    }

    @if (_isNativeHtmlTable) {
      <thead role="rowgroup">
        <ng-container headerRowOutlet/>
      </thead>
      <tbody class="cute-data-table__content" [class.table-group-divider]="divideGroups" role="rowgroup">
        <ng-container rowOutlet/>
        <ng-container noDataRowOutlet/>
      </tbody>
      <tfoot role="rowgroup" [class.table-group-divider]="divideGroups">
        <ng-container footerRowOutlet/>
      </tfoot>
    } @else {
      <ng-container headerRowOutlet/>
      <ng-container rowOutlet/>
      <ng-container noDataRowOutlet/>
      <ng-container footerRowOutlet/>
    }
  `,
  styleUrls: ['./table.scss'],
  host: {
    'class': 'cute-table table',
    '[class.cute-table-fixed-layout]': 'fixedLayout',
    '[class.table-hover]': 'hoveredRows',
    '[class.table-striped]': 'stripedRows',
    '[class.table-striped-columns]': 'stripedColumns',
    '[class.table-bordered]': 'displayBorders=="all"',
    '[class.table-borderless]': 'displayBorders=="none"',
    '[class.table-sm]': 'compact',
    '[class.cute-table-vertical-head]': 'verticalHeads',
    '[style.--bs-table-border-color]': 'borderColor ? "var(--bs-"+borderColor+")" : undefined',
  },
  providers: [
    { provide: CdkTable, useExisting: CuteTable },
    { provide: CDK_TABLE, useExisting: CuteTable },
    { provide: CUTE_TABLE, useExisting: CuteTable },
    // TODO(michaeljamesparsons) Abstract the view repeater strategy to a directive API so this code
    //  is only included in the build if used.
    { provide: _VIEW_REPEATER_STRATEGY, useClass: _DisposeViewRepeaterStrategy },
    // Prevent nested tables from seeing this table's StickyPositioningListener.
    { provide: STICKY_POSITIONING_LISTENER, useValue: null },
  ],
  encapsulation: ViewEncapsulation.None,
  // See note on CdkTable for explanation on why this uses the default change detection strategy.
  // tslint:disable-next-line:validate-decorators
  changeDetection: ChangeDetectionStrategy.Default,
  imports: [HeaderRowOutlet, DataRowOutlet, NoDataRowOutlet, FooterRowOutlet]
})
export class CuteTable<T> extends CdkTable<T> implements OnInit {
  /** Overrides the sticky CSS class set by the `CdkTable`. */
  protected override stickyCssClass = 'cute-table-sticky';

  /** Overrides the need to add position: sticky on every sticky cell element in `CdkTable`. */
  protected override needsPositionStickyOnElement = false;

  @HostBinding("class")
  get classList(): string {
    let classes = "";
    if (this.color) {
      classes += " table-"+this.color;
    }
    if (this.borderColor) {
      classes += " border-"+this.borderColor;
    }
    return classes.trim();
  }

  /** Theme color for all table cells. */
  @Input() color: ThemeColor | undefined;

  /** Theme color for cell borders. */
  @Input() borderColor: ThemeColor | undefined;

  /** Adds zebra-striping to any table row within the `<tbody>`. */
  @Input({transform: booleanAttribute}) stripedRows: boolean = false;

  /** Adds zebra-striping to any table column */
  @Input({transform: booleanAttribute}) stripedColumns: boolean = false;

  /** Enables a hover state on table rows within a `<tbody>` */
  @Input({transform: booleanAttribute}) hoveredRows: boolean = false;

  /** Makes a `<table>` more compact */
  @Input({transform: booleanAttribute})
  get compact(): boolean { return this._compact; }
  set compact(value: boolean) {
    if (value !== this._compact) {
      this._compact = value;
      this.updateStickyStyles();
    }
  }
  private _compact: boolean = false;

  /** What table borders to display. */
  @Input() displayBorders: TableBorders | undefined;

  /**
   *  Adds a thicker border, darker between table groups — `<thead>`, `<tbody>`, and `<tfoot>`.
   *  @experimental
   */
  @Input({transform: booleanAttribute}) divideGroups: boolean = false;

  /**
   * Whether to display `th` cells vertically.
   * @experimental
   */
  @Input({transform: booleanAttribute})
  get verticalHeads():boolean { return this._verticalHeads; }
  set verticalHeads(value: boolean) {
    if (value !== this._verticalHeads) {
      this._verticalHeads = value;
      this.updateStickyStyles();
    }
  }
  private _verticalHeads: boolean = false;

  protected updateStickyStyles() {
    this.updateStickyHeaderRowStyles();
    this.updateStickyFooterRowStyles();
    this.updateStickyColumnStyles();
  }

}
