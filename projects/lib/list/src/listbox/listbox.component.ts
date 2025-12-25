/**
 * @license Apache-2.0
 *
 * Copyright (c) 2025 CuteWidgets Team. All Rights Reserved.
 *
 * You may not use this file except in compliance with the License
 * that can be found at http://www.apache.org/licenses/LICENSE-2.0
 */
import {
  ChangeDetectionStrategy,
  Component,
  ContentChildren,
  inject,
  InjectionToken, QueryList,
  ViewEncapsulation
} from "@angular/core";
import {CdkListboxModule, CdkListbox, CdkOption} from "@angular/cdk/listbox";
import {ListKeyManager} from "@angular/cdk/a11y";
import {ControlValueAccessor} from "@angular/forms";
import {CuteListBase} from "../list-base.directive";
import {CuteListBoxOption} from "./listbox-option.component";

/**
 * Injection token that can be used to inject instances of `CuteListBox`. It serves as
 * an alternative token to the actual `CuteListBox` class which could cause unnecessary
 * retention of the class and its component metadata.
 */
export const CUTE_LISTBOX = new InjectionToken<CuteListBox>('CuteListBox');

/**
 * A component that displays a list of options for users to select from, supporting keyboard navigation,
 * single or multiple selection, and screen reader support.
 *
 * @experimental
 */
@Component({
  selector: 'cute-listbox',
  template: '<ng-content></ng-content>',
  styleUrl: '../list.scss',
  exportAs: 'cuteListBox',
  host: {
    '[attr.aria-multiselectable]': 'cdkListbox.multiple',
    '[attr.aria-orientation]': 'cdkListbox.orientation',
    '[attr.role]': 'role',
    '(keydown)': '_handleKeydown($event)',
  },
  imports: [CdkListboxModule],
  hostDirectives: [
    { directive: CdkListbox,
      inputs: [
        'id',
        'tabindex',
        'cdkListboxMultiple: multiple',
        'cdkListboxValue: value',
        'cdkListboxDisabled: disabled',
        'cdkListboxUseActiveDescendant: useActiveDescendant',
        'cdkListboxOrientation: orientation',
        'cdkListboxNavigationWrapDisabled: navigationWrapDisabled',
        'cdkListboxCompareWith: compareWith',
        'cdkListboxNavigatesDisabledOptions: navigatesDisabledOptions'
      ],
      outputs: ['cdkListboxValueChange: valueChange']
    }
  ],
  providers: [{ provide: CuteListBase, useExisting: CuteListBox }],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CuteListBox extends CuteListBase implements ControlValueAccessor  {

  protected readonly cdkListbox: CdkListbox<any> = inject(CdkListbox);

  protected _keyManager: ListKeyManager<CuteListBoxOption> | undefined;

  @ContentChildren(CuteListBoxOption, {descendants: true}) protected _options: QueryList<CuteListBoxOption> | undefined;

  constructor() {
    super();
    this.role = "listbox";
    this._isNonInteractive = false;
  }

  /** Deselect the given option */
  deselect(option: CdkOption): void {
    this.cdkListbox.deselect(option);
  }

  /** Deselect the given value */
  deselectValue(value: any): void {
    this.cdkListbox.deselectValue(value);
  }

  /** Focus the list-box's host element */
  override focus(): void {
    this.cdkListbox.focus();
  }

  /** Get whether the given option is active. */
  isActive(option: CdkOption): boolean {
    return this.cdkListbox.isActive(option);
  }

  /** Get whether the given option is selected. */
  isSelected(option: CdkOption): boolean {
    return this.cdkListbox.isSelected(option);
  }

  /** Get whether the given value is selected. */
  isValueSelected(value: any): boolean {
    return this.cdkListbox.isValueSelected(value);
  }

  /** Select the given option. */
  select(option: CdkOption): void {
    this.cdkListbox.select(option);
  }

  /** Select the given value. */
  selectValue(value: any): void {
    this.cdkListbox.selectValue(value);
  }

  /** Set the selected state of all options. */
  setAllSelected(isSelected: boolean): void {
    this.cdkListbox.setAllSelected(isSelected);
  }

  /** Toggle the selected state of the given option. */
  toggle(option: CdkOption): void {
    this.cdkListbox.toggle(option);
  }

  /** Toggle the selected state of the given value. */
  toggleValue(value: any): void {
    this.cdkListbox.toggleValue(value);
  }

  registerOnChange(fn: any): void {
    this.cdkListbox.registerOnChange(fn);
  }

  registerOnTouched(fn: any): void {
    this.cdkListbox.registerOnTouched(fn);
  }

  writeValue(obj: any): void {
    this.cdkListbox.writeValue(obj);
  }

  override setDisabledState(newState: boolean): boolean {
    if (super.setDisabledState(newState)) {
      this.cdkListbox.setDisabledState(newState);
      return true;
    }
    return false;
  }

  protected _handleKeydown(event: KeyboardEvent) {
    this._keyManager?.onKeydown(event);
  }

  override ngAfterContentInit() {
    super.ngAfterContentInit();

    if (this._options) {
      this._keyManager = new ListKeyManager(this._options);
      this._keyManager
        .withVerticalOrientation()
        .withHomeAndEnd()
        .withPageUpDown()
        .withWrap()
        .withTypeAhead()
        .skipPredicate(item => item.disabled);
    }
  }

  override ngOnDestroy() {
    super.ngOnDestroy();
    this._keyManager?.destroy();
  }

}
