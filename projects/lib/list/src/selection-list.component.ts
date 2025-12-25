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
import {FocusKeyManager} from '@angular/cdk/a11y';
import {BooleanInput, coerceBooleanProperty} from '@angular/cdk/coercion';
import {SelectionModel} from '@angular/cdk/collections';
import {hasModifierKey} from '@angular/cdk/keycodes';
import {_getFocusedElementPierceShadowDom} from '@angular/cdk/platform';
import {
  ChangeDetectionStrategy,
  Component,
  ContentChildren,
  ElementRef,
  EventEmitter,
  forwardRef,
  inject,
  Input, isDevMode,
  NgZone,
  Output,
  QueryList, signal,
  SimpleChanges,
  ViewEncapsulation,
} from '@angular/core';
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from '@angular/forms';
import {Subject} from 'rxjs';
import {takeUntil} from 'rxjs/operators';
import {CuteListBase} from './list-base.directive';
import {CuteListOption, SELECTION_LIST, SelectionList} from './list-option.component';

export const CUTE_SELECTION_LIST_VALUE_ACCESSOR: any = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => CuteSelectionList),
  multi: true,
};

/** Change event that is being fired whenever the selected state of an option changes. */
export class CuteSelectionListChange {
  constructor(
    /** Reference to the selection list that emitted the event. */
    public source: CuteSelectionList,
    /** Reference to the options that have been changed. */
    public options: CuteListOption[],
  ) {}
}

