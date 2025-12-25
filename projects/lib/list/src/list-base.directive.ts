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
import {CuteFocusableControl} from "@cute-widgets/base/abstract";
import {Directive, HostBinding, inject, InjectionToken, Input} from "@angular/core";
import {LayoutBreakpoint, toTextBgCssClass} from "@cute-widgets/base/core";

/** Object that can be used to configure the default options for the list module. */
export interface CuteListConfig {
  /** Whether icon indicators should be hidden for single-selection. */
  hideSingleSelectionIndicator?: boolean;
}

/** Injection token that can be used to provide the default options the list module. */
export const CUTE_LIST_CONFIG = new InjectionToken<CuteListConfig>('CUTE_LIST_CONFIG');

let nextId: number = -1;

@Directive({
    host: {
      'class': 'cute-list-base list-group',
      '[class.list-group-flush]': '!!flushBorders',
      '[class.list-group-numbered]': 'numbered',
      '[class.cute-list-interactive]': '!_isNonInteractive',
      '[attr.aria-disabled]': 'disabled',
      'tabindex': '-1',
    }
})
export abstract class CuteListBase extends CuteFocusableControl {

  protected _defaultOptions = inject(CUTE_LIST_CONFIG, {optional: true});

  /** Whether the list and its items are not interactive. */
  _isNonInteractive: boolean = true;

  /** Remove some borders and rounded corners to render list group items edge-to-edge in a parent container (e.g., cards) */
  @Input() flushBorders: "full"|"partial"|undefined;

  /** Generate numbered list group items */
  @Input() numbered: boolean = false;

  /**
   * Whether to apply the layout of list group items from vertical to horizontal across all breakpoints.
   * Note that currently, horizontal list groups cannot be combined with `flush` list groups.
   */
  @Input() horizontal: boolean = false;
  /** Makes a list group horizontal responsive starting at the `Breakpoint`s _min-width_. */
  @Input() horizontalBreakpoint: LayoutBreakpoint | undefined;

  /**
   * Adds `.list-group-horizontal` to change the layout of list group items from vertical to horizontal across all breakpoints.
   * Currently, **horizontal list groups cannot be combined with flush list groups.**
   */
  @HostBinding("class")
  get getClassList(): string|undefined {
    let classList = [];
    if (this.horizontal && !this.flushBorders) {
      const horizontalClass = "list-group-horizontal";
      if (this.horizontalBreakpoint) {
        classList.push( horizontalClass+"-"+this.horizontalBreakpoint );
      } else {
        classList.push( horizontalClass );
      }
    }
    if (this.color) {
      classList.push( toTextBgCssClass(this.color) );
    }
    return classList ? classList.join(" ") : undefined;
  }

  protected override generateId(): string {
    return `cute-list-${++nextId}`;
  }

}
