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
  AfterViewInit, ANIMATION_MODULE_TYPE, Attribute,
  ChangeDetectionStrategy, ChangeDetectorRef,
  Component,
  Directive, ElementRef, Host, HostAttributeToken, inject, Inject, Input, numberAttribute,
  OnDestroy, Optional,
  ViewEncapsulation
} from "@angular/core";
import {FocusableOption, FocusMonitor, FocusOrigin} from "@angular/cdk/a11y";
import {ENTER, SPACE, hasModifierKey} from "@angular/cdk/keycodes";
import {
  CUTE_EXPANSION_PANEL_DEFAULT_OPTIONS,
  CuteExpansionPanel,
  CuteExpansionPanelDefaultOptions
} from "./expansion-panel.component";
import {EMPTY, filter, merge, Subscription} from "rxjs";
import {CuteAccordionTogglePosition} from "./accordion-base.interface";

@Component({
  selector: 'cute-expansion-panel-header',
  templateUrl: './expansion-panel-header.component.html',
  styleUrls: ['./expansion-panel-header.component.scss'],
  exportAs: 'cuteExpansionPanelHeader',
  inputs: ['tabIndex'],
  host: {
    'class': 'cute-expansion-panel-header',
    '[class.accordion-header]': '!panel.accordion',
    '[class.cute-expanded]': '_isExpanded()',
    // '[class.cute-expansion-toggle-indicator-after]': `_getTogglePosition() === 'after'`,
    // '[class.cute-expansion-toggle-indicator-before]': `_getTogglePosition() === 'before'`,
    'role': 'button',
    '[attr.id]': 'panel._headerId',
    // CWT: we apply 'tabindex' rule on the nested '.accordion-button' element
    '[attr.tabindex]': '-1', /*'disabled ? -1 : tabIndex',*/
    // CWT: we apply 'aria-controls' on the nested '.accordion-button' element
    // '[attr.aria-controls]': '_getPanelId()',
    '[attr.aria-expanded]': '_isExpanded()',
    '[attr.aria-disabled]': 'panel.disabled', //'disabled',
    '[style.height]': '_getHeaderHeight()',
    '(click)': '_toggle()',
    '(keydown)': '_keydown($event)',
  },
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CuteExpansionPanelHeader implements AfterViewInit, OnDestroy, FocusableOption /* extends ... */ {
  readonly panel = inject(CuteExpansionPanel, {host: true});
  private _element = inject(ElementRef);
  private _focusMonitor = inject(FocusMonitor);
  private _changeDetectorRef = inject(ChangeDetectorRef);

  private _parentChangeSubscription = Subscription.EMPTY;

  constructor(...args: unknown[]);
  constructor() {
    const panel = this.panel;
    const defaultOptions = inject<CuteExpansionPanelDefaultOptions>(
      CUTE_EXPANSION_PANEL_DEFAULT_OPTIONS,
      {optional: true},
    );
    const tabIndex = inject(new HostAttributeToken('tabindex'), {optional: true});

    const accordionHideToggleChange = panel.accordion
        ? panel.accordion._stateChanges.pipe(
            filter(changes => !!(changes['hideToggle'] || changes['togglePosition'])),
        )
        : EMPTY;
    this.tabIndex = parseInt(tabIndex || '') || 0;

    // Since the toggle state depends on an @Input on the panel, we
    // need to subscribe and trigger change detection manually.
    this._parentChangeSubscription = merge(
        panel.opened,
        panel.closed,
        accordionHideToggleChange,
        panel._inputChanges.pipe(
            filter(changes => {
              return !!(changes['hideToggle'] || changes['disabled'] || changes['togglePosition']);
            }),
        ),
    ).subscribe(() => this._changeDetectorRef.markForCheck());

    // Avoids focus being lost if the panel contained the focused element and was closed.
    panel.closed
        .pipe(filter(() => panel._containsFocus()))
        .subscribe(() => this._focusMonitor.focusVia(this._element, 'program'));

    if (defaultOptions) {
      this.expandedHeight = defaultOptions.expandedHeight;
      this.collapsedHeight = defaultOptions.collapsedHeight;
    }
  }

  /** Height of the header while the panel is expanded. */
  @Input() expandedHeight: string | undefined;

  /** Height of the header while the panel is collapsed. */
  @Input() collapsedHeight: string | undefined;

  /** Tab index of the header. */
  @Input({
    transform: (value: unknown) => (value == null ? 0 : numberAttribute(value)),
  })
  tabIndex: number = 0;

  /** Whether the associated panel is disabled. Implemented as a part of `FocusableOption`. */
  get disabled(): boolean {
    return this.panel.disabled;
  }

  /** Toggles the expanded state of the panel. */
  protected _toggle(): void {
    if (!this.disabled) {
      this.panel.toggle();
    }
  }

  /** Gets whether the panel is expanded. */
  protected _isExpanded(): boolean {
    return this.panel.expanded;
  }

  /** Gets the expanded state string of the panel. */
  protected _getExpandedState(): string {
    return this.panel._getExpandedState();
  }

  /** Gets the panel id. */
  protected _getPanelId(): string {
    return this.panel.id;
  }

  /** Gets the toggle position for the header. */
  protected _getTogglePosition(): CuteAccordionTogglePosition {
    return this.panel.togglePosition;
  }

  /** Gets whether the expanded indicator should be shown. */
  protected _showToggle(): boolean {
    return !this.panel.hideToggle && !this.panel.disabled;
  }

  /**
   * Gets the current height of the header. Null if no custom height has been
   * specified, and if the default height from the stylesheet should be used.
   */
  protected _getHeaderHeight(): string | null {
    const isExpanded = this._isExpanded();
    if (isExpanded && this.expandedHeight) {
      return this.expandedHeight;
    } else if (!isExpanded && this.collapsedHeight) {
      return this.collapsedHeight;
    }
    return null;
  }

  /** Handle keydown event calling to toggle() if appropriate. */
  protected _keydown(event: KeyboardEvent) {
    switch (event.keyCode) {
        // Toggle for space and enter keys.
      case SPACE:
      case ENTER:
        if (!hasModifierKey(event)) {
          event.preventDefault();
          this._toggle();
        }
        break;
      default:
        if (this.panel.accordion) {
          this.panel.accordion._handleHeaderKeydown(event);
        }
        return;
    }
  }

  /**
   * Focuses the panel header. Implemented as a part of `FocusableOption`.
   * @param origin Origin of the action that triggered the focus.
   * @param options FocusOptions
   */
  focus(origin?: FocusOrigin, options?: FocusOptions) {
    if (origin) {
      this._focusMonitor.focusVia(this._element, origin, options);
    } else {
      this._element.nativeElement.focus(options);
    }
  }

  ngAfterViewInit() {
    this._focusMonitor.monitor(this._element).subscribe(origin => {
      if (origin && this.panel.accordion) {
        this.panel.accordion._handleHeaderFocus(this);
      }
    });
  }

  ngOnDestroy() {
    this._parentChangeSubscription.unsubscribe();
    this._focusMonitor.stopMonitoring(this._element);
  }

}

/**
 * Description element of a `<cute-expansion-panel-header>`.
 */
@Directive({
  selector: 'cute-panel-description',
  host: {
    class: 'cute-expansion-panel-header-description text-secondary ',
  },
  standalone: true,
})
export class CuteExpansionPanelDescription {}

/**
 * Title element of a `<cute-expansion-panel-header>`.
 */
@Directive({
  selector: 'cute-panel-title',
  host: {
    class: 'cute-expansion-panel-header-title',
  },
  standalone: true,
})
export class CuteExpansionPanelTitle {}
