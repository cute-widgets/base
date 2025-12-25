/**
 * @license Apache-2.0
 *
 * Copyright (c) 2025 CuteWidgets Team. All Rights Reserved.
 *
 * You may not use this file except in compliance with the License
 * that can be found at http://www.apache.org/licenses/LICENSE-2.0
 */
import {ChangeDetectionStrategy, Component, inject, Input, ViewEncapsulation} from "@angular/core";
import {CdkListboxModule, CdkOption} from "@angular/cdk/listbox";
import {CdkObserveContent} from "@angular/cdk/observers";
import {CuteListBox} from "./listbox.component";
import {CuteListItem} from "../list-item.component";

/**
 * An item within a listbox.
 *
 * @experimental
 */
@Component({
  selector: 'cute-listbox-option, a[cute-listbox-option], button[cute-listbox-option]',
  templateUrl: './listbox-option.component.html',
  exportAs: 'cuteListboxOption',
  host: {
    'class': 'cute-listbox-option',
    '[class.active]': 'selected',
    '[class.disabled]': 'disabled',
    '[attr.aria-disabled]': 'disabled',
    '[attr.aria-selected]': 'selected',
    '[attr.aria-current]': '_getAriaCurrent()',
    '[attr.role]': 'role',
    '[attr.tabindex]': '-1',
  },
  imports: [CdkListboxModule, CdkObserveContent],
  hostDirectives: [
    {
      directive: CdkOption,
      inputs: [
        'cdkOption: value',
        'cdkOptionTypeaheadLabel: typeaheadLabel',
        'cdkOptionDisabled: disabled',
        'tabindex',
        'id',
      ],
      outputs: [],
    }
  ],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CuteListBoxOption extends CuteListItem {

  protected cdkOption: CdkOption<any> = inject(CdkOption);

  /** The value of this option */
  @Input()
  get value(): any {return this.cdkOption.value;}
  set value(v: any) {this.cdkOption.value = v;}

  /** Whether the option is selected or not. */
  get selected(): boolean {
    return this.cdkOption.isSelected();
  }

  constructor(protected listBox: CuteListBox) {
    super(listBox);
    this.role = "option";
  }

  /** Sets focus to this option */
  override focus() {
    this.cdkOption.focus();
  }

  /** Gets the option's label that is part of the `FocusableOption` interface */
  override getLabel(): string {
    return this.cdkOption.getLabel();
  }

  /** Whether this option is active */
  isActive(): boolean {
    return this.cdkOption.isActive();
  }

  /** Select this option if it is not selected */
  select(): void {
    this.cdkOption.select();
  }

  /** Deselect this option if it is selected */
  deselect(): void {
    this.cdkOption.deselect();
  }

  /** Toggle the selected state of this option */
  toggle(): void {
    this.cdkOption.toggle();
  }

}