@Component({
  selector: 'cute-selection-list',
  template: '<ng-content></ng-content>',
  styleUrls: ['./list.scss'],
  exportAs: 'cuteSelectionList',
  host: {
    'class': 'cute-selection-list',
    '[class.gap-2]': '!multiple && hideSingleSelectionIndicator',
    'role': 'listbox',
    '[attr.aria-multiselectable]': 'multiple',
    '(keydown)': '_handleKeydown($event)',
  },
  providers: [
    CUTE_SELECTION_LIST_VALUE_ACCESSOR,
    {provide: CuteListBase, useExisting: CuteSelectionList},
    {provide: SELECTION_LIST, useExisting: CuteSelectionList},
  ],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
})
export class CuteSelectionList extends CuteListBase
                            implements SelectionList, ControlValueAccessor
{
  _element = inject<ElementRef<HTMLElement>>(ElementRef);
  private _ngZone = inject(NgZone);

  private _initialized = false;
  private _keyManager: FocusKeyManager<CuteListOption> | undefined;
  private _listenerCleanups: (() => void)[] | undefined;

  /** Subject that emits when the component has been destroyed. */
  protected readonly _destroyed = new Subject<void>();

  /** Whether the list has been destroyed. */
  private _isDestroyed: boolean = false;

  /** View to model callback that should be called whenever the selected options change. */
  private _onChange: (value: any) => void = (_: any) => {};

  @ContentChildren(CuteListOption, {descendants: true}) _items: QueryList<CuteListOption> | undefined;

  /** Emits a change event whenever the selected state of an option changes. */
  @Output() readonly selectionChange = new EventEmitter<CuteSelectionListChange>();

  /**
   * Function used for comparing an option against the selected value when determining which
   * options should appear as selected. The first argument is the value of an options. The second
   * one is a value from the selected value. A boolean must be returned.
   */
  @Input() compareWith: (o1: any, o2: any) => boolean = (a1, a2) => a1 === a2;

  /** Whether selection is limited to one or multiple items (default multiple). */
  @Input()
  get multiple(): boolean { return this._multiple; }
  set multiple(value: BooleanInput) {
    const newValue = coerceBooleanProperty(value);

    if (newValue !== this._multiple) {
      if (isDevMode() && this._initialized) {
        throw new Error(
          'Cannot change `multiple` mode of cute-selection-list after initialization.',
        );
      }

      this._multiple = newValue;
      this.selectedOptions = new SelectionModel(this._multiple, this.selectedOptions.selected);
    }
  }
  private _multiple = true;

  /** Whether radio indicator for all list items is hidden. */
  @Input()
  get hideSingleSelectionIndicator(): boolean { return this._hideSingleSelectionIndicator; }
  set hideSingleSelectionIndicator(value: BooleanInput) {
    this._hideSingleSelectionIndicator = coerceBooleanProperty(value);
  }
  private _hideSingleSelectionIndicator: boolean =
    this._defaultOptions?.hideSingleSelectionIndicator ?? false;

  /** The currently selected options. */
  selectedOptions = new SelectionModel<CuteListOption>(this._multiple);

  /** Keeps track of the currently selected value. */
  _value: string[] | null = null;

  /** View to model callback that should be called if the list or its options lost focus. */
  _onTouched: () => void = () => {};

  constructor(...args: unknown[]);
  constructor() {
    super();
    this._isNonInteractive = false;
    //this.color = "primary";
  }

  override ngAfterViewInit() {
    super.ngAfterViewInit();
    // Mark the selection list as initialized so that the `multiple`
    // binding can no longer be changed.
    this._initialized = true;
    this._setupRovingTabindex();

    // These events are bound outside the zone, because they don't change
    // any change-detected properties, and they can trigger timeouts.
    this._ngZone.runOutsideAngular(() => {
      this._listenerCleanups = [
        this._renderer.listen(this._element.nativeElement, 'focusin', this._handleFocusin),
        this._renderer.listen(this._element.nativeElement, 'focusout', this._handleFocusout),
      ];
    });

    if (this._value) {
      this._setOptionsFromValues(this._value);
    }

    this._watchForSelectionChange();
  }

  override ngOnChanges(changes: SimpleChanges) {
    super.ngOnChanges(changes);
    const disabledChanges = changes['disabled'];
    const disableRippleChanges = changes['disableRipple'];
    const hideSingleSelectionIndicatorChanges = changes['hideSingleSelectionIndicator'];

    if (
      (disableRippleChanges && !disableRippleChanges.firstChange) ||
      (disabledChanges && !disabledChanges.firstChange) ||
      (hideSingleSelectionIndicatorChanges && !hideSingleSelectionIndicatorChanges.firstChange)
    ) {
      this._markOptionsForCheck();
    }
  }

  override ngOnDestroy() {
    super.ngOnDestroy();
    this._keyManager?.destroy();
    this._listenerCleanups?.forEach(current => current());
    this._destroyed.next();
    this._destroyed.complete();
    this._isDestroyed = true;
  }

  /** Selects all the options. Returns the options that changed as a result. */
  selectAll(): CuteListOption[] {
    return this._setAllOptionsSelected(true);
  }

  /** Deselects all the options. Returns the options that changed as a result. */
  deselectAll(): CuteListOption[] {
    return this._setAllOptionsSelected(false);
  }

  /** Reports a value change to the ControlValueAccessor */
  _reportValueChange() {
    // Stop reporting value changes after the list has been destroyed. This avoids
    // cases where the list might wrongly reset its value once it is removed, but
    // the form of control is still live.
    if (this.options && !this._isDestroyed) {
      const value = this._getSelectedOptionValues();
      this._onChange(value);
      this._value = value;
    }
  }

  /** Emits a change event if the selected state of an option changed. */
  _emitChangeEvent(options: CuteListOption[]) {
    this.selectionChange.emit(new CuteSelectionListChange(this, options));
  }

  /** Implemented as part of ControlValueAccessor. */
  writeValue(values: string[]): void {
    this._value = values;

    if (this.options) {
      this._setOptionsFromValues(values || []);
    }
  }

  /**
   * Whether the *entire* selection list is disabled. When true, each list item is also disabled,
   * and each list item is removed from the tab order (has tabindex="-1").
   */
  override getDisabledState(): boolean { return this._selectionListDisabled(); }
  /** Implemented as a part of ControlValueAccessor. */
  override setDisabledState(value: boolean|BooleanInput): boolean {
    // Update the disabled state of this list. Write to `this._selectionListDisabled` instead of
    // `super.disabled`. That is to avoid closure compiler compatibility issues with assigning to
    // a super property.
    this._selectionListDisabled.set( coerceBooleanProperty(value) );
    if (this._selectionListDisabled()) {
      this._keyManager?.setActiveItem(-1);
    }
    return true;
  }
  private _selectionListDisabled = signal(false);

  /** Implemented as part of ControlValueAccessor. */
  registerOnChange(fn: (value: any) => void): void {
    this._onChange = fn;
  }

  /** Implemented as part of ControlValueAccessor. */
  registerOnTouched(fn: () => void): void {
    this._onTouched = fn;
  }

  /** Watches for changes in the selected state of the options and updates the list accordingly. */
  private _watchForSelectionChange() {
    this.selectedOptions.changed.pipe(takeUntil(this._destroyed)).subscribe(event => {
      // Sync external changes to the model back to the options.
      for (let item of event.added) {
        item.selected = true;
      }

      for (let item of event.removed) {
        item.selected = false;
      }

      if (!this._containsFocus()) {
        this._resetActiveOption();
      }
    });
  }

  /** Sets the selected options based on the specified values. */
  private _setOptionsFromValues(values: string[]) {
    this.options?.forEach(option => option._setSelected(false));

    values.forEach(value => {
      const correspondingOption = this.options?.find(option => {
        // Skip options that are already in the model. This allows us to handle cases
        // where the same primitive value is selected multiple times.
        return option.selected ? false : this.compareWith(option.value, value);
      });

      if (correspondingOption) {
        correspondingOption._setSelected(true);
      }
    });
  }

  /** Returns the values of the selected options. */
  private _getSelectedOptionValues(): string[] {
    return this.options?.filter(option => option.selected).map(option => option.value) ?? [];
  }

  /** Marks all the options to be checked in the next change detection run. */
  private _markOptionsForCheck() {
    if (this.options) {
      this.options.forEach(option => option.markForCheck());
    }
  }

  /**
   * Sets the selected state on all the options
   * and emits an event if anything changed.
   */
  private _setAllOptionsSelected(isSelected: boolean, skipDisabled?: boolean): CuteListOption[] {
    // Keep track of whether anything changed, because we only want to
    // emit the changed event when something actually changed.
    const changedOptions: CuteListOption[] = [];

    this.options?.forEach(option => {
      if ((!skipDisabled || !option.disabled) && option._setSelected(isSelected)) {
        changedOptions.push(option);
      }
    });

    if (changedOptions.length) {
      this._reportValueChange();
    }

    return changedOptions;
  }

  // Note: This getter exists for backwards compatibility. The `_items` query list
  // cannot be named `options` as it will be picked up by the interactive list base.
  /** The option components contained within this selection-list. */
  get options(): QueryList<CuteListOption> | undefined {
    return this._items;
  }

  /** Handles keydown events within the list. */
  protected _handleKeydown(event: KeyboardEvent) {
    const activeItem = this._keyManager?.activeItem;

    if (
      (event.code === "Enter" || event.code === "Space") &&
      !this._keyManager?.isTyping() &&
      activeItem &&
      !activeItem.disabled
    ) {
      event.preventDefault();
      activeItem._toggleOnInteraction();
    } else if (
      event.code === "KeyA" &&
      this.multiple &&
      !this._keyManager?.isTyping() &&
      hasModifierKey(event, 'ctrlKey')
    ) {
      const shouldSelect = this.options?.some(option => !option.disabled && !option.selected) || false;
      event.preventDefault();
      this._emitChangeEvent(this._setAllOptionsSelected(shouldSelect, true));
    } else {
      this._keyManager?.onKeydown(event);
    }
  }

  /** Handles focusout events within the list. */
  private _handleFocusout = () => {
    // Focus takes a while to update, so we have to wrap our call in a timeout.
    setTimeout(() => {
      if (!this._containsFocus()) {
        this._resetActiveOption();
      }
    });
  };

  /** Handles focusin events within the list. */
  private _handleFocusin = (event: FocusEvent) => {
    if (this.disabled) {
      return;
    }

    const activeIndex = this._items?.toArray()
                                  .findIndex(item => item.contains(event.target as HTMLElement)) ?? -1;

    if (activeIndex > -1) {
      this._setActiveOption(activeIndex);
    } else {
      this._resetActiveOption();
    }
  };

  /**
   * Sets up the logic for maintaining the roving tabindex.
   *
   * `skipPredicate` determines if key manager should avoid putting a given list item in the tab
   * index. Allow disabled list items to receive focus to align with WAI ARIA recommendation.
   * Normally WAI ARIA's instructions are to exclude disabled items from the tab order, but it
   * makes a few exceptions for compound widgets.
   *
   * From [Developing a Keyboard Interface](
   * https://www.w3.org/WAI/ARIA/apg/practices/keyboard-interface/):
   *   "For the following composite widget elements, keep them focusable when disabled: Options in a
   *   Listbox..."
   */
  private _setupRovingTabindex() {
    if (this._items) {
      this._keyManager = new FocusKeyManager<CuteListOption>(this._items as any)
        .withHomeAndEnd()
        .withTypeAhead()
        .withWrap()
        .skipPredicate((item) => item.disabled || this.disabled);

      // Set the initial focus.
      this._resetActiveOption();

      // Move the tabindex to the currently focused list item.
      this._keyManager.change.subscribe(activeItemIndex => this._setActiveOption(activeItemIndex));

      // If the active item is removed from the list, reset back to the first one.
      this._items.changes.pipe(takeUntil(this._destroyed)).subscribe(() => {
        const activeItem = this._keyManager!.activeItem;

        if (!activeItem || !this._items?.toArray().indexOf(activeItem)) {
          this._resetActiveOption();
        }
      });
    }
  }

  /**
   * Sets an option as active.
   * @param index Index of the active option. If set to -1, no option will be active.
   */
  private _setActiveOption(index: number) {
    this._items?.forEach((item, itemIndex) => item._setTabindex(itemIndex === index ? 0 : -1));
    this._keyManager?.updateActiveItem(index);
  }

  /**
   * Resets the active option. When the list is disabled, remove all options from to the tab order.
   * Otherwise, focus on the first selected option.
   */
  private _resetActiveOption() {
    if (this.disabled) {
      this._setActiveOption(-1);
      return;
    }

    if (!this._items) {
      return;
    }

    const activeItem =
      this._items.find(item => item.selected && !item.disabled) || this._items.first;
    this._setActiveOption(activeItem ? this._items.toArray().indexOf(activeItem) : -1);
  }

  /** Returns whether the focus is currently within the list. */
  private _containsFocus() {
    const activeElement = _getFocusedElementPierceShadowDom();
    return activeElement && this._element.nativeElement.contains(activeElement);
  }
}
