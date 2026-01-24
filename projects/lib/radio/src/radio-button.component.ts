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
  afterNextRender,
  booleanAttribute,
  ChangeDetectionStrategy,
  Component, DestroyRef,
  DoCheck, ElementRef, EventEmitter,
  inject,
  InjectionToken, Injector, Input, NgZone,
  Output, ViewChild, ViewEncapsulation
} from "@angular/core";
import {FocusOrigin} from "@angular/cdk/a11y";
import {UniqueSelectionDispatcher} from "@angular/cdk/collections";
import {ThemeColor} from "@cute-widgets/base/core";
import {CuteInputControl} from "@cute-widgets/base/abstract";
import {CUTE_RADIO_GROUP, CuteRadioGroup} from "./radio-group.directive";
import {takeUntilDestroyed} from "@angular/core/rxjs-interop";
import {RelativeSize} from "@cute-widgets/base/core";

// Increasing integer for generating unique ids for checkbox components.
let nextUniqueId = 0;

/** Change an event object emitted by radio button and radio group. */
export class CuteRadioChange<T=any> {
  constructor(
    /** The radio button that emits the change event. */
    public source: CuteRadioButton,
    /** The value of the radio button. */
    public value: T,
  ) {}
}

export interface CuteRadioDefaultOptions {
  color: ThemeColor;
  /** Whether disabled radio buttons should be interactive. */
  disabledInteractive?: boolean;
}

export const CUTE_RADIO_DEFAULT_OPTIONS = new InjectionToken<CuteRadioDefaultOptions>(
  'cute-radio-default-options',
  {
    providedIn: 'root',
    factory: () => ({
      color: "primary",
      disabledInteractive: false,
    }),
  },
);

