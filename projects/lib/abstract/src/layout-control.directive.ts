/**
 * @license Apache-2.0
 *
 * Copyright (c) 2025 CuteWidgets Team. All Rights Reserved.
 *
 * You may not use this file except in compliance with the License
 * that can be found at http://www.apache.org/licenses/LICENSE-2.0
 */
import {
  booleanAttribute,
  Directive,
  EventEmitter,
  HostBinding,
  inject,
  Input,
  Output,
  SimpleChanges
} from "@angular/core";
import {CuteBaseControl} from "./base-control.directive";
import {bsBreakpoints, LayoutBreakpoint, toTextBgCssClass} from "@cute-widgets/base/core";
import {BreakpointObserver, BreakpointState} from '@angular/cdk/layout';
import {Subscription} from 'rxjs';

@Directive({
    host: {
        '[class.clearfix]': 'clearfix',
        '[attr.tabindex]': '-1',
        '[attr.aria-label]': 'ariaLabel || null',
        '[attr.aria-labelledby]': 'ariaLabelledby || null',
        '[attr.aria-describedby]': 'ariaDescribedby || null',
        '[attr.role]': 'role || null',
        '[attr.id]': 'id || null',
    }
})
export abstract class CuteLayoutControl extends CuteBaseControl {
  protected breakpointObserver = inject(BreakpointObserver);
  private _bpSubscription: Subscription | undefined;

  /** Returns CSS-class list */
  @HostBinding("class")
  protected get classList(): string {
    // We interpret `color` value as a background color of the container
    return this.color ? toTextBgCssClass(this.color) : "";
  }

  /** Clears floated content within a container */
  @Input({transform: booleanAttribute}) clearfix: boolean = false;

  /** Symbolic name of the screen minimum width which determines how the responsive layout behaves across device or viewport sizes. */
  @Input() breakpoint: LayoutBreakpoint | LayoutBreakpoint[] | undefined;

  /** Event that is raised when the width of viewport is changed and crosses the size of `breakpoint`'s value. */
  @Output() breakpointState = new EventEmitter<BreakpointState>();

  override ngOnChanges(changes: SimpleChanges) {
    super.ngOnChanges(changes);

    const change = changes["breakpoint"];
    if (change) {

      this._bpSubscription?.unsubscribe();

      if (change.currentValue) {
        let bpArray: string[];
        if (Array.isArray(change.currentValue)) {
          bpArray = change.currentValue;
        } else {
          bpArray = [change.currentValue];
        }
        const queries = bpArray.map(value => {
          const label = bsBreakpoints.getLabel(value);
          return bsBreakpoints.getQuery(label+"AndDown") ?? "";
        });
        this._bpSubscription = this.breakpointObserver
          .observe( queries )
          .subscribe(state => this.breakpointState.emit(state));
      }
    }
  }

  override ngOnDestroy() {
    super.ngOnDestroy();

    this._bpSubscription?.unsubscribe();
  }
}
