/**
 * @license Apache-2.0
 *
 * Copyright (c) 2025 CuteWidgets Team. All Rights Reserved.
 *
 * You may not use this file except in compliance with the License
 * that can be found at http://www.apache.org/licenses/LICENSE-2.0
 */
import {
  ChangeDetectionStrategy,
  Component, computed, ContentChildren, EventEmitter,
  HostBinding,
  InjectionToken,
  Input, isDevMode, Output, QueryList, signal, ViewEncapsulation,
} from "@angular/core";
import {CuteLayoutControl} from "@cute-widgets/base/abstract";
import {CuteContainer} from "@cute-widgets/base/layout";
import {CuteNavbarContent} from './navbar-content.component';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';

/** Navbar's vertical non-static position. */
export type NavbarPosition="fixed-top"|"fixed-bottom"|"sticky-top"|"sticky-bottom";

export const CUTE_NAVBAR = new InjectionToken<CuteNavbar>("CUTE_NAVBAR");

let nextId = 0;

/**
 * Powerful and responsive navigation header in which responsive behavior depends on `CuteCollapse` component.
 * Includes support for branding, navigation, and more.
 */
@Component({
  selector: 'cute-navbar',
  template: `
    <cute-container fluid>
      <ng-content></ng-content>
    </cute-container>
  `,
  styles: [`
    .cute-navbar {
      z-index: 1000; /* CWT: 'cdk-overlay-container' has a rule {z-index: 1000} */
    }
  `],
  exportAs: 'cuteNavbar',
  host: {
    'class': 'cute-navbar navbar',
    '[class.shadow]': 'contentExpanded()',
    '[attr.role]': 'role || null',
  },
  providers: [{ provide: CUTE_NAVBAR, useExisting: CuteNavbar }],
  imports: [ CuteContainer ],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CuteNavbar extends CuteLayoutControl {
  private _expanded = signal<boolean>(false);

  @ContentChildren(CuteNavbarContent, {descendants: true}) navContent: QueryList<CuteNavbarContent> | undefined;

  /** Placement `navbar` in non-static position, if the `position` differs from the default.  */
  @Input() position: NavbarPosition | undefined;

  /** Event emitted when the navbar's content expansion status changed. */
  @Output() expansionChange = new EventEmitter<boolean>();

  readonly contentExpanded = computed(() => this._expanded());

  @HostBinding("class")
  get classBinding(): string {
    let classList = "";

    if (this.breakpoint) {
      classList += "navbar-expand-"+this.breakpoint;
    }
    switch (this.position) {
      case "fixed-top":
      case "fixed-bottom":
        classList += " "+this.position;
        break;
      case "sticky-top":
      case "sticky-bottom":
        if (this.breakpoint) {
          classList +=  " "+this.position.replace("-", "-"+this.breakpoint+"-");
        } else {
          classList += " "+this.position;
        }
        break;
    }
    return classList;
  }

  constructor() {
    super();
    this.role = "navigation";

    this.expansionChange.pipe(takeUntilDestroyed()).subscribe(state => {
        this._expanded.set(state);
    });
  }

  protected generateId(): string {
    return `cute-navbar-${++nextId}`;
  }

  override ngAfterContentInit() {
    super.ngAfterContentInit();

    const count = this.navContent?.length || 0;
    if (count > 1 && isDevMode()) {
      throw new Error("More than one 'cute-navbar-content' elements are found in the 'cute-navbar' component.");
    }
  }

}
