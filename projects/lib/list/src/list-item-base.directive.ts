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
  ANIMATION_MODULE_TYPE,
  ContentChildren,
  Directive, DOCUMENT,
  ElementRef, inject,
  Input, isDevMode, NgZone,
  QueryList
} from "@angular/core";
import {CuteFocusableControl} from "@cute-widgets/base/abstract";
import {CuteListBase} from "./list-base.directive";
import {CuteListItemAvatar, CuteListItemIcon, CuteListItemLine, CuteListItemTitle} from "./list-item-sections";
import {coerceNumberProperty} from "@angular/cdk/coercion";
import {merge, Subscription} from "rxjs";
import {CUTE_NAV_LIST} from './nav-list.directive';
import {toThemeColor} from '@cute-widgets/base/core';

@Directive({
    host: {
      'class': 'cute-list-item-base list-group-item',
      '[class]': 'color ? "list-group-item-"+ toThemeColor(color) : ""',
      //'[class.nav-link]': '_navList',
      '[class.list-group-item-action]': '_isInteractiveItem',
      '[class.disabled]': 'disabled',
      '[attr.aria-disabled]': 'disabled',
      '[attr.disabled]': '(_isButtonElement && disabled) || null',
      //'[attr.tabindex]': '_isInteractiveItem && !disabled ? 0 : -1',
      '(click)': 'onClick($event)',
    }
})
export abstract class CuteListItemBase extends CuteFocusableControl {

  private _document = inject(DOCUMENT);
  private _listBase = inject(CuteListBase, {optional: true});
  protected _ngZone = inject(NgZone);
  protected _navList = inject(CUTE_NAV_LIST, {optional: true});

  protected _isInteractiveItem: boolean = false;

  protected toThemeColor = toThemeColor;

  /** Query list matching list-item line elements. */
  abstract _lines: QueryList<CuteListItemLine> | undefined;

  /** Query list matching list-item title elements. */
  abstract _titles: QueryList<CuteListItemTitle> | undefined;

  /**
   * Element reference to the unscoped content in a list item.
   *
   * Unscoped content is user-projected text content in a list item that is
   * not part of an explicit line or title.
   */
  abstract _unscopedContent: ElementRef<HTMLSpanElement> | undefined;

  /** Host element for the list item. */
  protected _hostElement: HTMLElement;
  /** indicate whether the host element is a button or not */
  protected _isButtonElement: boolean;
  /** Whether animations are disabled. */
  protected _noopAnimations: boolean;
  /** Whether the list item has unscoped text content. */
  _hasUnscopedTextContent: boolean = false;

  private _subscriptions = new Subscription();

  @ContentChildren(CuteListItemAvatar, {descendants: false}) _avatars: QueryList<never> | undefined;
  @ContentChildren(CuteListItemIcon, {descendants: false}) _icons: QueryList<never> | undefined;

  /**
   * The number of lines this list item should reserve space for. If not specified,
   * lines are inferred based on the projected content.
   *
   * Explicitly specifying the number of lines is useful if you want to acquire additional
   * space and enable the wrapping of text. The unscoped text content of a list item will
   * always be able to take up the remaining space of the item, unless it represents the title.
   *
   * A maximum of three lines is supported as per the Material Design specification.
   */
  @Input()
  set lines(lines: number | string | null) {
    this._explicitLines = coerceNumberProperty(lines, null);
    this._updateItemLines(false);
  }
  _explicitLines: number | null = null;

  protected constructor(...args: unknown[]);
  protected constructor(
  ) {
    super();

    const animationMode = inject(ANIMATION_MODULE_TYPE, {optional: true});

    this._hostElement = this._nativeElement;
    this._isButtonElement = this._hostElement.nodeName.toLowerCase() === 'button';
    this._noopAnimations = animationMode === 'NoopAnimations';

    if (this._listBase && !this._listBase._isNonInteractive) {
      this._initInteractiveListItem();
    }

    // If no type attribute is specified for a host `<button>` element, set it to `button`. If a
    // type attribute is already specified, we do nothing. We do this for backwards compatibility.
    // TODO: Determine if we intend to continue doing this for the MDC-based list.
    // if (this._isButtonElement && !this._hostElement.hasAttribute('type')) {
    //   this._hostElement.setAttribute('type', 'button');
    // }
  }

  private _initInteractiveListItem() {
    this._isInteractiveItem = true;
    this._hostElement.classList.add('cute-list-item-interactive');
    // this._rippleRenderer = new RippleRenderer(
    //   this,
    //   this._ngZone,
    //   this._hostElement,
    //   this._platform,
    // );
    // this._rippleRenderer.setupTriggerEvents(this._hostElement);
  }

  /**
   * Subscribes to changes in the projected title and lines.
   * Triggers item lines update whenever a change occurs.
   */
  private _monitorProjectedLinesAndTitle() {
    this._ngZone.runOutsideAngular(() => {
      this._subscriptions.add(
        merge(this._lines!.changes, this._titles!.changes).subscribe(() =>
          this._updateItemLines(false),
        ),
      );
    });
  }

