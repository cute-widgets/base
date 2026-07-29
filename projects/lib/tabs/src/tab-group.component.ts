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
  booleanAttribute,
  ChangeDetectionStrategy,
  Component,
  ComponentRef,
  ContentChildren,
  DestroyRef,
  ElementRef,
  EventEmitter,
  inject,
  InjectionToken, Injector,
  Input,
  numberAttribute,
  Output,
  QueryList,
  TemplateRef,
  ViewChild,
  ViewChildren,
  ViewContainerRef,
  ViewEncapsulation
} from '@angular/core';
import {CuteTab} from './tab.component';
import {CdkDrag, CdkDragDrop, CdkDropList, moveItemInArray} from '@angular/cdk/drag-drop';
import {NgTemplateOutlet} from "@angular/common";
import {CuteLayoutControl} from "@cute-widgets/base/abstract";
import {
  CuteNavChangeEvent,
  CuteNavChangingEvent,
  CuteNavLink,
  CuteNavModule,
  CuteNavStretch
} from "@cute-widgets/base/core/nav";
import {FocusOrigin} from "@angular/cdk/a11y";
import {ContentAlignment, Scheduler, ViewportEdge} from "@cute-widgets/base/core";
import {CuteButtonModule} from "@cute-widgets/base/button";
import {debounceTime, fromEvent} from "rxjs";
import {takeUntilDestroyed} from "@angular/core/rxjs-interop";
import {CuteObserveVisibility} from "@cute-widgets/base/core/observers";
import {CUTE_TABS_CONFIG, CuteTabsConfig} from "./tab-config";
import {CuteTabBodyWrapper} from './tab-body-wrapper.directive';

let nextId: number = 0;

/**
 * Used to provide a tab group to a tab without causing a circular dependency.
 */
export const CUTE_TAB_GROUP = new InjectionToken<CuteTabGroup>('CUTE_TAB_GROUP');

/** Cancelable event emitted when the `cute-tab` selection is about to change. */
export class CuteTabChangingEvent extends Event {
  constructor(
    /** Index of the currently-selected tab. */
    readonly index : number,
    /** Reference to the currently-selected tab. */
    readonly tab: CuteTab,
    /** Index of the previously-selected tab. */
    readonly fromIndex: number | null,
    /** Reference to the previously-selected tab. */
    readonly fromTab: CuteTab | null,
    /** How the tab was focused. */
    readonly origin: FocusOrigin,
  ) {
    super("tabChanging", {cancelable: true});
  }
}

/** A simple change event emitted on focus or selection changes. */
export class CuteTabChangeEvent extends Event {
  constructor(
    /** Index of the currently-selected tab. */
    readonly index : number,
    /** Reference to the currently-selected tab. */
    readonly tab: CuteTab,
    /** Index of the previously-selected tab. */
    readonly fromIndex: number | null,
    /** Reference to the previously-selected tab. */
    readonly fromTab: CuteTab | null,
    /** How the tab was focused. */
    readonly origin: FocusOrigin,
  ) {
    super("tabChange");
  }
}

/**
 * A flexible, feature-rich tab component for Angular applications with Bootstrap integration.
 */
