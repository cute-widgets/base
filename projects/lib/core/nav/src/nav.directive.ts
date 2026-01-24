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
  ContentChildren, DestroyRef,
  Directive, EventEmitter,
  HostBinding, inject,
  InjectionToken,
  Input, numberAttribute, Output,
  QueryList,
} from "@angular/core";
import {FocusKeyManager, FocusOrigin, ListKeyManager} from "@angular/cdk/a11y";
import {Directionality} from "@angular/cdk/bidi";
import {takeUntilDestroyed} from "@angular/core/rxjs-interop";
import {CuteLayoutControl} from "@cute-widgets/base/abstract";
import {ContentAlignment, LayoutOrientation} from "@cute-widgets/base/core";
import {CuteNavLink} from "./nav-link.directive";
import {CuteNavItem} from "./nav-item.component";

/** Navigation's presentation style */
export type CuteNavStyle = "base" | "tabs" | "pills" | "underline";
/** Stretching level */
export type CuteNavStretch = "none"|"fill"|"justified";

/**
 * Token used to provide a `CuteNav` to `CuteNavItem` or `CuteNavLink`.
 * Used to avoid circular imports between `CuteNav` and `CuteNavItem`.
 */
export const CUTE_NAV = new InjectionToken<CuteNav>('CUTE_NAV');

/** Event emitted when the `nav-link` selection has changed. */
export class CuteNavChangeEvent extends Event {
  constructor(
    /** Index of the currently-selected link item. */
    readonly index: number,
    /** Reference to the currently-selected link item. */
    readonly link: CuteNavLink,
    /** Index of the previously-selected link item. */
    readonly fromIndex: number|null,
    /** Reference to the currently-selected link item. */
    readonly fromLink: CuteNavLink | null,
    /** How the link was focused. */
    readonly origin: FocusOrigin,
  ) {
    super("navChange");
  }
}

/** Cancelable event emitted when the current `nav-link` selection is about to change. */
export class CuteNavChangingEvent extends Event {
  constructor(
    /** Index of the currently-selected link item. */
    readonly index: number,
    /** Reference to the currently-selected link item. */
    readonly link: CuteNavLink,
    /** Index of the previously-selected link item. */
    readonly fromIndex: number|null,
    /** Reference to the currently-selected link item. */
    readonly fromLink: CuteNavLink | null,
    /** How the link was focused. */
    readonly origin: FocusOrigin,
  ) {
    super("navChanging", {cancelable: true});
  }
}

let nextId: number = -1;

/**
 * The navigation component that is built with `flexbox` and provide a strong foundation for building other types of navigation components.
 * It includes some style overrides (for working with lists), some _link_ padding for larger hit areas, and basic _disabled_ styling.
 * @example
 * ```html
 * <nav cute-nav alignment="center">
 *   <a cute-nav-link active href="#">Active</a>
 *   <a cute-nav-link href="#">Link</a>
 *   <a cute-nav-link href="#">Link</a>
 *   <a cute-nav-link disabled>Disabled</a>
 * </nav>
 * ```
 */
@Directive({
  selector: '[cute-nav], [cuteNav]',
  exportAs: 'cuteNav',
  host: {
    'class': 'cute-nav nav',
    '[class.nav-tabs]': 'isTab()',
    '[class.nav-pills]': 'navStyle=="pills"',
    '[class.nav-underline]': 'navStyle=="underline"',
    '[class.nav-fill]': 'stretchItems=="fill"',
    '[class.nav-justified]': 'stretchItems=="justified"',
    '[attr.aria-orientation]': 'orientation',
    '[attr.role]': 'role || null',
    '(keydown)': 'onKeydown($event)',
  },
  providers: [{provide: CUTE_NAV, useExisting: CuteNav}],
  standalone: true,
})
export class CuteNav extends CuteLayoutControl  {

  protected _dir = inject(Directionality);
  protected _keyManager: ListKeyManager<CuteNavLink> | undefined;

  private _oldFocusLink: CuteNavLink | null = null;
  /** To synchronize selectedIndex and keyManager.activeIndex */
  private _selectedIndexToChange: number | null = null;

  @ContentChildren(CuteNavItem, {descendants: true})
  readonly navItems: QueryList<CuteNavItem> | undefined;

  @ContentChildren(CuteNavLink, {descendants: true})
  protected navLinks: QueryList<CuteNavLink> | undefined;

  /** The type of the navigation component */
  @Input("cuteNav") navStyle: CuteNavStyle = "base";

