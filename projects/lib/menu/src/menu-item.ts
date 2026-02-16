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
  ElementRef,
  OnDestroy,
  ViewEncapsulation,
  Input,
  AfterViewInit,
  ChangeDetectorRef,
  booleanAttribute,
  DOCUMENT, inject
} from '@angular/core';
import {FocusableOption, FocusMonitor, FocusOrigin} from '@angular/cdk/a11y';
import {Subject} from 'rxjs';

import {CuteMenuPanel, CUTE_MENU_PANEL} from './menu-panel';

/**
 * Single item inside a `cute-menu`. Provides the menu item styling and accessibility treatment.
 */
@Component({
  selector: '[cute-menu-item]',
  exportAs: 'cuteMenuItem',
  templateUrl: './menu-item.html',
  styleUrls: ['./menu-item.scss'],
  host: {
    '[attr.role]': 'role',
    'class': 'cute-menu-item',
    '[class.active]': '_highlighted',
    '[class.cute-menu-item-submenu-trigger]': '_triggersSubmenu',
    //'[class.disabled]': 'disabled',
    '[attr.tabindex]': '_getTabIndex()',
    '[attr.aria-disabled]': 'disabled',
    '[attr.disabled]': 'disabled || null',
    '(click)': '_checkDisabled($event)',
    '(mouseenter)': '_handleMouseEnter()',
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None
})
export class CuteMenuItem implements FocusableOption, AfterViewInit, OnDestroy {
  private _elementRef = inject<ElementRef<HTMLElement>>(ElementRef);
  private _document = inject(DOCUMENT);
  private _focusMonitor = inject(FocusMonitor);
  _parentMenu? = inject<CuteMenuPanel<CuteMenuItem>>(CUTE_MENU_PANEL, {optional: true});
  private _changeDetectorRef = inject(ChangeDetectorRef);

  /** ARIA role for the menu item. */
  @Input() role: 'menuitem' | 'menuitemradio' | 'menuitemcheckbox' = 'menuitem';

  /** Whether the menu item is disabled. */
  @Input({transform: booleanAttribute}) disabled: boolean = false;

  /** Whether ripples are disabled on the menu item. */
  @Input({transform: booleanAttribute}) disableRipple: boolean = false;

  /** Stream that emits when the menu item is hovered. */
  readonly _hovered: Subject<CuteMenuItem> = new Subject<CuteMenuItem>();

  /** Stream that emits when the menu item is focused. */
  readonly _focused = new Subject<CuteMenuItem>();

  /** Whether the menu item is highlighted. */
  protected _highlighted: boolean = false;

  /** Whether the menu item acts as a trigger for a submenu. */
  protected _triggersSubmenu: boolean = false;

  constructor(...args: unknown[]);

  constructor() {
    this._parentMenu?.addItem?.(this);
  }

  /** Focuses the menu item. */
  focus(origin?: FocusOrigin, options?: FocusOptions): void {
    if (this._focusMonitor && origin) {
      this._focusMonitor.focusVia(this._getHostElement(), origin, options);
    } else {
      this._getHostElement().focus(options);
    }

    this._focused.next(this);
  }

  ngAfterViewInit() {
    // Start monitoring the element, so it gets the appropriate focused classes. We want
    // to show the focus style for menu items only when the focus was not caused by a
    // mouse or touch interaction.
    this._focusMonitor?.monitor(this._elementRef, false);
  }

  ngOnDestroy() {

    this._focusMonitor?.stopMonitoring(this._elementRef);

    if (this._parentMenu && this._parentMenu.removeItem) {
      this._parentMenu.removeItem(this);
    }

    this._hovered.complete();
    this._focused.complete();
  }

  /** Used to set the `tabindex`. */
  _getTabIndex(): string {
    return this.disabled ? '-1' : '0';
  }

  /** Returns the host DOM element. */
  _getHostElement(): HTMLElement {
    return this._elementRef.nativeElement;
  }

  /** Prevents the default element actions if it is disabled. */
  _checkDisabled(event: Event): void {
    if (this.disabled) {
      event.preventDefault();
      event.stopPropagation();
    }
  }

  /** Emits to the hover stream. */
  _handleMouseEnter() {
    this._hovered.next(this);
  }

  /** Gets the label to be used when determining whether the option should be focused. */
  getLabel(): string {
    const clone = this._elementRef.nativeElement.cloneNode(true) as HTMLElement;
    const icons = clone.querySelectorAll('cute-icon, .material-icons');

    // Strip away icons, so they don't show up in the text.
    for (let i = 0; i < icons.length; i++) {
      icons[i].remove();
    }

    return clone.textContent?.trim() || '';
  }

  _setHighlighted(isHighlighted: boolean) {
    // We need to mark this for check for the case where the content is coming from a
    // `cuteMenuContent` whose change detection tree is at the declaration position,
    // not the insertion position. See #23175.
    this._highlighted = isHighlighted;
    this._changeDetectorRef.markForCheck();
  }

  _setTriggersSubmenu(triggersSubmenu: boolean) {
    this._triggersSubmenu = triggersSubmenu;
    this._changeDetectorRef.markForCheck();
  }

  _hasFocus(): boolean {
    return this._document && this._document.activeElement === this._getHostElement();
  }
}