  /**
   * Updates the lines of the list item. Based on the projected user content and optional
   * explicit lines setting, the visual appearance of the list item is determined.
   *
   * This method should be invoked whenever the projected user content changes, or
   * when the explicit lines have been updated.
   *
   * @param recheckUnscopedContent Whether the projected unscoped content should be re-checked.
   *   The unscoped content is not re-checked for every update as it is a rather expensive check
   *   for content that is expected to not change very often.
   */
  _updateItemLines(recheckUnscopedContent: boolean) {
    // If the updated is triggered too early before the view and content are initialized,
    // we just skip the update. After view initialization, the update is triggered again.
    if (!this._lines || !this._titles || !this._unscopedContent) {
      return;
    }

    // Re-check the DOM for unscoped text content if requested. This needs to
    // happen before any computation or sanity checks run as these rely on the
    // result of whether there is unscoped text content or not.
    if (recheckUnscopedContent) {
      this._checkDomForUnscopedTextContent();
    }

    // Sanity checks the list item lines and title in the content. This is a dev-mode only
    // check that can be dead-code eliminated by Terser in production.
    if (isDevMode()) {
      sanityCheckListItemContent(this);
    }

    const numberOfLines = this._explicitLines ?? this._inferLinesFromContent();
    const unscopedContentEl = this._unscopedContent.nativeElement;

    // Update the list item element to reflect the number of lines.
    this._hostElement.classList.toggle('cute-list-item-single-line', numberOfLines <= 1);
    this._hostElement.classList.toggle('cute-list-item--with-one-line', numberOfLines <= 1);
    this._hostElement.classList.toggle('cute-list-item--with-two-lines', numberOfLines === 2);
    this._hostElement.classList.toggle('cute-list-item--with-three-lines', numberOfLines === 3);

    // If there is no title and the unscoped content is the only line, the
    // unscoped text content will be treated as the title of the list-item.
    if (this._hasUnscopedTextContent) {
      const treatAsTitle = this._titles.length === 0 && numberOfLines === 1;
      unscopedContentEl.classList.toggle('cute-list-item__primary-text', treatAsTitle);
      unscopedContentEl.classList.toggle('cute-list-item__secondary-text', !treatAsTitle);
    } else {
      unscopedContentEl.classList.remove('cute-list-item__primary-text');
      unscopedContentEl.classList.remove('cute-list-item__secondary-text');
    }
  }

  /**
   * Infers the number of lines based on the projected user content. This is useful
   * if no explicit number of lines has been specified on the list item.
   *
   * The number of lines is inferred based on whether there is a title, the number of
   * additional lines (secondary/tertiary). An additional line is acquired if there is
   * unscoped text content.
   */
  private _inferLinesFromContent() {
    let numOfLines = this._titles!.length + this._lines!.length;
    if (this._hasUnscopedTextContent) {
      numOfLines += 1;
    }
    return numOfLines;
  }

  /** Checks whether the list item has unscoped text content. */
  private _checkDomForUnscopedTextContent() {
    this._hasUnscopedTextContent = Array.from<ChildNode>(
      this._unscopedContent!.nativeElement.childNodes,
    )
      .filter(node => node.nodeType !== node.COMMENT_NODE)
      .some(node => !!(node.textContent && node.textContent.trim()));
  }

  /** Whether the list item has icons or avatars. */
  _hasIconOrAvatar() {
    return !!(this._avatars?.length || this._icons?.length);
  }

  protected override generateId(): string {
    return "";
  }

  /**
   * "Use `a`s or `button`s to create actionable list group items..." (`Bootstrap` docs)
   * @returns Whether the list item is actionable
   */
  protected isActionItem(): boolean {
    const tag = this._nativeElement.nodeName.toLowerCase();
    return tag === "a" || tag === "button";
  }

  protected onClick(event: MouseEvent): void {
    const elem = event.target as HTMLElement;
    if (elem instanceof HTMLAnchorElement && elem.hash && elem.hash.startsWith("#")) {
      event.preventDefault();
      event.stopPropagation();
      const target = this._document.getElementById(elem.hash.substring(1));
      if (target) {
        target.scrollIntoView({behavior: "smooth", block: "nearest"});
      }
    }
  }

  override ngAfterViewInit() {
    super.ngAfterViewInit();
    this._monitorProjectedLinesAndTitle();
    this._updateItemLines(true);
  }

  override ngOnDestroy() {
    super.ngOnDestroy();
    this._subscriptions.unsubscribe();
  }

}

/**
 * Sanity checks the configuration of the list item with respect to the amount
 * of lines, whether there is a title, or if there is unscoped text content.
 *
 * The checks are extracted into a top-level function that can be dead-code
 * eliminated by Terser or other optimizers in production mode.
 */
function sanityCheckListItemContent(item: CuteListItemBase) {
  const numTitles = item._titles!.length;
  const numLines = item._lines!.length;

  if (numTitles > 1) {
    console.warn('A list item cannot have multiple titles.');
  }
  if (numTitles === 0 && numLines > 0) {
    console.warn('A list item line can only be used if there is a list item title.');
  }
  if (
    numTitles === 0 &&
    item._hasUnscopedTextContent &&
    item._explicitLines !== null &&
    item._explicitLines > 1
  ) {
    console.warn('A list item cannot have wrapping content without a title.');
  }
  if (numLines > 2 || (numLines === 2 && item._hasUnscopedTextContent)) {
    console.warn('A list item can have at maximum three lines.');
  }
}