@Component({
  selector: 'cute-radio-button',
  templateUrl: './radio-button.component.html',
  styleUrls: ['./radio-button.component.scss'],
  exportAs: 'cuteRadioButton',
  host: {
    'class': 'cute-radio-button',
    '[class.cute-radio-checked]': 'checked',
    '[class.cute-radio-disabled]': 'disabled',
    '[class.cute-radio-disabled-interactive]': 'disabledInteractive',
    '[attr.id]': 'id',
    // Needs to be removed since it causes some a11y issues (see #21266).
    '[attr.tabindex]': 'null',
    '[attr.aria-label]': 'null',
    '[attr.aria-labelledby]': 'null',
    '[attr.role]': 'null',
    // Note: under normal conditions focus shouldn't land on this element, however, it may be
    // programmatically set, for example, inside a focus trap, in this case we want to forward
    // the focus to the native element.
    '(focus)': '_inputElement?.nativeElement.focus()',
  },
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CuteRadioButton extends CuteInputControl implements DoCheck {

  private _ngZone = inject(NgZone);
  private _injector = inject(Injector);
  private readonly _radioDispatcher: UniqueSelectionDispatcher = inject(UniqueSelectionDispatcher);
  private _defaultOptions = inject<CuteRadioDefaultOptions>(CUTE_RADIO_DEFAULT_OPTIONS, {
    optional: true,
  });

  private _cleanupClick: (() => void) | undefined;

  /** The parent radio group. May or may not be present. */
  private readonly radioGroup: CuteRadioGroup | null;
  /** Unregister function for _radioDispatcher */
  private _removeUniqueSelectionListener: () => void = () => {};
  /** Previous value of the input's tabindex. */
  private _previousTabIndex: number | undefined;

  /** The native `<input type=radio>` element */
  @ViewChild('input')
  readonly _inputElement: ElementRef<HTMLInputElement> | undefined;

  /** Whether this radio button is checked. */
  @Input({transform: booleanAttribute})
  get checked(): boolean { return this._checked; }
  set checked(value: boolean) {
    if (this._checked !== value) {
      this._checked = value;
      if (value && this.radioGroup && this.radioGroup.value !== this.value) {
        this.radioGroup.selected = this;
      } else if (!value && this.radioGroup && this.radioGroup.value === this.value) {
        // When unchecking the selected radio button, update the selected radio
        // property on the group.
        this.radioGroup.selected = null;
      }

      if (value) {
        // Notify all radio buttons with the same name to uncheck.
        this._radioDispatcher.notify(this.id || "", this.name || "");
      }
      this.markForCheck();
    }
  }
  private _checked: boolean = false;

  /** Group radios on the same horizontal row */
  @Input({transform: booleanAttribute}) inline: boolean = false;

  /** Whether the label should appear after or before the radio button. Defaults to 'after' */
  @Input()
  get labelPosition(): 'before' | 'after' {
    return this._labelPosition || (this.radioGroup && this.radioGroup.labelPosition) || 'after';
  }
  set labelPosition(value) {
    this._labelPosition = value;
  }
  private _labelPosition: 'before' | 'after' = 'after';

  /** The value of this radio button. */
  @Input()
  override get value(): any {return this._value;}
  override set value(value: any) {
    if (this._value !== value) {
      this._value = value;
      if (this.radioGroup !== null) {
        if (!this.checked) {
          // Update checked when the value changed to match the radio group's value
          this.checked = this.radioGroup.value === value;
        }
        if (this.checked) {
          this.radioGroup.selected = this;
        }
      }
    }
  }
  private _value: any;

  /** Whether the radio button should remain interactive when it is disabled. */
  @Input({transform: booleanAttribute})
  get disabledInteractive(): boolean {
    return (
      this._disabledInteractive || (this.radioGroup !== null && this.radioGroup.disabledInteractive)
    );
  }
  set disabledInteractive(value: boolean) {
    this._disabledInteractive = value;
  }
  private _disabledInteractive: boolean = false;

  /** Relative size of the radio icon. */
  @Input() iconSize: RelativeSize = "middle";

  /**
   * Event emitted when the checked state of this radio button changes.
   * Change events are only emitted when the value changes due to user interaction with
   * the radio button (the same behavior as `<input type-"radio">`).
   */
  @Output()
  readonly change: EventEmitter<CuteRadioChange> = new EventEmitter<CuteRadioChange>();

  override generateId(): string {
    return `cute-radio-button-${++nextUniqueId}`;
  }

  constructor(...args: unknown[]);
  constructor() {
    super();

    const radioGroup = inject<CuteRadioGroup>(CUTE_RADIO_GROUP, {optional: true});

    // Assertions. Ideally these should be stripped out by the compiler.
    // TODO(jelbourn): Assert that there's no name binding AND a parent radio group.
    this.radioGroup = radioGroup;
    this._disabledInteractive = this._defaultOptions?.disabledInteractive ?? false;
  }

  /** Focuses the radio button. */
  override focus(origin?: FocusOrigin, options?: FocusOptions): void {
    if (this._inputElement) {
      if (origin) {
        this._focusMonitor.focusVia(this._inputElement, origin, options);
      } else {
        this._inputElement.nativeElement.focus(options);
      }
    }
  }

  /**
   * Marks the radio button as needing checking for change detection.
   * This method is exposed because the parent radio group will directly
   * update bound properties of the radio button.
   */
  _markForCheck() {
    // When group value changes, the button will not be notified.
    // Use `markForCheck` to explicitly update radio button's status.
    this.markForCheck();
  }

  override ngOnInit() {
    super.ngOnInit();
    if (this.radioGroup) {
      // If the radio is inside a radio group, determine if it should be checked
      this.checked = this.radioGroup.value === this.value;

      if (this.checked) {
        this.radioGroup.selected = this;
      }

      // Copy name from a parent radio group
      this.name = this.radioGroup.name;
    }

    this._removeUniqueSelectionListener = this._radioDispatcher.listen((id, name) => {
      if (id !== this.id && name === this.name) {
        this.checked = false;
      }
    });
  }

  ngDoCheck(): void {
    this._updateTabIndex();
  }

  override ngAfterViewInit() {
    super.ngAfterViewInit();
    this._updateTabIndex();
    this._focusMonitor.monitor(this._elementRef, true)
      .pipe(takeUntilDestroyed(this._destroyRef))
      .subscribe(focusOrigin => {
        if (!focusOrigin && this.radioGroup) {
          this.radioGroup._touch();
        }
      });

    // We bind this outside of the zone, because:
    // 1. Its logic is completely DOM-related so we can avoid some change detections.
    // 2. There appear to be some internal tests that break when this triggers a change detection.
    this._ngZone.runOutsideAngular(() => {
      if (this._inputElement) {
        this._cleanupClick = this._renderer.listen(
          this._inputElement.nativeElement,
          'click',
          this._onInputClick,
        );
      }
    });
  }

  override ngOnDestroy() {
    super.ngOnDestroy();
    this._cleanupClick?.();
    this._removeUniqueSelectionListener();
  }

  /** Dispatch change event with current value. */
  private _emitChangeEvent(): void {
    this.change.emit(new CuteRadioChange(this, this.value));
  }

  protected _preventBubblingFromLabel(event: Event) {
    // We have to stop propagation for click events on the visual hidden input element.
    // By default, when a user clicks on a label element, a generated click event will be
    // dispatched on the associated input element. Since we are using a label element as our
    // root container, the click event on the `radio-button` will be executed twice.
    // The real click event will bubble up, and the generated click event also tries to bubble up.
    // This will lead to multiple click events.
    // Preventing bubbling for the second event will solve that issue.
    event.stopPropagation();
  }

  /** Triggered when the radio button receives an interaction from the user. */
  _onInputInteraction(event: Event) {
    // We always have to stop propagation on the change event.
    // Otherwise, the change event, from the input element, will bubble up and
    // emit its event object to the `change` output.
    event.stopPropagation();

    if (!this.checked && !this.disabled) {
      const groupValueChanged = this.radioGroup && this.value !== this.radioGroup.value;
      this.checked = true;
      this._emitChangeEvent();

      if (this.radioGroup) {
        this.radioGroup._controlValueAccessorChangeFn(this.value);
        if (groupValueChanged) {
          this.radioGroup._emitChangeEvent();
        }
      }
    }
  }

  /** Triggered when the user clicks on the touch target. */
  _onTouchTargetClick(event: Event) {
    this._onInputInteraction(event);

    if (!this.disabled || this.disabledInteractive) {
      // Normally, the input should be focused already, but if the click
      // comes from the touch target, then we might have to focus it ourselves.
      this._inputElement?.nativeElement.focus();
    }
  }

  /** Called when the input is clicked. */
  private _onInputClick = (event: Event) => {
    // If the input is disabled while interactive, we need to prevent the
    // selection from happening in this event handler. Note that even though
    // this happens on `click` events, the logic applies when the user is
    // navigating with the keyboard as well. An alternative way of doing
    // this is by resetting the `checked` state in the `change` callback but
    // it isn't optimal, because it can allow a pre-checked disabled button
    // to be un-checked. This approach seems to cover everything.
    if (this.disabled && this.disabledInteractive) {
      event.preventDefault();
    }
  };

  /** Gets the tabindex for the underlying input element. */
  private _updateTabIndex() {
    const group = this.radioGroup;
    let value: number;

    // Implement a roving tabindex if the button is inside a group. For most cases, this isn't
    // necessary. The browser handles the tab order for inputs inside a group automatically,
    // but we need an explicitly higher tabindex for the selected button in order for things like
    // the focus trap to pick it up correctly.
    if (!group || !group.selected || this.disabled) {
      value = this.tabIndex || 0;
    } else {
      value = group.selected === this ? this.tabIndex || 0 : -1;
    }

    if (value !== this._previousTabIndex) {
      // We have to set the tabindex directly on the DOM node, because it depends on
      // the selected state which is prone to "changed after checked errors".
      const input: HTMLInputElement | undefined = this._inputElement?.nativeElement;

      if (input) {
        input.setAttribute('tabindex', value + '');
        this._previousTabIndex = value;
      }

      // Wait for any pending tabindex changes to be applied
      afterNextRender(
        () => {
          queueMicrotask(() => {
            // The radio group uses a "selection follows focus" pattern for tab management, so if this
            // radio button is currently focused and another radio button in the group becomes
            // selected, we should move focus to the newly selected radio button to maintain
            // consistency between the focused and selected states.
            if (
              group &&
              group.selected &&
              group.selected !== this &&
              document.activeElement === input
            ) {
              group.selected._inputElement?.nativeElement.focus();
              // If this radio button still has focus, the selected one must be disabled. In this
              // case the radio group as a whole should lose focus.
              if (document.activeElement === input) {
                this._inputElement?.nativeElement.blur();
              }
            }
          });
        },
        {injector: this._injector},
      );

    }
  }

  override writeValue(obj: any): void {
    this.value = obj;
    this.markForCheck();
  }

}
