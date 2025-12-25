/**
 * @license Apache-2.0
 *
 * Copyright (c) 2025 CuteWidgets Team. All Rights Reserved.
 *
 * You may not use this file except in compliance with the License
 * that can be found at http://www.apache.org/licenses/LICENSE-2.0
 */
import {ChangeDetectionStrategy, Component, inject, signal, ViewEncapsulation} from "@angular/core";
import {CuteCollapse, CuteCollapseState} from "@cute-widgets/base/collapse";
import {CUTE_NAVBAR} from './navbar.component';
import {Subscription} from 'rxjs';

/**
 * Collapsible navbar content.
 */
@Component({
  selector: 'cute-navbar-content',
  template: `
    <ng-content></ng-content>
  `,
  exportAs: 'cuteNavbarContent',
  host: {
    'class': 'navbar-collapse collapse',
    '[class.show]': 'expanded',
  },
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
})
export class CuteNavbarContent extends CuteCollapse {
  private _subscription: Subscription = new Subscription();
  protected _navbar = inject(CUTE_NAVBAR);
  protected _breakpointMatches = signal<boolean>(false);

  constructor() {
    super();

    this._subscription.add(
      this._navbar.breakpointState.subscribe(state => {
        this._breakpointMatches.set(state.matches);
        if (!state.matches) {
          this.close(); // if content was in the 'expanded' state when the screen width changed
          this._navbar.expansionChange.emit(false);
        }
       })
    );
    this._subscription.add(
      this.afterExpand.subscribe(() => {
        if (this._breakpointMatches()) {
          this._navbar.expansionChange.emit(true);
        }
      })
    );
    this._subscription.add(
      this.afterCollapse.subscribe(() => this._navbar.expansionChange.emit(false))
    );
  }

  override getState(): CuteCollapseState  {
    if (this._breakpointMatches()) {
      return super.getState();
    }
    // Parent class, CuteCollapse, uses this state to trigger the expanding process.
    // But we use it for the sake of `visibility` property only.
    // TODO: Change to a simpler and clearer algorithm.
    return 'expanded';
  }

  override ngOnDestroy() {
    super.ngOnDestroy();
    this._subscription.unsubscribe();
  }

}
