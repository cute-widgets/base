/**
 * @license Apache-2.0
 *
 * Copyright (c) 2025 CuteWidgets Team. All Rights Reserved.
 *
 * You may not use this file except in compliance with the License
 * that can be found at http://www.apache.org/licenses/LICENSE-2.0
 */
import {
  booleanAttribute, ChangeDetectionStrategy, Component,
  ContentChild,
  inject,
  InjectionToken,
  Input, TemplateRef, ViewChild,
  ViewContainerRef, ViewEncapsulation
} from "@angular/core";
import {CuteNavContent} from "./nav-content.directive";
import {CUTE_NAV, CuteNav} from "./nav.directive";
import {CuteLayoutControl} from "@cute-widgets/base/abstract";
import {CdkPortal, TemplatePortal} from "@angular/cdk/portal";
import {CuteNavLink} from "./nav-link.directive";
import {RichThemeColor} from "@cute-widgets/base/core";

let nextId: number = 0;

/**
* Token used to provide a `CuteNavItem` to `CuteNavLink`.
* Used to avoid circular imports between `CuteNavItem` and `CuteNavLink`.
*/
export const CUTE_NAV_ITEM = new InjectionToken<CuteNavItem>('CUTE_NAV_ITEM');

/**
 * The purpose of this class is to ensure that the list items in the navigation have the correct spacing in **Bootstrap** framework.
 */
@Component({
  selector: 'cute-nav-item, [cute-nav-item], [cuteNavItem]',
  template: `
    <ng-content select="[cute-nav-link], [cuteNavLink]"></ng-content>
    <ng-content select="[cute-nav-content], [cuteNavContent]"></ng-content>
    <ng-template #staticContent>
      <ng-content></ng-content>
    </ng-template>
  `,
  exportAs: 'cuteNavItem',
  host: {
    'class': 'cute-nav-item nav-item',
    '[attr.role]': 'role || null',
  },
  standalone: true,
  providers: [{provide: CUTE_NAV_ITEM, useExisting: CuteNavItem}],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CuteNavItem extends CuteLayoutControl {
  // DI
  protected _viewContainerRef = inject(ViewContainerRef);
  readonly nav: CuteNav = inject(CUTE_NAV);

  /** Nested `nav-link` element */
  @ContentChild(CuteNavLink, {descendants: true})
  readonly navLink: CuteNavLink | undefined;

  /** Nested <ng-template cuteNavContent> projected content */
  @ContentChild(CuteNavContent, {static: true})
  private _navContent: CuteNavContent | null = null;

  /** Unscoped projected content */
  @ViewChild('staticContent', {read: TemplateRef, static: true})
  private _staticContentTemplate: TemplateRef<any> | undefined;

  /**
   * By default, tabs remove their content from the DOM while it's off-screen. Setting this to _true_ will keep it in
   * the DOM which will prevent elements like `iframes` and `videos` from reloading next time it comes back into the view.
   */
  @Input({transform: booleanAttribute})
  get preserveTabContent(): boolean { return this._preserveTabContent || this.nav.preserveTabContent; }
  set preserveTabContent(value: boolean | undefined) {
    this._preserveTabContent = value;
  }
  private _preserveTabContent: boolean | undefined;

  /** Portal that will be the hosted content of the nav */
  get content(): CdkPortal | null { return this._contentPortal; }
  private _contentPortal: CdkPortal | null = null;

  /**
   * Whether the tab/nav is currently active.
   */
  get isActive(): boolean {
   return this.navLink?.active || false;
  }

  /** Override the `color` setting for Tab control  */
  override get color(): RichThemeColor|undefined { return undefined; /* super.color;*/}
  override set color(value: RichThemeColor|undefined) {
    if (this.nav.isTab()) {
      this.defaultColor = value;
    } else {
      super.color = value;
    }
  }

  constructor() {
    super();
    this.role = this.nav.isTab() ? "presentation" : "listitem";
  }

  protected generateId(): string {
    // Used as a track id in the @for() loop
    return `cute-nav-item-${nextId++}`;
  }

  override ngOnInit() {
    super.ngOnInit();

    const contentTemplate = (this._navContent && this._navContent.template) || this._staticContentTemplate;
    if (contentTemplate) {
      this._contentPortal = new TemplatePortal(contentTemplate, this._viewContainerRef);
    }
  }

}
