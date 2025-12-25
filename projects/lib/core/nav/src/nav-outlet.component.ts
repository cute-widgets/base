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
  Input,
  ViewEncapsulation,
} from "@angular/core";
import {NgFor} from "@angular/common";
import {PortalModule} from "@angular/cdk/portal";
import {CuteNav} from "./nav.directive";
import {CuteNavPane, CuteNavPaneOutlet} from "./nav-pane.directive";

@Component({
    selector: 'cute-nav-outlet',
    exportAs: 'cuteNavOutlet',
    template: `
      @for (item of nav?.navItems; track item.id; let i=$index) {
        <div cute-nav-pane
             [index]="i"
             [item]="item"
             [color]="item.defaultColor"
             [aria-labelledby]="item.navLink?.id || null">
          <ng-container [cuteNavPaneOutlet]="null"></ng-container>
        </div>
      }
    `,
    styles: [],
    host: {
        'class': 'cute-nav-outlet tab-content'
    },
    imports: [PortalModule, CuteNavPane, CuteNavPaneOutlet],
    //providers: [CuteAnimationService]
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class CuteNavOutlet /*implements AfterViewChecked*/ {

  @Input({alias: "for", required: true})
  get nav(): CuteNav|undefined {return this._nav;}
  set nav(value: CuteNav|undefined) { this._nav = value; }
  private _nav: CuteNav | undefined;
}