@Component({
  selector: 'cute-tab-group',
  templateUrl: './tab-group.component.html',
  styleUrls: ['./tab-group.component.scss'],
  exportAs: "cuteTabGroup",
  host: {
    "class": "cute-tab-group",
    "[class.tabs-top]": "headerPosition === 'top'",
    "[class.tabs-bottom]": "headerPosition === 'bottom'",
    "[class.tabs-left]": "headerPosition === 'left'",
    "[class.tabs-right]": "headerPosition === 'right'",
    "[class.tabs-end]": "headerPosition === 'end'",
    "[class.tabs-start]": "headerPosition === 'start'",
    '[class.cute-tab-group-dynamic-height]': 'dynamicHeight',
    "[attr.cute-align-tabs]": "alignTabs",
    "[style.--cute-tab-animation-duration]": "animationDuration",
  },
  imports: [
    CdkDropList,
    CdkDrag,
    NgTemplateOutlet,
    CuteNavModule,
    CuteButtonModule,
    CuteObserveVisibility,
    CuteTabBodyWrapper,
  ],
  providers: [
      {provide: CUTE_TAB_GROUP, useExisting: CuteTabGroup},
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class CuteTabGroup extends CuteLayoutControl {
  private _indexToChange: number | null = null;
  private _scrollDebounce: number | undefined;
  private _resizeObserver: ResizeObserver | undefined;

  protected showScrollButtons = false;
  protected canScrollLeft = false;
  protected canScrollRight = false;
  /** Number of pixels to scroll left or right */
  protected scrollAmount: number = 200;
  protected dynamicTabs: ComponentRef<CuteTab>[] = [];

  protected destroyRef = inject(DestroyRef);
  protected injector = inject(Injector);

  @ContentChildren(CuteTab)
  protected tabs: QueryList<CuteTab> | undefined;

  @ViewChildren('tabLink', {read: CuteNavLink})
  protected tabLinks: QueryList<CuteNavLink> | undefined;

  @ViewChild('dynamicTabs', {read: ViewContainerRef, static: true})
  protected dynamicTabsContainer: ViewContainerRef | undefined;

  @ViewChild('headerContainer', {static: true})
  headerContainer!: ElementRef<HTMLElement>;

  @ViewChild('headerScroll', {static: true})
  headerScroll!: ElementRef<HTMLElement>;

  /** The index of the active tab. */
  @Input({transform: numberAttribute})
  get selectedIndex(): number|null {return this._selectedIndex;}
  set selectedIndex(value: number) {
    if (value !== this._selectedIndex) {
      this._indexToChange = value;
      Promise.resolve().then(()=> this.selectTab(value));
    }
  }
  private _selectedIndex: number|null = null;

  /**
   *  Alignment for tabs.
   *  @default start
   */
  @Input({ alias: 'cute-align-tabs' })
  alignTabs: ContentAlignment = "start";

  /**
   * The style a `cute-tab`’s content extends the full available width, proportionately (**fill**) or equal-width (**justified**).
   * The width is determined by the longest `cute-tab-label`'s content. By default, stretching of items is not used (**none**).
   */
  @Input({alias: 'cute-stretch-tabs'})
  get stretchTabs(): CuteNavStretch|undefined { return this._stretchTabs; }
  set stretchTabs(value: CuteNavStretch|boolean|"false"|"true"|undefined) {
    if (typeof value==="boolean" || value==="true" || value==="false") {
      this._stretchTabs = Boolean(value) ? "justified" : undefined;
    } else {
      this._stretchTabs = value;
    }
  }
  private _stretchTabs: CuteNavStretch | undefined;

  /** Duration for the tab animation. Will be normalized to milliseconds if no units are set. */
  @Input()
  get animationDuration(): string { return this._animationDuration; }
  set animationDuration(value: string | number) {
    const stringValue = value + '';
    this._animationDuration = /^\d+$/.test(stringValue) ? value + 'ms' : stringValue;
  }
  private _animationDuration: string = "";

  /**
   * By default, tabs remove their lazy content from the DOM while it's off-screen. Setting this to _true_ will keep it in the DOM,
   * which will prevent elements like `iframe` and `video` from reloading next time it comes back into the view.
   */
  @Input({ transform: booleanAttribute })
  preserveContent: boolean | undefined;

  /** Whether the tab group will change its height to the height of the currently active tab. */
  @Input({transform: booleanAttribute})
  dynamicHeight: boolean = false;

  /**
   * Possible position for the tab header.
   * @default top
   */
  @Input()
  get headerPosition(): ViewportEdge {return this._headerPosition;}
  set headerPosition(newPosition: ViewportEdge) {
    if (newPosition !== this._headerPosition) {
      this._headerPosition = newPosition;
      Promise.resolve().then(() => this.scrollToTab());
      this.headerPositionChange.emit(newPosition);
    }
  }
  private _headerPosition: ViewportEdge = 'top';

  /** Use `underline` style for horizontal tabs. */
  @Input({transform: booleanAttribute})
  underlineTabs: boolean = false;

  /**
   * Whether tabs can be draggable.
   * @default false
   */
  @Input({transform: booleanAttribute})
  dragEnabled = false;

  /**
   * Defines the horizontal alignment when scrolling the tabs.
   * @default center
   */
  @Input()
  tabScrollingAlignment: ScrollLogicalPosition = "center";

  /** Output to enable support for two-way binding on `[(selectedIndex)]` */
  @Output() selectedIndexChange = new EventEmitter<number>();

  /** Event emitted when the active tab selection is about to change. */
  @Output() selectedTabChanging = new EventEmitter<CuteTabChangingEvent>();

  /** Event emitted when the tab selection has been changed. */
  @Output() selectedTabChange = new EventEmitter<CuteTabChangeEvent>();

  /** Event emitted when focus has changed within a tab group. */
  @Output() focusChange = new EventEmitter<CuteTabChangeEvent>();

  /** Event emitted when the position of tabs header has been changed. */
  @Output() headerPositionChange = new EventEmitter<ViewportEdge>();

  /** Event emitted after the new tab was added. */
  @Output() tabAdded = new EventEmitter<void>();

  /** Event emitted after the closable tab was removed. */
  @Output() tabRemoved = new EventEmitter<number>();

  constructor() {
    super();

    const defaultConfig = inject<CuteTabsConfig>(CUTE_TABS_CONFIG, {optional: true});
    if (defaultConfig) {
      //this._groupId = inject(_IdGenerator).getId('mat-tab-group-');
      this.animationDuration = defaultConfig.animationDuration ? defaultConfig.animationDuration : '500ms';
      // this.disablePagination =
      //   defaultConfig.disablePagination != null
      //     ? defaultConfig.disablePagination
      //     : false;
      this.dynamicHeight = defaultConfig.dynamicHeight ?? false;
      // if (defaultConfig.contentTabIndex != null) {
      //   this.contentTabIndex = defaultConfig.contentTabIndex;
      // }
      this.preserveContent = !!defaultConfig.preserveContent;
      // this.fitInkBarToContent =
      //   defaultConfig.fitInkBarToContent != null
      //     ? defaultConfig.fitInkBarToContent
      //     : false;
      this.stretchTabs = defaultConfig.stretchTabs ?? true;
      this.alignTabs = defaultConfig.alignTabs ?? 'start';
    }

  }

  /** Whether the tab group currently has a horizontal layout */
  get isHorizontal(): boolean {
    return this.headerPosition === 'top' || this.headerPosition === 'bottom';
  }

  /** The active tab. */
  get selectedTab(): CuteTab | undefined {
    return this.tabs?.get(this.selectedIndex ?? NaN);
  }

  /** The number of tabs in the tab group. */
  get tabCount(): number {
    return this.tabs?.length || 0;
  }

  /**
   * Returns the first element in the array of tabs that satisfies the provided testing function.
   * Otherwise, _undefined_ is returned.
   * @param predicate Testing function
   * @returns `CuteTab` object or _undefined_ if there are no tabs with the specified condition.
   */
  findTab(predicate: (tab: CuteTab, index: number) => boolean): CuteTab | undefined {
    return this.tabs?.find(predicate);
  }

  protected override generateId(): string {
    return `cute-tab-group-${nextId++}`;
  }

  /** Clamps the given index to the bounds of 0 and the tabs' length. */
  private _clampTabIndex(index: number | null): number {
    // Note the `|| 0`, which ensures that values like NaN can't get through
    // and which would otherwise throw the component into an infinite loop
    // (since Math.max(NaN, 0) === NaN).
    return Math.min(this.tabCount - 1, Math.max(index || 0, 0));
  }

  private checkScrollButtons() {
    this.showScrollButtons = false;
    if (this.headerPosition === 'top' || this.headerPosition === 'bottom') {
      const el = this.headerScroll.nativeElement;
      this.showScrollButtons = el.scrollWidth > el.clientWidth;
      this.canScrollLeft = el.scrollLeft > 0;
      this.canScrollRight = el.scrollLeft < el.scrollWidth - el.clientWidth - 1;
      //this._changeDetectorRef.detectChanges();
      this.markForCheck();
    }
  }

  private setupScrollListener() {
    fromEvent(this.headerScroll.nativeElement, 'scroll')
      .pipe(debounceTime(100), takeUntilDestroyed(this.destroyRef))
      .subscribe(() => this.checkScrollButtons());

    this._resizeObserver = new ResizeObserver(() => {
      this.checkScrollButtons();
      //setTimeout(()=>this.scrollToTab( this.selectedIndex ));
    });
    this._resizeObserver.observe(this.headerContainer.nativeElement);
  }

  protected scrollHeader(direction: number) {
    const el = this.headerScroll.nativeElement;

    clearTimeout(this._scrollDebounce);
    el.scrollBy({
      left: direction * this.scrollAmount,
      behavior: 'smooth'
    });

    this._scrollDebounce = setTimeout(() => {
      this.checkScrollButtons();
    }, 300);
  }

  /**
   * Activates tab with the specified index.
   * @param index Tab index.
   * @param origin (optional) Focus origin.
   * @returns A promise of a "logical" result, where _true_ means a successful change of the active tab, and _false_ otherwise.
   * @async
   */
  async selectTab(index: number, origin: FocusOrigin="program"): Promise<boolean> {
    if (!this.tabs) return false;
    if (index < 0 || index >= this.tabs.length) return false;
    if (index === this.selectedIndex) return true;
    const tabsArray = this.tabs.toArray();
    if (tabsArray[index].disabled) return false;

    this._indexToChange = null;
    this._selectedIndex = index;

    this.tabs.forEach((tab, i) => {
      //tab.active = (i === index);
      tab.active = false;
    });

    await Scheduler.postTask(() => {
      if (tabsArray[index].scrollNeeded) {
        this.scrollToTab(index);
      }
    }, {delay: 100});

    tabsArray[index].active = true;
    this.selectedIndexChange.emit(index);
    //this.tabLinks?.get(index)?.focus();

    this.markForCheck();

    return true;
  }

  private _createChangeEvent(event: CuteNavChangeEvent): CuteTabChangeEvent {
    const tabsArray = this.tabs?.toArray() ?? [];
    return new CuteTabChangeEvent(event.index,
      tabsArray[event.index],
      event.fromIndex,
      event.fromIndex ? tabsArray[event.fromIndex] : null,
      event.origin
    );
  }

  private _createChangingEvent(event: CuteNavChangingEvent): CuteTabChangingEvent {
    const tabsArray = this.tabs?.toArray() ?? [];
    return new CuteTabChangeEvent(event.index,
      tabsArray[event.index],
      event.fromIndex,
      event.fromIndex ? tabsArray[event.fromIndex] : null,
      event.origin
    );
  }

  protected onNavFocusChange(event: CuteNavChangeEvent) {
    this.focusChange.emit( this._createChangeEvent(event) );
  }

  protected onNavLinkChange(event: CuteNavChangeEvent) {
    this.selectedTabChange.emit( this._createChangeEvent(event) );
  }

  protected onNavLinkChanging(event: CuteNavChangingEvent) {
    const ev = this._createChangingEvent(event);
    this.selectedTabChanging.emit( ev );
    if (ev.defaultPrevented) {
      event.preventDefault();
    }
  }

  protected getLabelContext(tab: CuteTab, index: number) {
    return {...tab.getContentContext(), index};
  }

  /** Gets the current index of the specified tab object. */
  getTabIndex(tab: CuteTab): number | undefined {
    return this.tabs?.toArray().indexOf(tab);
  }

  private scrollToTab(index?: number) {
    index = index ?? this.selectedIndex ?? undefined;
    if (index != null) {
      const tabElement = this.tabLinks?.toArray()[index]?.element.nativeElement;
      if (tabElement) {
        tabElement.scrollIntoView({
          behavior: 'smooth',
          block: 'nearest',
          inline: this.tabScrollingAlignment
        });
      }
    }
  }

  /** Drop event */
  protected onDrop(event: CdkDragDrop<CuteTab[]>): void {
    if (event.previousIndex === event.currentIndex) return;
    if (!this.tabs) return;

    const tabsArray = this.tabs.toArray();
    moveItemInArray(tabsArray, event.previousIndex, event.currentIndex);

    // Refresh QueryList
    this.tabs.reset(tabsArray);

    this._adjustActiveIndex(event.previousIndex, event.currentIndex);

    this.tabs.notifyOnChanges();
  }

  /** Sets a new active index after the dragging tabs */
  private _adjustActiveIndex(prevIndex: number, newIndex: number) {
    if (this.selectedIndex === prevIndex) {
      this.selectedIndex = newIndex;
    } else if (this.selectedIndex != null) {
      const min = Math.min(prevIndex, newIndex);
      const max = Math.max(prevIndex, newIndex);
      if (this.selectedIndex >= min && this.selectedIndex <= max) {
        this.selectedIndex += (prevIndex < newIndex ? -1 : 1);
      }
    }
  }

  /**
   * Adds a new tab to the end of `tab-group` dynamically.
   *
   * @param label Tab label
   * @param content Tab template reference
   * @param context (optional) Template context object
   * @param closable (optional) Whether the tab is closable. Default is _true_.
   * @returns `ComponentRef` object of the new Tab.
   */
  async addTab(label: string, content: TemplateRef<any>, context?: any, closable?: boolean): Promise<ComponentRef<CuteTab>> {
    const componentRef = this.dynamicTabsContainer!.createComponent(CuteTab);
    const newTab = componentRef.instance;
    newTab.textLabel = label || `Tab ${(this.tabs?.length??0) + 1}`;
    newTab.contentTemplate = content;
    newTab.contentContext = context;
    newTab.active = true; // !this.tabs || this.tabs.length === 0;
    newTab._isDynamic = true;
    //componentRef.setInput("closable", true);
    newTab.closable = closable ?? true;
    componentRef.changeDetectorRef.detectChanges();
    this.dynamicTabs.push(componentRef);

    const tabsArray = this.tabs?.toArray() || [];
    tabsArray.push(newTab);
    this.tabs?.reset( tabsArray );

    if (newTab.active) {
      const newIndex = tabsArray.length - 1;
      if (await this.selectTab(newIndex)) {
        this.scrollToTab(newIndex);
      }
    }

    this.tabAdded.emit();

    return componentRef;
  }

  /**
   * Removes the tab with specified index.
   * @param index Tab index
   */
  async removeTab(index: number) {
    if (!this.tabs) return;
    if (index < 0 || index >= this.tabs.length) return;

    const tab = this.tabs.get(index)!;
    const wasActive = tab.active;

    const dynIndex = this.dynamicTabs.findIndex(cref => cref.instance == tab);
    if (dynIndex >= 0) {
      this.dynamicTabsContainer?.remove(dynIndex);
      this.dynamicTabs.splice(dynIndex, 1);
    }

    const tabsArray = this.tabs.filter((_, i) => i !== index);
    this.tabs.reset( tabsArray );
    this.tabs.notifyOnChanges();

    this.tabRemoved.emit(index);

    if (this.tabs.length > 0) {
      let newIndex: number;
      if (wasActive) {
        newIndex = Math.min(index, this.tabs.length - 1);
      } else {
        newIndex = this.tabs.toArray().findIndex(t => t.active);
      }

      // To bypass verification
      this._selectedIndex = null;
      await this.selectTab(newIndex);
    }

    this.checkScrollButtons();

    //this.markForCheck();
  }

  override ngAfterContentInit() {
    super.ngAfterContentInit();
    if (this.tabs) {
      const tabsArray = this.tabs.toArray();
      if (this._indexToChange == null) {
        this._indexToChange = Math.max( tabsArray.findIndex(t => !t.disabled), 0);
      }
      this.selectedIndex = this._indexToChange;
    }
  }

  override ngAfterViewInit() {
    super.ngAfterViewInit();

    this.checkScrollButtons();
    this.setupScrollListener();
  }

  override ngOnDestroy() {
    super.ngOnDestroy();
    this._resizeObserver?.disconnect();
  }

}
