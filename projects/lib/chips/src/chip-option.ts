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
  Input,
  Output,
  ViewEncapsulation,
  OnInit,
  inject,
  booleanAttribute,
} from '@angular/core';
import {CuteChip} from './chip';
import {CUTE_CHIP, CUTE_CHIPS_DEFAULT_OPTIONS} from './tokens';
import {CuteChipAction} from './chip-action';
import {CuteButton} from "@cute-widgets/base/button";

/** Event object emitted by CuteChipOption when selected or deselected. */
export class CuteChipSelectionChange {
  constructor(
    /** Reference to the chip that emitted the event. */
    public source: CuteChipOption,
    /** Whether the chip that emitted the event is selected. */
    public selected: boolean,
    /** Whether the selection change was a result of a user interaction. */
    public isUserInput = false,
  ) {}
}

/**
 * An extension of the CuteChip component that supports chip selection. Used with CuteChipListbox.
 *
 * Unlike other chips, the user can focus on disabled chip options inside a CuteChipListbox. The
 * user cannot click disabled chips.
 */
@Component({
    selector: 'cute-basic-chip-option, [cute-basic-chip-option], cute-chip-option, [cute-chip-option]',
    templateUrl: './chip-option.html',
    styleUrl: './chip.scss',
    host: {
        'class': 'cute-chip-option',
        '[class.cute-chip-disabled]': 'disabled',
        '[class.cute-chip-highlighted]': 'highlighted',
        '[class.cute-chip-with-trailing-icon]': '_hasTrailingIcon()',
        '[class.cute-chip-selected]': 'selected',
        '[class.cute-chip-multiple]': '_chipListMultiple',
        '[class.cute-chip-with-avatar]': 'leadingIcon',
        /*
        '[class.mdc-evolution-chip]': '!_isBasicChip',
        '[class.mdc-evolution-chip--filter]': '!_isBasicChip',
        '[class.mdc-evolution-chip--selectable]': '!_isBasicChip',
        '[class.mdc-evolution-chip--disabled]': 'disabled',
        '[class.mdc-evolution-chip--selected]': 'selected',
        // This class enables the transition on the checkmark. Usually MDC adds it when selection
        // starts and removes it once the animation is finished. We don't need to go through all
        // the trouble, because we only care about the selection animation. MDC needs to do it,
        // because they also have an exit animation that we don't care about.
        '[class.mdc-evolution-chip--selecting]': '!_animationsDisabled',
        '[class.mdc-evolution-chip--with-trailing-action]': '_hasTrailingIcon()',
        '[class.mdc-evolution-chip--with-primary-icon]': 'leadingIcon',
        '[class.mdc-evolution-chip--with-primary-graphic]': '_hasLeadingGraphic()',
        '[class.mdc-evolution-chip--with-avatar]': 'leadingIcon',
        */
        '[attr.tabindex]': 'null',
        '[attr.aria-label]': 'null',
        '[attr.aria-description]': 'null',
        '[attr.role]': 'role',
        '[id]': 'id',
    },
    providers: [
        { provide: CuteChip, useExisting: CuteChipOption },
        { provide: CUTE_CHIP, useExisting: CuteChipOption },
    ],
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [CuteChipAction, CuteButton]
})
export class CuteChipOption extends CuteChip implements OnInit {
  /** Default chip options. */
  private _defaultOptions = inject(CUTE_CHIPS_DEFAULT_OPTIONS, {optional: true});

  /** Whether the chip list is selectable. */
  chipListSelectable: boolean = true;

  /** Whether the chip list is in multi-selection mode. */
  _chipListMultiple: boolean = false;

  /** Whether the chip list hides single-selection indicator. */
  _chipListHideSingleSelectionIndicator: boolean =
    this._defaultOptions?.hideSingleSelectionIndicator ?? false;

  /**
   * Whether the chip is selectable.
   *
   * When a chip is not selectable, changes to its selected state are always
   * ignored. By default, an option chip is selectable, and it becomes
   * non-selectable if its parent chip list is not selectable.
   */
  @Input({transform: booleanAttribute})
  get selectable(): boolean { return this._selectable && this.chipListSelectable; }
  set selectable(value: boolean) {
    this._selectable = value;
    this.markForCheck();
  }
  protected _selectable: boolean = true;

  /** Whether the chip is selected. */
  @Input({transform: booleanAttribute})
  get selected(): boolean { return this._selected; }
  set selected(value: boolean) { this._setSelectedState(value, false, true); }
  private _selected = false;

  /**
   * The ARIA selected applied to the chip. Conforms to WAI ARIA best practices for listbox
   * interaction patterns.
   *
   * From [WAI ARIA Listbox authoring practices guide](
   * https://www.w3.org/WAI/ARIA/apg/patterns/listbox/):
   *  "If any options are selected, each selected option has either aria-selected or aria-checked
   *  set to true. All options that are selectable but not selected have either aria-selected or
   *  aria-checked set to false."
   *
   * Set `aria-selected="false"` on not-selected listbox options that are selectable to fix
   * VoiceOver reading every option as "selected" (#25736).
   */
  get ariaSelected(): string | null {
    return this.selectable ? this.selected.toString() : null;
  }

  /** The unstyled chip selector for this component. */
  protected override basicChipAttrName = 'cute-basic-chip-option';

  /** Emitted when the chip is selected or deselected. */
  @Output() readonly selectionChange = new EventEmitter<CuteChipSelectionChange>();

  override ngOnInit() {
    super.ngOnInit();
    this.role = 'presentation';
  }

  /** Selects the chip. */
  select(): void                { this._setSelectedState(true, false, true);  }

  /** Deselects the chip. */
  deselect(): void              { this._setSelectedState(false, false, true); }

  /** Selects this chip and emits userInputSelection event */
  selectViaInteraction(): void  { this._setSelectedState(true, true, true); }

  /** Toggles the current selected state of this chip. */
  toggleSelected(isUserInput: boolean = false): boolean {
    this._setSelectedState(!this.selected, isUserInput, true);
    return this.selected;
  }

  override _handlePrimaryActionInteraction() {
    if (!this.disabled) {
      // Interacting with the primary action implies that the chip already has focus, however,
      // there's a bug in Safari where focus ends up lingering on the previous chip (see #27544).
      // We work around it by explicitly focusing the primary action of the current chip.
      this.focus();

      if (this.selectable) {
        this.toggleSelected(true);
      }
    }
  }

  protected _hasLeadingGraphic() {
    if (this.leadingIcon) {
      return true;
    }

    // The checkmark graphic communicates selected state for both single-select and multi-select.
    // Include checkmark in single-select to fix a11y issue where the selected state is communicated
    // visually only using color (#25886).
    return !this._chipListHideSingleSelectionIndicator || this._chipListMultiple;
  }

  _setSelectedState(isSelected: boolean, isUserInput: boolean, emitEvent: boolean) {
    if (isSelected !== this.selected) {
      this._selected = isSelected;

      if (emitEvent) {
        this.selectionChange.emit({
          source: this,
          isUserInput,
          selected: this.selected,
        });
      }

      this.markForCheck();
    }
  }
}