  /** Orientation of the navigation items */
  @Input()
  get orientation(): LayoutOrientation {return this._orientation;}
  set orientation(value: LayoutOrientation) {
    if (value !== this._orientation) {
      this._orientation = value;
      if (this._keyManager) {
        if (value == "horizontal") {
          this._keyManager.withHorizontalOrientation(this._dir.value);
        } else {
          this._keyManager.withVerticalOrientation(true).withPageUpDown();
        }
        this.markForCheck();
      }
    }
  }
  private _orientation: LayoutOrientation = "horizontal";

  /** The alignment of navigation items on the main flexbox' axis */
  @Input() alignment: ContentAlignment = "start";

  /**
   * Determines how the `cute-nav`'s content is stretched, such as taking up the entire available width (**none**), proportionally (**fill**) or equally (**justified**).
   * The width is determined by the longest `cute-nav-link`'s label. By default, stretching of items is not used (**none**).
   */
  @Input() stretchItems: CuteNavStretch = "none";

  /**
   * By default, tabs remove their content from the DOM while it's off-screen. Setting this to _true_ will keep it in
   * the DOM which will prevent elements like `iframes` and `videos` from reloading next time it comes back into the view.
   */
  @Input({transform: booleanAttribute})
  preserveTabContent: boolean = false;

  /** @deprecated */
  @Input({transform: booleanAttribute})
  animation: boolean = true;

  /** Should the first not disabled link item be automatically selected if none were activated during initialization. */
  @Input({transform: booleanAttribute})
  autoSelect: boolean = false;

  /** The index of the active link item. */
  @Input({transform: numberAttribute})
  get selectedIndex(): number|null {return this._selectedIndex;}
  set selectedIndex(value: number) {
    if (value !== this._selectedIndex) {
      this._selectedIndexToChange = value;
      Promise.resolve().then(() => this.activateNavLink(value));
    }
  }
  private _selectedIndex: number | null = null;

  /** Output to enable support for two-way binding on `[(selectedIndex)]` */
  @Output() selectedIndexChange = new EventEmitter<number>();

  /** Event emitted when the `nav` selection has changed. */
  @Output() selectedLinkChange = new EventEmitter<CuteNavChangeEvent>();

  /** Event emitted when the `nav` selection gets changing. */
  @Output() selectedLinkChanging = new EventEmitter<CuteNavChangeEvent>();

  /** Event emitted when focus has changed within a `nav`-element. */
  @Output() focusChange = new EventEmitter<CuteNavChangeEvent>();

  @HostBinding("class")
  get classBinding(): string {
    let classList = "justify-content-"+this.alignment;
    switch (this.orientation) {
      case "vertical":
        if (this.breakpoint) {
          classList += " flex-"+this.breakpoint+"-column";
        } else {
          classList += " flex-column";
        }
        break;
      case "horizontal":
        if (this.breakpoint) {
          // Nav will be stacked on the lowest breakpoint, then adapt to a horizontal layout that fills the available width starting
          // from the small breakpoint.
          classList += " flex-column flex-"+this.breakpoint+"-row";
        }
        break;
    }
    return classList;
  }

  constructor() {
    super();
  }

  protected generateId(): string {
    return `cute-nav-${++nextId}`;
  }

  /** Whether the navigation component has a `tab` presentation style. */
  isTab(): boolean {
    return this.navStyle == "tabs";
  }

  /**
   * Gets an index of the navigation link in the links array.
   * @param link Navigation link reference
   * @returns An index of the navigation link or **-1** if it was not found
   */
  getNavLinkIndex(link: CuteNavLink): number {
    return this.navLinks?.toArray().indexOf(link) ?? -1;
  }

