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
import {BooleanInput, coerceBooleanProperty} from '@angular/cdk/coercion';
import {SelectionModel} from '@angular/cdk/collections';
import {
  ChangeDetectionStrategy,
  Component,
  ContentChildren,
  ElementRef,
  EventEmitter, inject,
  InjectionToken,
  Input,
  Output,
  QueryList,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import {LIST_OPTION, ListOption, CuteListOptionTogglePosition} from './list-option-types';
import {CuteListBase} from "./list-base.directive";
import {CuteListItemLine, CuteListItemTitle} from "./list-item-sections";
import {CuteListItemBase} from "./list-item-base.directive";
import {CdkObserveContent} from "@angular/cdk/observers";
import {CuteCheckbox} from "@cute-widgets/base/checkbox";
import {CuteRadioButton} from "@cute-widgets/base/radio";
import {NgTemplateOutlet} from "@angular/common";
import {RelativeSize} from "@cute-widgets/base/core";

/**
 * Injection token that can be used to reference instances of an `SelectionList`. It serves
 * as an alternative token to an actual implementation which would result in circular references.
 */
export const SELECTION_LIST = new InjectionToken<SelectionList>('SelectionList');

/**
 * Interface describing the containing list of a list option. This is used to avoid
 * circular dependencies between the list-option and the selection list.
 */
export interface SelectionList extends CuteListBase {
  multiple: boolean;
  selectedOptions: SelectionModel<CuteListOption>;
  hideSingleSelectionIndicator: boolean;
  compareWith: (o1: any, o2: any) => boolean;
  _value: string[] | null;
  _reportValueChange(): void;
  _emitChangeEvent(options: CuteListOption[]): void;
  _onTouched(): void;
}

@Component({
    selector: 'cute-list-option',
    templateUrl: './list-option.component.html',
    styleUrls: ['./list-option.component.scss'],
    exportAs: 'cuteListOption',
    host: {
      'class': 'cute-list-option', // list-group-item-action',
      '[class.cute-list-option-separated]': 'hideIndicator',
      '[class.cute-list-item--selected]': 'hiddenIndicatorSelected',
      '[class.active]': 'hiddenIndicatorSelected',
      '[attr.aria-selected]': 'selected',
      //'[style.cursor]': '"pointer"',
      'role': 'option',
      '(blur)': '_handleBlur()',
      '(click)': '_toggleOnInteraction()',
    },
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [
        { provide: CuteListItemBase, useExisting: CuteListOption },
        { provide: LIST_OPTION, useExisting: CuteListOption },
    ],
    imports: [
        CdkObserveContent,
        CuteCheckbox,
        CuteRadioButton,
        NgTemplateOutlet
    ]
})
export class CuteListOption extends CuteListItemBase implements ListOption {

  protected _selectionList = inject<SelectionList>(SELECTION_LIST);

  @ContentChildren(CuteListItemLine, {descendants: true}) _lines: QueryList<CuteListItemLine> | undefined;
  @ContentChildren(CuteListItemTitle, {descendants: true}) _titles: QueryList<CuteListItemTitle> | undefined;
  @ViewChild('unscopedContent') _unscopedContent: ElementRef<HTMLSpanElement> | undefined;

  /**
   * Emits when the selected state of the option has changed.
   * Use to facilitate two-data binding to the `selected` property.
   */
  @Output()
  readonly selectedChange: EventEmitter<boolean> = new EventEmitter<boolean>();

  /** Whether the label should appear before or after the checkbox/radio. Defaults to 'after' */
  @Input() togglePosition: CuteListOptionTogglePosition = 'after';

  /** Value of the option */
  @Input()
  get value(): any { return this._value; }
  set value(newValue: any) {
    if (this.selected && newValue !== this.value && this._inputsInitialized) {
      this.selected = false;
    }
    this._value = newValue;
  }
  private _value: any;

  /** Whether the option is selected. */
  @Input()
  get selected(): boolean { return this._selectionList.selectedOptions.isSelected(this); }
  set selected(value: BooleanInput) {
    const isSelected = coerceBooleanProperty(value);

    if (isSelected !== this._selected) {
      this._setSelected(isSelected);

      if (isSelected || this._selectionList.multiple) {
        this._selectionList._reportValueChange();
      }
    }
  }
  private _selected = false;

  /** Relative size of the internal input element. */
  @Input() iconSize: RelativeSize = "middle";

  protected get hideIndicator(): boolean {
    return !this._selectionList.multiple && this._selectionList.hideSingleSelectionIndicator;
  }

  protected get hiddenIndicatorSelected(): boolean {
    return this.selected && this.hideIndicator
  }

  /**
   * This is set to true after the first OnChanges cycle, so we don't
   * clear the value of `selected` in the first cycle.
   */
  private _inputsInitialized = false;

  override ngOnInit() {
    super.ngOnInit();

    const list = this._selectionList;

    if (list._value && list._value.some(value => list.compareWith(this._value, value))) {
      this._setSelected(true);
    }

    const wasSelected = this._selected;

    // List options that are selected at initialization can't be reported properly to the form
    // control. This is because it takes some time until the selection-list knows about all
    // available options. Also, it can happen that the ControlValueAccessor has an initial value
    // that should be used instead. Deferring the value change report to the next tick ensures
    // that the form control value is not being overwritten.
    Promise.resolve().then(() => {
      if (this._selected || wasSelected) {
        this.selected = true;
        this.markForCheck();
      }
    });
    this._inputsInitialized = true;
  }

  override ngOnDestroy(): void {
    super.ngOnDestroy();

    if (this.selected) {
      // We have to delay this until the next tick in order
      // to avoid changed after checked errors.
      Promise.resolve().then(() => {
        this.selected = false;
      });
    }
  }

  /** Toggles the selection state of the option. */
  toggle(): void {
    this.selected = !this.selected;
  }

  /** Gets the text label of the list option. Used for the typeahead functionality in the list. */
  override getLabel() {
    const titleElement = this._titles?.get(0)?._elementRef.nativeElement;
    // If there is no explicit title element, the unscoped text content
    // is treated as the list item title.
    const labelEl = titleElement || this._unscopedContent?.nativeElement;
    return labelEl?.textContent || '';
  }

  /** Whether a checkbox is shown at the given position. */
  _hasCheckboxAt(position: CuteListOptionTogglePosition): boolean {
    return this._selectionList.multiple && this._getTogglePosition() === position;
  }

  /** Where a radio indicator is shown at the given position. */
  _hasRadioAt(position: CuteListOptionTogglePosition): boolean {
    return (
      !this._selectionList.multiple &&
      this._getTogglePosition() === position &&
      !this._selectionList.hideSingleSelectionIndicator
    );
  }

  /** Whether icons or avatars are shown at the given position. */
  _hasIconsOrAvatarsAt(position: 'before' | 'after'): boolean {
    return this._hasProjected('icons', position) || this._hasProjected('avatars', position);
  }

  /** Gets whether the given type of element is projected at the specified position. */
  _hasProjected(type: 'icons' | 'avatars', position: 'before' | 'after'): boolean {
    // If the checkbox/radio is shown at the specified position, none of the icons or
    // avatars can be shown at the position.
    return (
      this._getTogglePosition() !== position &&
      (type === 'avatars' ? this._avatars?.length !== 0 : this._icons?.length !== 0)
    );
  }

  _handleBlur() {
    this._selectionList._onTouched();
  }

  /** Gets the current position of the checkbox/radio. */
  _getTogglePosition() {
    return this.togglePosition || 'after';
  }

  /**
   * Sets the selected state of the option.
   * @returns Whether the value has changed.
   * @internal
   */
  _setSelected(selected: boolean): boolean {
    if (selected === this._selected) {
      return false;
    }

    this._selected = selected;

    if (selected) {
      this._selectionList.selectedOptions.select(this);
    } else {
      this._selectionList.selectedOptions.deselect(this);
    }

    this.selectedChange.emit(selected);
    this.markForCheck();
    return true;
  }

  /**
   * Toggles the option's value based on a user interaction.
   * @internal
   */
  _toggleOnInteraction() {
    if (!this.disabled) {
      if (this._selectionList.multiple) {
        this.selected = !this.selected;
        this._selectionList._emitChangeEvent([this]);
      } else if (!this.selected) {
        this.selected = true;
        this._selectionList._emitChangeEvent([this]);
      }
    }
  }

  /** Sets the tabindex of the list option. */
  _setTabindex(value: number) {
    this.setAttribute('tabindex', value + '');
  }
}
