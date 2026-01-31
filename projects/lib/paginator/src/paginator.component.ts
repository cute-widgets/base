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
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Inject,
  InjectionToken,
  Input,
  Optional,
  Output,
  ViewEncapsulation,
  booleanAttribute,
  numberAttribute, SimpleChanges, AfterViewChecked, signal,
} from '@angular/core';
import {CuteFormField, CuteLabel} from '@cute-widgets/base/form-field';
import {CuteSelect} from '@cute-widgets/base/select';
import {CuteTooltip} from '@cute-widgets/base/tooltip';
import {Subscription} from 'rxjs';
import {CutePaginatorIntl} from './paginator-intl.service';
import {CuteFocusableControl} from "@cute-widgets/base/abstract";
import {RelativeSize} from "@cute-widgets/base/core";
import {CuteOption} from "@cute-widgets/base/core/option";

/** The default page size if there is no page size and there are no provided page size options. */
const DEFAULT_PAGE_SIZE = 50;
/** Maximum visible page indexes */
const MAX_VISIBLE_PAGES: number = 5;

/** Object that can used to configure the underlying `CuteSelect` inside a `CutePaginator`. */
export interface CutePaginatorSelectConfig {
  /** Whether to center the active option over the trigger. */
  disableOptionCentering?: boolean;

  /** Classes to be passed to the select panel. */
  panelClass?: string | string[];
}

/**
 * Change an event object emitted when the user selects a
 * different page size or navigates to another page.
 */
export interface PageEvent {
  /** The current page index. */
  pageIndex: number;

  /** Index of the page that was selected previously. */
  previousPageIndex: number;

  /** The current page size. */
  pageSize: number;

  /** The current total number of items being paged. */
  length: number;
}

/** Object that can be used to configure the default options for the paginator module. */
export interface CutePaginatorDefaultOptions {
  /** Number of items to display on a page. By default, set to 50. */
  pageSize?: number;

  /** The set of provided page size options to display to the user. */
  pageSizeOptions?: number[];

  /** Whether to hide the page size selection UI from the user. */
  hidePageSize?: boolean;

  /** Whether to show the first/last buttons UI to the user. */
  showFirstLastButtons?: boolean;

  /** Whether to change the previous/next buttons UI with a text labels */
  showPrevNextLabels?: boolean;

  /** Whether to hide all internal borders in the paginator */
  hideBorders?: boolean;

  /** The default form-field appearance to apply to the page size options' selector. */
  //formFieldAppearance?: CuteFormFieldAppearance;
}

/** Injection token that can be used to provide the default options for the paginator module. */
export const CUTE_PAGINATOR_DEFAULT_OPTIONS = new InjectionToken<CutePaginatorDefaultOptions>(
  'CUTE_PAGINATOR_DEFAULT_OPTIONS',
);

let nextUniqueId = 0;

/**
 * Component to provide navigation between paged information. Displays the size of the current
 * page, user-selectable options to change that size, what items are being shown, and
 * navigational button to go to the previous or next page.
 */
