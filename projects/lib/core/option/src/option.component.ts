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
import {ENTER, hasModifierKey, SPACE} from '@angular/cdk/keycodes';
import {
  Component,
  ViewEncapsulation,
  ChangeDetectionStrategy,
  ElementRef,
  AfterViewChecked,
  Input,
  Output,
  EventEmitter,
  QueryList,
  ViewChild,
  inject,
} from '@angular/core';
import {Subject} from 'rxjs';
import {CUTE_OPTGROUP, CuteOptgroup} from './optgroup.component';
import {CuteOptionParentComponent, CUTE_OPTION_PARENT_COMPONENT} from './option-parent.interface';
import {CuteFocusableControl} from "@cute-widgets/base/abstract";
import {Highlightable} from "@angular/cdk/a11y";
import {toTextBgCssClass} from "@cute-widgets/base/core/theming";


/**
 * Option IDs need to be unique across components, so this counter exists outside
 * the component definition.
 */
let _uniqueIdCounter = 0;

/** Event object emitted by CuteOption when selected or deselected. */
export class CuteOptionSelectionChange<T = any> {
  constructor(
    /** Reference to the option that emitted the event. */
    public source: CuteOption<T>,
    /** Whether the change in the option's value was a result of a user action. */
    public isUserInput = false,
  ) {}
}

/**
 * Single option inside a `<cute-select>` element.
 */
