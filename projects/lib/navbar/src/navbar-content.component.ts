/**
 * @license Apache-2.0
 *
 * Copyright (c) 2025 CuteWidgets Team. All Rights Reserved.
 *
 * You may not use this file except in compliance with the License
 * that can be found at http://www.apache.org/licenses/LICENSE-2.0
 */
import {
  AfterViewChecked,
  ChangeDetectionStrategy,
  Component,
  inject,
  signal, viewChild,
  ViewEncapsulation
} from "@angular/core";
import {CUTE_NAVBAR} from './navbar.component';
import {Subscription} from 'rxjs';
import {CuteLayoutControl, Expandable} from '@cute-widgets/base/abstract';
import {MediaMatcher} from '@angular/cdk/layout';
import {bsBreakpoints} from '@cute-widgets/base/core';
import {CuteNavbarCollapse} from './navbar-collapse.component';

let uniqueId: number = 0;

/**
 * Collapsible navbar content.
 */
@Component({
  selector: 'cute-navbar-content',
  template: `
    <cute-navbar-collapse>
      <ng-content></ng-content>
    </cute-navbar-collapse>
  `,
  styleUrl: './navbar-content.component.scss',
  exportAs: 'cuteNavbarContent',
  host: {
    'class': 'cute-navbar-content navbar-collapse',
    //'[class.collapsed]': '!expanded',
    '[class.breakpoint-matches]': '_breakpointMatches()',
  },
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CuteNavbarCollapse,
  ]
})
export class CuteNavbarContent extends CuteLayoutControl implements Expandable, AfterViewChecked {
  private _selfSubscriptions: Subscription = new Subscription();
  protected _navbar = inject(CUTE_NAVBAR);
  protected mediaMatcher = inject(MediaMatcher);
  protected _breakpointMatches = signal<boolean>(false);
  protected _collapse = viewChild.required(CuteNavbarCollapse);

  private readonly _navbarMediaQueries: string[];

  constructor() {
    super();

    this._navbarMediaQueries = bsBreakpoints.getMediaQueries(this._navbar.breakpoint ?? []);

    this._selfSubscriptions.add(
      this._navbar.breakpointState.subscribe(state => {
        this._breakpointMatches.set(state.matches);
        if (!state.matches) {
          this._collapse().close(); // if content was in the 'expanded' state when the screen width changed
          this._navbar.expansionChange.emit(false);
        }
      })
    );

  }

  get expanded(): boolean {
    return this._collapse().expanded;
  }

  private get mediaMatches(): boolean {
    if (this._navbarMediaQueries.length) {
      return this.mediaMatcher.matchMedia(this._navbarMediaQueries[0]).matches;
    }
    return false;
  }

  protected override generateId(): string {
    return `cute-navbar-content-${uniqueId++}`;
  }

  open() {
    this._collapse().open();
  }

  close() {
    this._collapse().close();
  }

  toggle() {
    this._collapse().toggle();
  }

  override ngOnInit() {
    super.ngOnInit();

     this._selfSubscriptions.add(
      this._collapse().afterExpand.subscribe(() => {
        if (this._breakpointMatches()) {
          this._navbar.expansionChange.emit(true);
        }
      })
    );
    this._selfSubscriptions.add(
      this._collapse().afterCollapse.subscribe(() => {
        this._navbar.expansionChange.emit(false);
      })
    );
  }

  ngAfterViewChecked() {
    this._breakpointMatches.set(this.mediaMatches);
  }

  override ngOnDestroy() {
    super.ngOnDestroy();
    this._selfSubscriptions.unsubscribe();
  }

}