@Component({
  selector: 'cute-paginator',
  exportAs: 'cutePaginator',
  templateUrl: './paginator.component.html',
  styleUrls: ['./paginator.component.scss'],
  host: {
    'class': 'cute-paginator',
    '[class.pe-none]': 'disabled',
    '[class.opacity-75]': 'disabled',
    '[class]': 'alignment ? "justify-content-"+alignment : "justify-content-sm-start"',
    '[attr.magnitude]': 'magnitude',
    'tabindex': '-1',
    'role': 'group',
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  imports: [CuteFormField, CuteSelect, CuteTooltip, CuteOption, CuteLabel]
})
export class CutePaginator extends CuteFocusableControl implements AfterViewChecked
{
  private _intlChanges: Subscription;
  private _firstVisiblePageIndex: number = 0;
  private _lastVisiblePageIndex: number = NaN;

  /** If set, styles the "page size" form field with the designated style. */
  //_formFieldAppearance?: CuteFormFieldAppearance;

  /** ID for the DOM node containing the pagination's items per-page label. */
  protected readonly _pageSizeLabelId = `cute-paginator-page-size-label-${nextUniqueId++}`;
  protected hideActive = signal<boolean>(false);

  /** The zero-based page index of the displayed list of items. Defaulted to 0. */
  @Input({transform: numberAttribute})
  get pageIndex(): number { return this._pageIndex; }
  set pageIndex(value: number) {
    const oldIndex = this._pageIndex;
    if (oldIndex != value) {
      this._pageIndex = Math.max(value || 0, 0);
      this._updateFirstLastVisibleIndexes(this._pageIndex, oldIndex);
      this.markForCheck();
    }
  }
  private _pageIndex = 0;

  /** The total number of items that are being paginated. Defaulted to 0. */
  @Input({transform: numberAttribute})
  get length(): number { return this._length; }
  set length(value: number) {
    this._length = value || 0;
    this.markForCheck();
  }
  private _length = 0;

  /** Number of items to display on a page. By default, set to 50. */
  @Input({transform: numberAttribute})
  get pageSize(): number { return this._pageSize; }
  set pageSize(value: number) {
    this._pageSize = Math.max(value || 0, 0);
    this._updateDisplayedPageSizeOptions();
  }
  private _pageSize: number = 0;

  /** The set of provided page size options to display to the user. */
  @Input()
  get pageSizeOptions(): number[] { return this._pageSizeOptions; }
  set pageSizeOptions(value: number[] | readonly number[]) {
    this._pageSizeOptions = (value || ([] as number[])).map(p => numberAttribute(p, 0));
    this._updateDisplayedPageSizeOptions();
  }
  private _pageSizeOptions: number[] = [];

  /** Whether to hide the page size selection UI from the user. */
  @Input({transform: booleanAttribute})
  hidePageSize: boolean = false;

  /** Whether to show the first/last buttons UI to the user. */
  @Input({transform: booleanAttribute})
  showFirstLastButtons: boolean = false;

  /** Whether to change the previous/next buttons UI with a text labels */
  @Input({transform: booleanAttribute})
  showPrevNextLabels: boolean = false;

  /** Whether to hide all internal borders in the paginator */
  @Input({transform: booleanAttribute})
  hideBorders: boolean = false;

  /** Style of the pagination's middle section. Note that previous/next buttons are always shown. */
  @Input()
  middleSectionStyle: 'pages'|'5-pages'|'range'|'none' = 'range';

  /** Changes the alignment of the pagination sections in the parent container. */
  @Input()
  alignment: 'start'|'end'|'center'|'between'|'around'|'evenly'|undefined;

  /** Changes the pagination's size to smaller or larger. */
  @Input() magnitude: RelativeSize | undefined;

  /** Used to configure the underlying `CuteSelect` inside the paginator. */
  @Input() selectConfig: CutePaginatorSelectConfig = {};

  /** Event emitted when the paginator changes the page size or page index. */
  @Output() readonly page: EventEmitter<PageEvent> = new EventEmitter<PageEvent>();

  /** Displayed a set of page size options. Will be sorted and include the current page size. */
  protected _displayedPageSizeOptions: number[] = [];

  constructor(
    public _intl: CutePaginatorIntl,
    @Optional() @Inject(CUTE_PAGINATOR_DEFAULT_OPTIONS) defaults?: CutePaginatorDefaultOptions,
  ) {
    super();
    this._intlChanges = _intl.changes.subscribe(() => this.markForCheck());

    if (defaults) {
      const {
        pageSize,
        pageSizeOptions,
        hidePageSize,
        showFirstLastButtons,
        showPrevNextLabels,
        hideBorders,
      } = defaults;

      if (pageSize != null)             { this._pageSize = pageSize; }
      if (pageSizeOptions != null)      { this._pageSizeOptions = pageSizeOptions; }
      if (hidePageSize != null)         { this.hidePageSize = hidePageSize; }
      if (showFirstLastButtons != null) { this.showFirstLastButtons = showFirstLastButtons; }
      if (showPrevNextLabels != null)   { this.showPrevNextLabels = showPrevNextLabels; }
      if (hideBorders != null)          { this.hideBorders = hideBorders; }
    }

    //this._formFieldAppearance = defaults?.formFieldAppearance || 'outline';
  }

  protected override generateId(): string {
    return `cute-paginator-${nextUniqueId++}`;
  }

  override ngOnInit() {
    super.ngOnInit();
    this._updateDisplayedPageSizeOptions();
  }

  override ngOnChanges(changes: SimpleChanges) {
    super.ngOnChanges(changes);

    this._updateFirstLastVisibleIndexes(this.pageIndex, this.pageIndex);
  }

  ngAfterViewChecked() {
  }

  override ngOnDestroy() {
    super.ngOnDestroy();
    this._intlChanges.unsubscribe();
  }

  protected onPointerDown(event: MouseEvent): void {
    if (this.middleSectionStyle=="5-pages") {
      this.hideActive.set(true);
    }
  }

  protected onPointerUp(event: MouseEvent): void {
    this.hideActive.set(false);
  }

  /** Whether the specified index is the `active` page of the paginator */
  protected isActivePage(index: number): boolean {
    return index == this.pageIndex;
  }

  private _updateFirstLastVisibleIndexes(newIndex: number, oldIndex: number): void {

    if (this.middleSectionStyle != "5-pages") {
      return;
    }

    const numPages = this.getNumberOfPages();
    if (numPages > 0 && (newIndex >= 0 && newIndex < numPages)) {

      const numVisiblePages = Math.min(numPages, MAX_VISIBLE_PAGES);
      const middleIndex = this._firstVisiblePageIndex + Math.ceil(numVisiblePages/2) - 1;
      if (newIndex <= middleIndex && numPages <= numVisiblePages) {
        this._firstVisiblePageIndex = 0;
        this._lastVisiblePageIndex = numVisiblePages - 1;
      } else if (newIndex == (numPages - 1)) {
        this._firstVisiblePageIndex = newIndex - numVisiblePages + 1;
        this._lastVisiblePageIndex = newIndex;
      } else if (newIndex > middleIndex) {
        // go forward
        this._lastVisiblePageIndex += newIndex - middleIndex;
        this._lastVisiblePageIndex = Math.min(this._lastVisiblePageIndex, numPages - 1);
        this._firstVisiblePageIndex = this._lastVisiblePageIndex - numVisiblePages + 1;
        this._firstVisiblePageIndex = Math.max(this._firstVisiblePageIndex, 0);
      } else if (newIndex < middleIndex) {
        // go backward
        this._firstVisiblePageIndex -= middleIndex - newIndex;
        this._firstVisiblePageIndex = Math.max(this._firstVisiblePageIndex, 0);
        this._lastVisiblePageIndex = this._firstVisiblePageIndex + numVisiblePages - 1;
      }
    }
  }

  /** Advances to the next page if it exists. */
  nextPage(): void {
    if (!this.hasNextPage()) {
      return;
    }

    const previousPageIndex = this.pageIndex;
    this.pageIndex = this.pageIndex + 1;

    this._emitPageEvent(previousPageIndex);
  }

  /** Move back to the previous page if it exists. */
  previousPage(): void {
    if (!this.hasPreviousPage()) {
      return;
    }

    const previousPageIndex = this.pageIndex;
    this.pageIndex = this.pageIndex - 1;

    this._emitPageEvent(previousPageIndex);
  }

  /** Move to the first page if not already there. */
  firstPage(): void {
    // hasPreviousPage being false implies at the start
    if (!this.hasPreviousPage()) {
      return;
    }

    const previousPageIndex = this.pageIndex;
    this.pageIndex = 0;

    this._emitPageEvent(previousPageIndex);
  }

  /** Move to the last page if not already there. */
  lastPage(): void {
    // hasNextPage being false implies at the end
    if (!this.hasNextPage()) {
      return;
    }

    const previousPageIndex = this.pageIndex;
    this.pageIndex = this.getNumberOfPages() - 1;

    this._emitPageEvent(previousPageIndex);
  }

  /**
   * Move to the page with the specified index
   * @param index Zero based page number to move
   */
  gotoPage(index: number): void {
    if (index >= 0 && index < this.getNumberOfPages() && !this.isActivePage(index)) {
      const previousPageIndex = this.pageIndex;
      this.pageIndex = index;

      //this.hideActive.set(false);

      this.markForCheck();

      this._emitPageEvent(previousPageIndex);
    }
  }

  /** Whether there is a previous page. */
  hasPreviousPage(): boolean {
    return this.pageIndex >= 1 && this.pageSize != 0;
  }

  /** Whether there is a next page. */
  hasNextPage(): boolean {
    const maxPageIndex = this.getNumberOfPages() - 1;
    return this.pageIndex < maxPageIndex && this.pageSize != 0;
  }

  /** Calculate the number of pages */
  getNumberOfPages(): number {
    if (!this.pageSize) {
      return 0;
    }
    return Math.ceil(this.length / this.pageSize);
  }

  /** Whether the paginator hasn't any page to paginate */
  empty(): boolean {
    return this.getNumberOfPages() == 0;
  }

  /** Transforms the calculated total pages' value to an array of page numbers */
  getPageNumbers(): number[] {
    let count = this.getNumberOfPages();
    if (count == 0) {
      return [];
    }
    let pages:number[] = [];
    if (this.middleSectionStyle == "5-pages") {
      if (isNaN(this._lastVisiblePageIndex)) {
        return [];
      }
      count = this._lastVisiblePageIndex - this._firstVisiblePageIndex + 1;
      pages = Array(count);
      for (let i=0; i < count; i++) {
        pages[i] = i + this._firstVisiblePageIndex;
      }
    } else {
      pages = Array(count);
      for (let i=0; i < count; i++) {
        pages[i] = i;
      }
    }

    return pages;
  }

  /**
   * Changes the page size so that the first item displayed on the page will still be
   * displayed using the new page size.
   *
   * For example, if the page size is 10 and on the second page (items indexed 10-19), then
   * switching so that the page size is 5 will set the third page as the current page so
   * that the 10th item will still be displayed.
   */
  _changePageSize(pageSize: number) {
    // The current page needs to be updated to reflect the new page size. Navigate to the page
    // containing the previous page's first item.
    const startIndex = this.pageIndex * this.pageSize;
    const previousPageIndex = this.pageIndex;

    this.pageIndex = Math.floor(startIndex / pageSize) || 0;
    this.pageSize = pageSize;

    this._updateFirstLastVisibleIndexes(this.pageIndex, previousPageIndex);
    this.markForCheck();

    this._emitPageEvent(previousPageIndex);
  }

  /** Checks whether the buttons for going forwards should be disabled. */
  protected _nextButtonDisabled() {
    return this.disabled || !this.hasNextPage();
  }

  /** Checks whether the buttons for going backwards should be disabled. */
  protected _previousButtonDisabled() {
    return this.disabled || !this.hasPreviousPage();
  }

  protected _getMagnitudeCssClass(): string {
    if (this.magnitude == "large") {
      return "pagination-lg";
    } else if (this.magnitude=="small") {
      return "pagination-sm";
    }
    return "";
  }

  /**
   * Updates the list of page size options to display to the user. Includes making sure that
   * the page size is an option and that the list is sorted.
   */
  private _updateDisplayedPageSizeOptions() {
    if (!this.isInitialized) {
      return;
    }

    // If no page size is provided, use the first page size option or the default page size.
    if (!this.pageSize) {
      this._pageSize =
        this.pageSizeOptions.length != 0 ? this.pageSizeOptions[0] : DEFAULT_PAGE_SIZE;
    }

    this._displayedPageSizeOptions = this.pageSizeOptions.slice();

    if (this._displayedPageSizeOptions.indexOf(this.pageSize) === -1) {
      this._displayedPageSizeOptions.push(this.pageSize);
    }

    // Sort the numbers using a number-specific sort function.
    this._displayedPageSizeOptions.sort((a, b) => a - b);
    this.markForCheck();
  }

  /** Emits an event notifying that a change of the paginator's properties has been triggered. */
  private _emitPageEvent(previousPageIndex: number) {

    this.page.emit({
      previousPageIndex,
      pageIndex: this.pageIndex,
      pageSize: this.pageSize,
      length: this.length,
    });
  }

  protected readonly isNaN = isNaN;
  protected readonly onmousedown = onmousedown;
}