@Component({
  selector: 'cute-option',
  templateUrl: './option.component.html',
  styleUrls: ['./option.component.scss'],
  exportAs: 'cuteOption',
  host: {
    'role': 'option',
    'class': 'cute-option ',
    //'[class]': 'selected ? "text-bg-"+(color ? color : "primary") : "" ',
    '[class]': 'selected ? toTextBgCssClass(color??"primary") : undefined',
    '[class.selected]': 'selected',
    '[class.multiple]': 'multiple',
    '[class.active]': 'active',
    '[class.disabled]': 'disabled',
    '[id]': 'id',
    '[tabindex]': 'disabled ? -1 : 0',
    // Set aria-selected to false for non-selected items and true for selected items. Conform to
    // [WAI ARIA Listbox authoring practices guide](
    //  https://www.w3.org/WAI/ARIA/apg/patterns/listbox/), "If any options are selected, each
    // selected option has either aria-selected or aria-checked  set to true. All options that are
    // selectable but not selected have either aria-selected or aria-checked set to false." Align
    // aria-selected implementation of Chips and List components.
    //
    // Set `aria-selected="false"` on not-selected listbox options to fix VoiceOver announcing
    // every option as "selected" (#21491).
    '[attr.aria-selected]': 'selected',
    '[attr.aria-disabled]': 'disabled',
    '(click)': '_selectViaInteraction()',
    '(keydown)': '_handleKeydown($event)',
  },
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CuteOption<T = any> extends CuteFocusableControl implements Highlightable, AfterViewChecked {
  private _parent = inject<CuteOptionParentComponent>(CUTE_OPTION_PARENT_COMPONENT, {optional: true});
  public readonly group = inject<CuteOptgroup>(CUTE_OPTGROUP, {optional: true});

  private _selected = false;
  private _active = false;
  private _mostRecentViewValue = '';

  /** Whether the wrapping component is in multiple selection mode. */
  get multiple() {
    return this._parent && this._parent.multiple;
  }

  /** Whether the option is currently selected. */
  get selected(): boolean {
    return this._selected;
  }

  /** Whether ripples for the option are disabled. */
  get disableRipple(): boolean {
    return !!(this._parent && this._parent.disableRipple);
  }

  /** Whether to display checkmark for single-selection. */
  get hideSingleSelectionIndicator(): boolean {
    return !!(this._parent && this._parent.hideSingleSelectionIndicator);
  }

  protected override getDisabledState(): boolean {
    return (this.group && this.group.disabled) || super.getDisabledState();
  }

  protected override generateId(): string {
    return `cute-option-${_uniqueIdCounter++}`;;
  }

  /** The form value of the option. */
  @Input() value: T | undefined;

  /** Event emitted when the option is selected or deselected. */
  @Output() readonly onSelectionChange = new EventEmitter<CuteOptionSelectionChange<T>>();

  /** Element containing the option's text. */
  @ViewChild('text', {static: true}) _text: ElementRef<HTMLElement> | undefined;

  /** Emits when the state of the option changes and any parents have to be notified. */
  readonly _stateChanges = new Subject<void>();

  constructor(...args: unknown[]);
  constructor() {
    super();
  }

  /**
   * Whether the option is currently active and ready to be selected.
   * An active option displays styles, as if it is focused, but the
   * focus is actually retained somewhere else. This comes in handy
   * for components like autocomplete where focus must remain on the input.
   */
  get active(): boolean {
    return this._active;
  }

  /**
   * The displayed value of the option. It is necessary to show the selected option in the
   * select's trigger.
   */
  get viewValue(): string {
    // TODO(kara): Add input property alternative for node envs.
    return (this._text?.nativeElement.textContent || '').trim();
  }

  /** Selects the option. */
  select(emitEvent = true): void {
    if (!this._selected) {
      this._selected = true;
      this.markForCheck();

      if (emitEvent) {
        this._emitSelectionChangeEvent();
      }
    }
  }

  /** Deselects the option. */
  deselect(emitEvent = true): void {
    if (this._selected) {
      this._selected = false;
      this.markForCheck();

      if (emitEvent) {
        this._emitSelectionChangeEvent();
      }
    }
  }

  /**
   * This method sets display styles on the option to make it appear
   * active. This is used by the ActiveDescendantKeyManager so key
   * events will display the proper options as active on arrow key events.
   */
  setActiveStyles(): void {
    if (!this._active) {
      this._active = true;
      this.markForCheck();
    }
  }

  /**
   * This method removes display styles on the option that made it appear
   * active. This is used by the ActiveDescendantKeyManager so key
   * events will display the proper options as active on arrow key events.
   */
  setInactiveStyles(): void {
    if (this._active) {
      this._active = false;
      this.markForCheck();
    }
  }

  /** Gets the label to be used when determining whether the option should be focused. */
  override getLabel(): string {
    return this.viewValue;
  }

  /** Ensures the option is selected when activated from the keyboard. */
  protected _handleKeydown(event: KeyboardEvent): void {
    if ((event.keyCode === ENTER || event.keyCode === SPACE) && !hasModifierKey(event)) {
      this._selectViaInteraction();

      // Prevent the page from scrolling down and form submits.
      event.preventDefault();
    }
  }

  /**
   * Selects the option while indicating the selection came from the user. Used to
   * determine if the select's view -> model callback should be invoked.
   * Used by `CuteSelect` component.
   */
  public _selectViaInteraction(): void {
    if (!this.disabled) {
      this._selected = this.multiple ? !this._selected : true;
      this.markForCheck();
      this._emitSelectionChangeEvent(true);
    }
  }

  /** Gets the host DOM element. */
  _getHostElement(): HTMLElement {
    return this._elementRef.nativeElement;
  }


  ngAfterViewChecked() {
    // Since parent components could be using the option's label to display the selected values
    // (e.g. `mat-select`) and they don't have a way of knowing if the option's label has changed,
    // we have to check for changes in the DOM ourselves and dispatch an event. These checks are
    // relatively cheap, however; we still limit them only to selected options in order to avoid
    // hitting the DOM too often.
    if (this._selected) {
      const viewValue = this.viewValue;

      if (viewValue !== this._mostRecentViewValue) {
        if (this._mostRecentViewValue) {
          this._stateChanges.next();
        }
        this._mostRecentViewValue = viewValue;
      }
    }
  }

  override ngOnDestroy() {
    super.ngOnDestroy();
    this._stateChanges.complete();
  }

  /** Emits the selection change event. */
  private _emitSelectionChangeEvent(isUserInput = false): void {
    this.onSelectionChange.emit(new CuteOptionSelectionChange<T>(this, isUserInput));
  }

  protected readonly toTextBgCssClass = toTextBgCssClass;
}

/**
 * Counts the number of option group labels that precede the specified option.
 * @param optionIndex Index of the option at which to start counting.
 * @param options Flat list of all the options.
 * @param optionGroups Flat list of all the option groups.
 * @docs-private
 */
export function _countGroupLabelsBeforeOption(
  optionIndex: number,
  options: QueryList<CuteOption>,
  optionGroups: QueryList<CuteOptgroup>,
): number {
  if (optionGroups.length) {
    let optionsArray = options.toArray();
    let groups = optionGroups.toArray();
    let groupCounter = 0;

    for (let i = 0; i < optionIndex + 1; i++) {
      if (optionsArray[i].group && optionsArray[i].group === groups[groupCounter]) {
        groupCounter++;
      }
    }

    return groupCounter;
  }

  return 0;
}

/**
 * Determines the position to which to scroll a panel in order for an option to be into view.
 * @param optionOffset Offset of the option from the top of the panel.
 * @param optionHeight Height of the options.
 * @param currentScrollPosition Current scroll position of the panel.
 * @param panelHeight Height of the panel.
 * @docs-private
 */
export function _getOptionScrollPosition(
  optionOffset: number,
  optionHeight: number,
  currentScrollPosition: number,
  panelHeight: number,
): number {
  if (optionOffset < currentScrollPosition) {
    return optionOffset;
  }

  if (optionOffset + optionHeight > currentScrollPosition + panelHeight) {
    return Math.max(0, optionOffset - panelHeight + optionHeight);
  }

  return currentScrollPosition;
}
