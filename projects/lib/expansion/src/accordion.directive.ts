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
  AfterContentInit, booleanAttribute,
  ContentChildren,
  Directive,
  Input, OnDestroy, QueryList,
} from "@angular/core";
import {CdkAccordion} from "@angular/cdk/accordion";
import {
  CUTE_ACCORDION,
  CuteAccordionBase,
  CuteAccordionDisplayMode,
  CuteAccordionTogglePosition
} from "./accordion-base.interface";
import {FocusKeyManager} from "@angular/cdk/a11y";
import {CuteExpansionPanelHeader} from "./expansion-panel-header.component";
import {startWith} from "rxjs";

let nextId: number = -1;

@Directive({
  selector: 'cute-accordion',
  exportAs: 'cuteAccordion',
  host: {
    'class': 'cute-accordion accordion d-block',
    '[class.accordion-flush]': 'displayMode == "flush"',
    '[id]': 'id',
  },
  providers: [{provide: CUTE_ACCORDION, useExisting: CuteAccordion}],
})
export class CuteAccordion extends CdkAccordion implements CuteAccordionBase, AfterContentInit, OnDestroy {

  private _keyManager: FocusKeyManager<CuteExpansionPanelHeader> | undefined;

  /** Headers belonging to this accordion. */
  private _ownHeaders = new QueryList<CuteExpansionPanelHeader>();

  /** All headers inside the accordion. Includes headers inside nested accordions. */
  @ContentChildren(CuteExpansionPanelHeader, {descendants: true})
  _headers: QueryList<CuteExpansionPanelHeader> | undefined;

  /** Whether the expansion indicator should be hidden. */
  @Input({transform: booleanAttribute})
  hideToggle: boolean = false;

  /**
   * Display mode used for all expansion panels in the accordion. Currently two display
   * modes exist:
   *  default - a gutter-like spacing is placed around any expanded panel, placing the expanded
   *     panel at a different elevation from the rest of the accordion.
   *  flush - removes some borders and rounded corners to render expansion panels edge-to-edge with their parent container.
   */
  @Input() displayMode: CuteAccordionDisplayMode = 'default';

  /** The position of the expansion indicator. */
  @Input() togglePosition: CuteAccordionTogglePosition = 'after';

  ngAfterContentInit() {
    this._headers?.changes
        .pipe(startWith(this._headers))
        .subscribe((headers: QueryList<CuteExpansionPanelHeader>) => {
          this._ownHeaders.reset(headers.filter(header => header.panel.accordion === this));
          this._ownHeaders.notifyOnChanges();
        });

    this._keyManager = new FocusKeyManager(this._ownHeaders).withWrap().withHomeAndEnd();
  }

  /** Handles keyboard events coming in from the panel headers. */
  _handleHeaderKeydown(event: KeyboardEvent) {
    this._keyManager?.onKeydown(event);
  }

  _handleHeaderFocus(header: CuteExpansionPanelHeader) {
    this._keyManager?.updateActiveItem(header);
  }

  override ngOnDestroy() {
    super.ngOnDestroy();
    this._keyManager?.destroy();
    this._ownHeaders.destroy();
  }
}
