/**
 * @license Apache-2.0
 *
 * Copyright (c) 2025 CuteWidgets Team. All Rights Reserved.
 *
 * You may not use this file except in compliance with the License
 * that can be found at http://www.apache.org/licenses/LICENSE-2.0
 */
import {booleanAttribute, Directive, inject, Input, NgZone, DOCUMENT} from "@angular/core";
import {takeUntilDestroyed} from "@angular/core/rxjs-interop";
import {CuteFocusableControl} from "@cute-widgets/base/abstract";
import {toThemeColor} from '@cute-widgets/base/core';
import {CUTE_NAV} from "./nav.directive";
import {fromEvent} from "rxjs";

let nextId: number = -1;

/**
 * This class can be used to create a navigation menu, where it is applied to `<a>` elements.
 */
@Directive({
  selector: `a[cute-nav-link], a[cuteNavLink],
             button[cute-nav-link], button[cuteNavLink]
  `,
  exportAs: 'cuteNavLink',
  host: {
    'class': 'cute-nav-link nav-link',
    //'[class]': 'color ? "link-"+toThemeColor(color) : undefined',
    '[class.active]': 'active',
    '[class.disabled]': 'disabled',
    '[attr.disabled]': '_isAnchor && disabled ? true : null',
    '[attr.aria-disabled]': 'disabled',
    '[attr.aria-current]': 'active ? "page" : null',
    '[attr.aria-selected]': 'active || null',
    '[aria-controls]': 'ariaControls || getAriaControls()',
    '[attr.id]': 'id || null',
    '[attr.role]': 'role || null',
    '[attr.tabindex]': 'active && !disabled ? 0 : -1',
    '[style.--bs-btn-border-radius]': '0',          // bootstrap's tab-link already stylized with radius of top angles
    '[style.--bs-navbar-active-color]': 'nav && !nav.isTab() ? "var("+(color ? "--bs-"+toThemeColor(color)+"-text-emphasis" : "--bs-emphasis-color")+")" : undefined',
    '(click)': 'onClick($event)',
    //'(touchstart)': 'onTouchStart($event)',
  },
  standalone: true,
})
export class CuteNavLink extends CuteFocusableControl {
  protected _document = inject(DOCUMENT);
  protected _ngZone = inject(NgZone);
  protected readonly nav = inject(CUTE_NAV, {optional: true});

  protected _isAnchor: boolean = false;
  protected toThemeColor = toThemeColor;

  /** Whether the link is active. */
  @Input({transform: booleanAttribute})
  active: boolean = false;

  /** Explicit element identifier(s) whose content or presence are controlled by the link */
  @Input("aria-controls")
  ariaControls: string | undefined;

  constructor() {
    super();

    this._isAnchor = (this._nativeElement.tagName == "A");

    this._focusMonitor.monitor(this._elementRef)
      .pipe(takeUntilDestroyed())
      .subscribe(origin => {
        this._ngZone.run(() => {
          if (this.nav) {
            this.nav._focusChanged(this, origin);
          }
        });
    });

    // MouseDown event
    fromEvent<MouseEvent>(this._nativeElement, "mousedown", {capture: true})
      .pipe(takeUntilDestroyed())
      .subscribe((event) => this.onMouseDown(event));
  }

  protected generateId(): string {
    return `cute-nav-link-${++nextId}`;
  }

  /** Gets fallback element identifier(s) whose content or presence are controlled by the link. */
  protected getAriaControls(): string {
    if ( !(this.nav && this.nav.isTab()) ) return "";
    const index = this.nav.getNavLinkIndex(this);
    let ids: string = "";
    if (index >= 0) {
      ids = `${this.nav.id}-pane-${index}`;
    }
    return ids;
  }

  /**
   * MouseDown event handler in `capture` state of the event propagation.
   * @param event MouseEvent
   * @protected
   */
  protected onMouseDown(event: MouseEvent): void {
    if (this.nav) {
      if (!this.nav.activateNavLink(this, 'mouse')) {
        // we need to prevent default action so CSS-styles may be applied incorrectly
        event.stopImmediatePropagation();
        event.preventDefault();
      }
    }
  }

  protected onClick(event: Event): void {
    const elem = event.target as HTMLElement;
    event.preventDefault();
    if (elem instanceof HTMLAnchorElement && elem.hash && elem.hash.startsWith("#")) {
      event.stopPropagation();
      const target = this._document.getElementById(elem.hash.substring(1));
      if (target) {
        target.scrollIntoView({behavior: "smooth", block: "nearest"});
      }
    }
  }

  protected onTouchStart(event: TouchEvent): void {
    if (this.nav) {
      this.nav.activateNavLink(this, 'touch');
      event.preventDefault();
    }
  }

  override ngOnInit() {
    super.ngOnInit();
    if (this.nav?.role == "tablist") {
      this.role = "tab";
    }
  }
}