  /**
   * Request to activate cute-nav-link element
   * @param linkToActivate `cute-nav-link` or its index in the links array to activate. Set _null_ for use the currently selected or first `cute-nav-link` in the list.
   * @param origin (optional) Tells how the element was focused (via the mouse, keyboard, touch, or programmatically). The latter is the default value.
   * @returns _true_ when succeeded, otherwise _false_.
   */
  activateNavLink(linkToActivate: CuteNavLink|number|null, origin: FocusOrigin = "program"): boolean {
    if (linkToActivate == null) {
      if (this.selectedIndex != null) {
        linkToActivate = this.selectedIndex;
      } else if (this.navLinks) {
        const firstEnabled = this.navLinks.find(link => !link.disabled);
        if (firstEnabled) {
          linkToActivate = firstEnabled;
        } else {
          return false;
        }
      } else {
        return false;
      }
    }

    if (!this.navLinks || this.navLinks.length == 0) { return false; }

    if (typeof linkToActivate === "number") {
        const linkIndex = linkToActivate;
        linkToActivate = this.navLinks.get(linkIndex) ?? null;
    }

    if (!linkToActivate) { return false; }

    const navLink = <CuteNavLink> linkToActivate;
    const newIndex = this.getNavLinkIndex(navLink);

    if (this.selectedIndex == newIndex) {
      // The link has already been activated
      this._keyManager?.updateActiveItem(newIndex);
      return true;
    }

    if (newIndex >= 0 && !navLink.disabled) {
      const oldIndex = this._selectedIndex;
      const oldLink = oldIndex != null ? this.navLinks.get(oldIndex)??null : null

      if (oldLink) {
        // Check before index changing condition
        const event = new CuteNavChangingEvent(newIndex, navLink, oldIndex, oldLink, origin);
        this.selectedLinkChanging.emit( event );
        if (event.defaultPrevented) {
          return false;
        }
      }

      this._keyManager?.updateActiveItem(newIndex);

      this.navLinks.forEach(link => {
        link.active = false;
      });

      navLink.active = true;
      this._selectedIndexToChange = null;
      this._selectedIndex = newIndex;

      this._focusChanged(newIndex, "program");
      this.selectedIndexChange.emit(newIndex);
      this.selectedLinkChange.emit( new CuteNavChangeEvent(newIndex, navLink, oldIndex, oldLink, origin) );

      this.markForCheck();

      return true;
    }
    return false;
  }

  /**
   * Link focus changed handler
   * @param link Source link
   * @param origin Focus origin
   */
  _focusChanged(link: CuteNavLink|number, origin: FocusOrigin): void {
    let linkIndex: number;
    if (typeof link === "number") {
      if (this.isValidLinkIndex(link)) {
        linkIndex = link;
        link = this.navLinks!.get(linkIndex)!;
      } else {
        // Error
        return;
      }
    } else {
      linkIndex = this.getNavLinkIndex(link);
    }
    if (origin && this._oldFocusLink !== link) {
      const oldIndex = this._oldFocusLink ? this.getNavLinkIndex(this._oldFocusLink) : null;
      this.focusChange.emit( new CuteNavChangeEvent(linkIndex, link, oldIndex, this._oldFocusLink, origin) );
      this._oldFocusLink = link;
    }
  }

  /** Whether the specified link index is a valid nav index. */
  protected isValidLinkIndex(index: number): boolean {
    return this.navLinks != null && (index >= 0 && index < this.navLinks.length);
  }

  protected onKeydown(event: KeyboardEvent) {
    if (event.code == "Space" || event.code == "Enter") {
      if (this._keyManager
          && this._keyManager.activeItemIndex != null
          && this.selectedIndex != this._keyManager.activeItemIndex)
      {
        this.activateNavLink(this._keyManager.activeItemIndex, "keyboard");
      }
      event.preventDefault();
    } else {
      this._keyManager?.onKeydown(event);
    }
  }

  override ngOnInit() {
    super.ngOnInit();

    const tagName = this._elementRef.nativeElement.tagName;

    if (this.isTab() && !this.role && !(tagName.toLowerCase()==="nav")) {
      this.role = "tablist";
    }
  }

  override ngAfterContentInit() {
    super.ngAfterContentInit();

    if (this.navLinks) {
      this._keyManager = new FocusKeyManager(this.navLinks)
          .withWrap(true)
          .withHomeAndEnd(true)
          // Allow focus to land on disabled tabs, as per https://w3c.github.io/aria-practices/#kbd_disabled_controls
          .skipPredicate(() => false);

      if (this.orientation == "horizontal") {
        this._keyManager.withHorizontalOrientation(this._dir.value);
      } else {
        this._keyManager.withVerticalOrientation(true).withPageUpDown(true);
      }
      // Immediate activation on focus changing
      this._keyManager.change
          .pipe(takeUntilDestroyed(this._destroyRef))
          .subscribe(newIndex => {
            this._focusChanged(newIndex, "keyboard");
          });

      this._keyManager.tabOut
          .pipe(takeUntilDestroyed(this._destroyRef))
          .subscribe(() => {
            if (this.selectedIndex != null) {
              this._keyManager?.updateActiveItem(this.selectedIndex)
            }
          });

      if (this._selectedIndexToChange == null && this.autoSelect) {
        Promise.resolve().then(()=> this.activateNavLink(null));
      }
    }
  }

  override ngAfterViewInit() {
    super.ngAfterViewInit();
  }

  override ngOnDestroy() {
    super.ngOnDestroy();

    this._keyManager?.destroy();
  }

}

