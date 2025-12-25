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
  Component,
  Input,
  TemplateRef,
  SimpleChanges,
  ChangeDetectionStrategy,
  ViewEncapsulation,
  InjectionToken,
  signal,
  ContentChild,
  booleanAttribute,
  inject,
} from '@angular/core';
import { animate, state, style, transition, trigger } from '@angular/animations';
import {NgTemplateOutlet} from "@angular/common";
import {CuteTabLabel} from "./tab-label.directive";
import {CuteTabContent} from "./tab-content.directive";
import {CuteFocusableControl} from "@cute-widgets/base/abstract";
import {Subject} from "rxjs";
import {takeUntilDestroyed} from "@angular/core/rxjs-interop";
import {CUTE_TAB_GROUP} from "./tab-group.component";
import {CuteNavLink} from "@cute-widgets/base/core/nav";

/**
 * Used to provide a tab label to a tab without causing a circular dependency.
 * @docs-private
 */
export const CUTE_TAB = new InjectionToken<CuteTab>('CUTE_TAB');

let nextId: number = 0;

@Component({
  selector: 'cute-tab',
  templateUrl: './tab.component.html',
  styleUrls: ['./tab.component.scss'],
  animations: [
    trigger('contentFade', [
      state('in', style({ opacity: 1, height: '*'})),
      state('out', style({ opacity: 0, height: '0px'})),
      transition('in <=> out', animate('150ms linear'))
    ])
  ],
  host: {
    "class": "cute-tab tab-pane",
    "[class.show]": "active",
    "[class.active]": "active",
//    "[class.d-none]": "!active",
    '[attr.tabindex]': 'active && !disabled ? 0 : -1',
    '[attr.aria-labelledby]': 'ariaLabelledby || null',
    '[attr.id]': 'id || null',
    "role": "tabpanel",
    "[@contentFade]": "active ? 'in' : 'out'"
  },
  imports: [
    NgTemplateOutlet,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class CuteTab extends CuteFocusableControl {

  protected _tabGroup = inject(CUTE_TAB_GROUP, {optional: true});
  private _intersectionRatio: number = NaN;

  /** Plain text label for the tab, used when there is no template label. */
  @Input("label") textLabel: string = "";

  //@Input() titleTemplate: TemplateRef<any> | undefined;

  /** Explicit reference to the external content template. */
  @Input() contentTemplate: TemplateRef<any> | undefined;

  /** Lazy loading label's outlet context */
  @Input() labelContext: any = {};

  /** Lazy loading content's outlet context */
  @Input() contentContext: any = {};

  /** Whether the tab is closable. */
  @Input({transform: booleanAttribute}) closable = false;

  /** Whether the tab preserves lazing content */
  @Input({ transform: booleanAttribute })
  preserveContent: boolean | undefined;

  /** Content for the tab label given by `<ng-template cute-tab-label>`. */
  @ContentChild(CuteTabLabel, {read: TemplateRef, static: true})
  public readonly _templateLabel: TemplateRef<any>|undefined;

  /**
   * Template provided in the tab content by <ng-template cute-tab-content>, used to enable lazy-loading
   */
  @ContentChild(CuteTabContent, {read: TemplateRef, static: true})
  private _explicitContent: TemplateRef<any> | undefined;

  /** Reference to `<cute-nav-link>` element. */
  @ContentChild(CuteNavLink, {descendants: true})
  readonly link: CuteNavLink | undefined;

  /** Whether the tab is currently active. */
  get active(): boolean {return this._active;}
  set active(value: boolean) {
    if (value !== this._active) {
      this._active = value;
      this._stateChanges.next();
    }
  }
  private _active: boolean = false;

  /** Whether the tab is intersected the containing box and needs to scroll to display its full size */
  get scrollNeeded(): boolean {
    return this._intersectionRatio < 1;
  }

  /** Whether the tab was added dynamically */
  public isDynamic: boolean = false;

  protected isPreserveContent(): boolean {
    return this.preserveContent ?? this._tabGroup?.preserveContent ?? false;
  }

  /** Tab content defined by <ng-template cute-tab-content> or directly referenced where the latter has more priority. */
  protected get explicitContent(): TemplateRef<any> | undefined {
    return this.contentTemplate || this._explicitContent;
  }

  /** Emits whenever the internal state of the tab changes. */
  readonly _stateChanges = new Subject<void>();

  /** Whether the tab content was loaded */
  loaded = signal<boolean>(false);

  /** Template inside the CuteTab view that contains an `<ng-content>`. */
  // @ViewChild(TemplateRef, {static: true}) _implicitContent: TemplateRef<any> | undefined;

  constructor() {
    super();
    this._stateChanges.pipe(takeUntilDestroyed()).subscribe(()=> {
      this.markForCheck();
    });
  }

  protected override generateId(): string {
    return `cute-tab-${nextId++}`;
  }

  /** Gets the content template's context object */
  getContentContext(): any {
    return {...this.contentContext,
      $implicit: this,
      index: this._tabGroup?.getTabIndex(this),
      active: this.active,
      tab: this
    };
  }

  /**
   * Removes this tab from the tab group.
   */
  async remove() {
    if (this._tabGroup) {
      const index = this._tabGroup.getTabIndex(this);
      if (index != null) {
        return this._tabGroup.removeTab( index );
      }
    }
    return;
  }

  _visibilityChanged(entries: IntersectionObserverEntry[]) {
    if (entries.length) {
      this._intersectionRatio = entries[0].intersectionRatio;
    }
  }

  override ngOnInit() {
    super.ngOnInit();

    this.ariaLabelledby = this.id+"-link";
  }

  override ngOnChanges(changes: SimpleChanges) {
    super.ngOnChanges(changes);
    if (changes['textLabel'] || changes['disabled'] || changes['closable']) {
      this._stateChanges.next();
    }
    if (changes["active"] && changes["active"].currentValue) {
      this.loaded.set(true);
    }
  }

  override ngOnDestroy() {
    super.ngOnDestroy();
    this._stateChanges.complete();
  }
}
