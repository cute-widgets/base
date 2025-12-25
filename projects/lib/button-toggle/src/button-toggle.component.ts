/**
 * @license Apache-2.0
 *
 * Copyright (c) 2025 CuteWidgets Team. All Rights Reserved.
 *
 * You may not use this file except in compliance with the License
 * that can be found at http://www.apache.org/licenses/LICENSE-2.0
 */
import {
  EventEmitter,
  Input,
  Output,
  InjectionToken,
  booleanAttribute, inject, OnInit, OnDestroy, Component, ViewEncapsulation, ChangeDetectionStrategy,
} from '@angular/core';
import {CuteButtonBase, CuteButtonStyle} from "@cute-widgets/base/button";
import {CUTE_BUTTON_TOGGLE_GROUP, CuteButtonToggleGroup} from "./button-toggle-group.directive";
import {_animationsDisabled, toThemeColor} from "@cute-widgets/base/core";
import {CUTE_BUTTON_BASE} from '@cute-widgets/base/button';

/**
 * Represents the default options for the button toggle that can be configured
 * using the `CUTE_BUTTON_TOGGLE_DEFAULT_OPTIONS` injection token.
 */
export interface CuteButtonToggleDefaultOptions {
  /**
   * Default appearance to be used by button toggles. Can be overridden by explicitly
   * setting an appearance on a button toggle or group.
   */
  //appearance?: CuteButtonToggleAppearance;
  /** Whether icon indicators should be hidden for single-selection button toggle groups. */
  hideSingleSelectionIndicator?: boolean;
  /** Whether icon indicators should be hidden for multiple-selection button toggle groups. */
  hideMultipleSelectionIndicator?: boolean;
  /** Whether disabled toggle buttons should be interactive. */
  disabledInteractive?: boolean;
}

/**
 * Injection token that can be used to configure the
 * default options for all button toggles within an app.
 */
export const CUTE_BUTTON_TOGGLE_DEFAULT_OPTIONS = new InjectionToken<CuteButtonToggleDefaultOptions>(
  'CUTE_BUTTON_TOGGLE_DEFAULT_OPTIONS',
  {
    providedIn: 'root',
    factory: () => ({
      hideSingleSelectionIndicator: false,
      hideMultipleSelectionIndicator: false,
      disabledInteractive: false,
    }),
  },
);

// Counter used to generate unique IDs.
let uniqueId = 0;

/** Change event object emitted by button toggle. */
export class CuteButtonToggleChange {
  constructor(
    /** The button toggle that emits the event. */
    public source: CuteButtonToggle,

    /** The value assigned to the button toggle. */
    public value: any,
  ) {}
}

/** Single toggle button that should be nested directly inside a toggle group.  */
@Component({
  selector: 'cute-button-toggle',
  templateUrl: '../../button/src/button.component.html',
  styleUrls: ['../../button/src/button.component.scss', './button-toggle.component.scss'],
  exportAs: 'cuteButtonToggle',
  host: {
    'class': 'cute-button-toggle',
    '[class.cute-button-toggle-standalone]': '!buttonToggleGroup',
    '[class.active]': 'checked',
    '[attr.aria-label]': 'null',
    '[attr.aria-labelledby]': 'null',
    '[attr.name]': 'null',
    '(focus)': 'focus()',
    '(click)': '_onButtonClick()',
    '[style.--bs-btn-hover-color]': "'var(--bs-'+toThemeColor(color)+'-text-emphasis)'",
    //'role': 'presentation',
  },
  providers:[
    { provide: CUTE_BUTTON_BASE, useExisting: CuteButtonToggle }
  ],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
})
export class CuteButtonToggle extends CuteButtonBase implements OnInit, OnDestroy {
  private _animationDisabled = _animationsDisabled();
  protected _multiple: boolean = true;
  /** The parent button toggle group (exclusive selection). Optional. */
  protected readonly buttonToggleGroup: CuteButtonToggleGroup;

  /** Unique ID for the underlying `button` element. */
  get buttonId(): string {
    return this.id ?? `cute-toggle-button-${uniqueId++}`;
  }

  override get inputButtonStyle(): Extract<CuteButtonStyle, "outlined"|"outline-button"> {
    return super.inputButtonStyle as Extract<CuteButtonStyle, "outlined"|"outline-button">;
  }
  override set inputButtonStyle(value: Extract<CuteButtonStyle, "outlined"|"outline-button">) {
    super.inputButtonStyle = value;
  }

  /** HTML's 'name' attribute used to group radios for unique selection. */
  @Input() name: string | undefined;

  /** CuteButtonToggleGroup reads this to assign its own value. */
  @Input() value: any;

  /** Whether ripples are disabled on the button toggle. */
  //@Input({transform: booleanAttribute}) disableRipple: boolean = false;

