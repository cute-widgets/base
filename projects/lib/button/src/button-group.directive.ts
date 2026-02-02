/**
 * @license Apache-2.0
 *
 * Copyright (c) 2025 CuteWidgets Team. All Rights Reserved.
 *
 * You may not use this file except in compliance with the License
 * that can be found at http://www.apache.org/licenses/LICENSE-2.0
 */
import {
  booleanAttribute,
  ContentChildren,
  Directive, EventEmitter,
  HostBinding, InjectionToken,
  Input, Output,
  QueryList
} from "@angular/core";
import {CuteFocusableControl} from "@cute-widgets/base/abstract";
import {RelativeSize5} from "@cute-widgets/base/core/types";
import {CUTE_BUTTON_BASE, CuteButtonBase, CuteButtonStyle} from "./button-base.directive";
import {BooleanInput, coerceBooleanProperty} from "@angular/cdk/coercion";

// Counter used to generate unique IDs.
let uniqueIdCounter = 0;

/**
 * Injection token that can be used to reference instances of `CuteButtonGroup`.
 * It serves as an alternative token to the actual `CuteButtonGroup` class which
 * could cause unnecessary retention of the class and its component metadata.
 */
export const CUTE_BUTTON_GROUP = new InjectionToken<CuteButtonGroup>(
  'CuteButtonGroup',
);


/**
 * Group a series of buttons together on a single line or stack them in a vertical column.
 */
@Directive({
  selector: "cute-button-group",
  exportAs: "cuteButtonGroup",
  host: {
    'role':  'group',
    'class': 'cute-button-group',
    '[class]': '"btn-group" +(vertical?"-vertical":"")',
    '[class.disabled]': 'disabled',
    '[attr.aria-disabled]': 'disabled',
    '[attr.aria-label]': 'ariaLabel || null',
    '[attr.aria-labelledby]': 'ariaLabelledby || null',
    '[attr.aria-describedby]': 'ariaDescribedby || null',
    '[attr.tabindex]': '-1',
    '[id]': 'id || null'
  },
  providers: [{provide: CUTE_BUTTON_GROUP, useExisting: CuteButtonGroup}],
  standalone: true
})
export class CuteButtonGroup extends CuteFocusableControl {

  /** Whether to place the nested buttons in the vertical direction. */
  @Input({transform: booleanAttribute}) vertical: boolean = false;

  /** The relative size of the buttons group. */
  @Input() magnitude: RelativeSize5 | undefined;

  /** Default style for the content buttons */
  @Input() buttonStyle: CuteButtonStyle | undefined;

  @HostBinding("class.cute-btn-group-xl")
  protected get buttonLargerBinding(): boolean {return this.magnitude == "larger"}
  @HostBinding("class.btn-group-lg")
  protected get buttonLargeBinding(): boolean {return this.magnitude == "large"}
  @HostBinding("class.cute-btn-group-xs")
  protected get buttonSmallerBinding(): boolean {return this.magnitude == "smaller"}
  @HostBinding("class.btn-group-sm")
  protected get buttonSmallBinding(): boolean {return this.magnitude == "small"}

  /** Child buttons. */
  @ContentChildren(CUTE_BUTTON_BASE, {descendants: true})
  _buttons: QueryList<CuteButtonBase> | undefined;

  /** Raised when the disabled state of a component group changes. */
  @Output() disabledChange = new EventEmitter<boolean>();

  constructor() {
    super();
  }

  protected override generateId(): string {
    return `button-group-${++uniqueIdCounter}`;
  }

  // Buttons that have `disabled` states before the group is disabled as a whole. Uses to restore `disabled` states
  // when the group's state will be enabled again.
  // CuteButtonToggleGroup, as an ancestor, uses this algo too.
  #disablesCache = new Set<CuteButtonBase>();

  protected override setDisabledState(newState: BooleanInput, emitEvent?: boolean): boolean {
    let res = super.setDisabledState(newState, emitEvent);
    if (res && this._buttons) {
      const isDisabled = coerceBooleanProperty(newState);
      if (isDisabled) {
        this._buttons.forEach(btn => {
          if (btn.disabled) {
            this.#disablesCache.add(btn);
          }
          btn.disabled = isDisabled;
        });
      } else {
        this._buttons.forEach(btn => {
          if (!this.#disablesCache.has(btn)) {
            btn.disabled = false;
          }
        });
        this.#disablesCache.clear();
      }

      this._markButtonsForCheck();

      this.disabledChange.emit(isDisabled);
    }
    return res;
  }

  override ngAfterContentInit() {
    super.ngAfterContentInit();

    this._buttons?.forEach(b => {
      b.defaultColor = this.color ?? "primary";

      if (this.disabled) {
        b.disabled = this.disabled;
      }

      if (b.buttonStyle == "base") {
        b.inputButtonStyle = this.buttonStyle ?? "flat-button";
      }
    });
  }

  override ngOnDestroy() {
    super.ngOnDestroy();

    this.#disablesCache.clear();
  }

  /** Marks all the child button toggles to be checked. */
  protected _markButtonsForCheck() {
    this._buttons?.forEach(btn => btn.markForCheck());
  }


}