  /** Whether the button is checked. */
  @Input({transform: booleanAttribute})
  get checked(): boolean {
    return this.buttonToggleGroup ? this.buttonToggleGroup._isSelected(this) : this._checked;
  }
  set checked(value: boolean) {
    if (value !== this._checked) {
      this._checked = value;

      if (this.buttonToggleGroup) {
        this.buttonToggleGroup._syncButtonToggle(this, this._checked);
      }

      this.markForCheck();
    }
  }
  private _checked = false;

  /** Whether the button should remain interactive when it is disabled. */
  override get disabledInteractive(): boolean {
    return (super.disabledInteractive ||
            (this.buttonToggleGroup !== null && this.buttonToggleGroup.disabledInteractive)
    );
  }
  override set disabledInteractive(value: boolean) {
    super.disabledInteractive = value;
  }

  /** Event emitted when the group value changes. */
  @Output() readonly change = new EventEmitter<CuteButtonToggleChange>();

  /** Whether the button is disabled. */
  // protected override getDisabledState(): boolean {
  //   const isDisabled = super.getDisabledState();
  //   return isDisabled || (this.buttonToggleGroup && this.buttonToggleGroup.disabled);
  // }

  constructor(...args: unknown[]);
  constructor() {
    super();

    const toggleGroup = inject<CuteButtonToggleGroup>(CUTE_BUTTON_TOGGLE_GROUP, {optional: true})!;
    //const defaultTabIndex = inject(new HostAttributeToken('tabindex'), {optional: true}) || '';
    const defaultOptions = inject<CuteButtonToggleDefaultOptions>(
      CUTE_BUTTON_TOGGLE_DEFAULT_OPTIONS,
      {optional: true},
    );

    //this._tabIndex = parseInt(defaultTabIndex) || 0;
    this.buttonToggleGroup = toggleGroup;
    this.disabledInteractive = defaultOptions?.disabledInteractive ?? false;
  }

  override ngOnInit() {
    super.ngOnInit();

    const group = this.buttonToggleGroup;
    this.id = this.id || `cute-button-toggle-${uniqueId++}`;

    if (group) {

      if (!this.color) {
        this.defaultColor = group.color;
      }

      if (group._isPrechecked(this)) {
        this.checked = true;
      } else if (group._isSelected(this) !== this._checked) {
        // As a side effect of the circular dependency between the toggle group and the button,
        // we may end up in a state where the button is supposed to be checked on init, but it
        // isn't, because the checked value was assigned too early. This can happen when Ivy
        // assigns the static input value before the `ngOnInit` has run.
        group._syncButtonToggle(this, this._checked);
      }
    }
  }

  /*
  override ngAfterViewInit() {
    super.ngAfterViewInit();
    // This serves two purposes:
    // 1. We don't want the animation to fire on the first render for pre-checked toggles so we
    //    delay adding the class until the view is rendered.
    // 2. We don't want animation if the `NoopAnimationsModule` is provided.
    //if (this._animationMode !== 'NoopAnimations') {
    //  this._elementRef.nativeElement.classList.add('mat-button-toggle-animations-enabled');
    //}

    this._focusMonitor.monitor(this._elementRef, true);
  }
*/

  override ngOnDestroy() {
    super.ngOnDestroy();

    const group = this.buttonToggleGroup;

    // Remove the toggle from the selection once it's destroyed. Needs to happen
    // on the next tick to avoid "changed after checked" errors.
    if (group && group._isSelected(this)) {
      group._syncButtonToggle(this, false, false, true);
    }
  }

  /** Checks the button toggle due to an interaction with the underlying native button. */
  _onButtonClick() {
    if (this.disabled) {
      return;
    }

    const newChecked = this.isSingleSelector() ? true : !this._checked;

    if (newChecked !== this._checked) {
      this._checked = newChecked;
      if (this.buttonToggleGroup) {
        this.buttonToggleGroup._syncButtonToggle(this, this._checked, true);
        this.buttonToggleGroup._onTouched();
      }
    }

    if (this.isSingleSelector()) {
      const focusable = this.buttonToggleGroup._buttonToggles?.find(toggle => {
        return toggle.tabIndex === 0;
      });
      // Modify the tabindex attribute of the last focusable button toggle to -1.
      if (focusable) {
        focusable.tabIndex = -1;
      }
      // Modify the tabindex attribute of the presently selected button toggle to 0.
      this.tabIndex = 0;
    }

    // Emit a change event when it's the single selector
    this.change.emit(new CuteButtonToggleChange(this, this.value));
  }

  /** Gets the name that should be assigned to the inner DOM node. */
  protected _getButtonName(): string | null {
    if (this.isSingleSelector()) {
      return this.buttonToggleGroup.name;
    }
    return this.name || null;
  }

  /** Whether the toggle is in single selection mode. */
  private isSingleSelector(): boolean {
    return this.buttonToggleGroup && !this.buttonToggleGroup.multiple;
  }

  protected readonly toThemeColor = toThemeColor;
}
