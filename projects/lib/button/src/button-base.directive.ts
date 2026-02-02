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
  Directive,
  inject,
  Input,
  NgZone,
  HostBinding,
  InjectionToken,
  ContentChildren,
  QueryList,
  booleanAttribute, DoCheck,
} from "@angular/core";
import {CuteFocusableControl} from "@cute-widgets/base/abstract";
import {CuteIcon} from "@cute-widgets/base/icon";
import {RelativeSize7, ThemeColor} from "@cute-widgets/base/core";
import {Ripple, RippleManager, RippleOptions} from "@cute-widgets/base/core/ripple";
import {fromEvent, Subject} from "rxjs";
import {takeUntil} from "rxjs/operators";
import {toColorCssClass, toThemeColor} from "@cute-widgets/base/core";
import {BooleanInput, coerceBooleanProperty} from '@angular/cdk/coercion';
import {CUTE_BUTTON_GROUP} from './button-group.directive';

/** Button's appearance style */
export type CuteButtonStyle =
  "base-button"
  |"flat-button"
  |"outline-button"
  |"raised-button"
  |"pill-button"
  |"circle-button"
  |"close-button"
  |"icon-button"
  |"fab-button"
  /** Appearance styles for Angular Material compatibility */
  |"text"
  |"filled"
  |"elevated"
  |"outlined"
  |"tonal";


/** Object that can be used to configure the default options for the button component. */
export interface CuteButtonConfig {
  /** Whether disabled buttons should be interactive. */
  disabledInteractive?: boolean;

  /** Default palette color to apply to buttons. */
  color?: ThemeColor;

  /** Whether to enable text wrapping. */
  wrapText?: boolean;
}

/** Injection token that can be used to provide the default options the button component. */
export const CUTE_BUTTON_CONFIG = new InjectionToken<CuteButtonConfig>('CUTE_BUTTON_CONFIG');

/**
 * Injection token that can be used to reference instances of `CuteButtonBase`.
 * It serves as an alternative token to the actual `CuteButtonBase` class, which
 * could cause unnecessary retention of the class and its component metadata.
 */
export const CUTE_BUTTON_BASE = new InjectionToken<CuteButtonBase>(
    'CuteButtonBase'
);


@Directive({
    host: {
      class: 'btn',
      '[attr.magnitude]': 'magnitude',
      '[style.--bs-focus-ring-color]': 'color? "rgba(var("+bsColorVarName+"), var(--bs-focus-ring-opacity))" : "var(--bs-border-color-translucent)"',
      '(keydown)': '_haltDisabledEvents($event)',
    }
})
export abstract class CuteButtonBase extends CuteFocusableControl implements DoCheck {

  private _cleanupClick: (() => void) | undefined;
  private _destroyed$ = new Subject<void>()

  protected readonly _ripple: Ripple;
  protected readonly _ngZone: NgZone = inject(NgZone);
  protected readonly _group = inject(CUTE_BUTTON_GROUP, {optional: true, host: true});
  protected readonly _isAnchor: boolean = false;

  @ContentChildren(CuteIcon) private _icons: QueryList<CuteIcon> | undefined;

  /** Button's appearance style in the following format: `{style}-button`. */
  @Input("cuteButton") //, transform: (v: any): ButtonStyle=>{return !v ? "base-button" : v}})
  get inputButtonStyle(): CuteButtonStyle {return this._inputButtonStyle;}
  set inputButtonStyle(value: CuteButtonStyle | undefined | "") {
    this._inputButtonStyle = value || "base-button";

    // Transform Angular Material's style
    switch (this._inputButtonStyle) {
      case "text":      this._inputButtonStyle = "base-button"; break;
      case "elevated":  this._inputButtonStyle = "raised-button"; break;
      case "outlined":  this._inputButtonStyle = "outline-button"; break;
      case "filled":    this._inputButtonStyle = "flat-button"; break;
      case "tonal":     this._inputButtonStyle = "flat-button"; break;
    }

    const dashPos = this._inputButtonStyle.lastIndexOf("-");
    if (dashPos >= 0) {
      // Format: {style}-button
      this._buttonStyle = this._inputButtonStyle.substring(0, dashPos).trim().toLowerCase() || "base";
    } else {
      this._buttonStyle = this._inputButtonStyle;
    }
  }
  private _inputButtonStyle: CuteButtonStyle = "base-button";
  private _buttonStyle: string = "base";

  /** Relative size of the Button. */
  @Input() magnitude: RelativeSize7 | undefined;

  /** Whether to enable text wrapping. */
  @Input({transform: booleanAttribute})
  wrapText: boolean = false;

  /** Whether to disable the ripple effect on button clicking. */
  @Input()
  get disableRipple(): boolean {return this._ripple.disabled}
  set disableRipple(value: boolean) { this._ripple.disabled = value; }

  /** `aria-disabled` value of the button. */
  @Input({transform: booleanAttribute, alias: 'aria-disabled'})
  ariaDisabled: boolean | undefined;

  /** Whether to show the collapse/expand indicator based on the `aria-expanded` current value. */
  @Input({transform: booleanAttribute})
  withAriaExpandedIndicator: boolean = false;

  /**
   * Natively disabled buttons prevent focus and any pointer events from reaching the button.
   * In some scenarios, this might not be desirable, because it can prevent users from finding out
   * why the button is disabled (e.g., via tooltip).
   *
   * Enabling this input will change the button so that it is styled to be disabled and will be
   * marked as `aria-disabled`, but it will allow the button to receive events and focus.
   *
   * Note that by enabling this, you need to set the `tabindex` yourself if the button isn't
   * meant to be tabbable, and you have to prevent the button action (e.g., form submissions).
   */
  @Input({transform: booleanAttribute})
  get disabledInteractive(): boolean | undefined      {return this._disabledInteractive;}
  set disabledInteractive(value: boolean | undefined) {this._disabledInteractive = value;}
  private _disabledInteractive: boolean | undefined;

  /** Label text that applied for visually hidden button */
  @Input()
  visuallyHiddenLabel: string | undefined;

  @HostBinding("class")
  protected get classNames(): string {
    let classes = "cute-"+this._inputButtonStyle; // e.g. `cute-outline-button`
    if (this.color) {
      classes += ["base","close","icon"].indexOf(this.buttonStyle)==-1
        ? " btn-"+(this.buttonStyle=="outline" ? "outline-" : "") + toThemeColor(this.color)
        : this.buttonStyle=="base"
          ? (" " + (this.color=="link" ? "btn-link" : toColorCssClass(this.color)))
          : "";
    }
    return classes;
  }

  /** Focus shadow color for `close-button` */
  @HostBinding("style.--bs-btn-close-focus-shadow")
  protected get _closeButtonShadowColor(): string {
    return (this.color && this.buttonStyle == "close") ? "0 0 0 0.25rem rgba(var(--bs-"+this.color+"-rgb), 0.25)" : "";
  }

  @HostBinding("class.cute-btn-xxl")
  protected get buttonLargestBinding(): boolean {return this.magnitude == "largest"}
  @HostBinding("class.cute-btn-xl")
  protected get buttonLargerBinding(): boolean {return this.magnitude == "larger"}
  @HostBinding("class.btn-lg")
  protected get buttonLargeBinding(): boolean {return this.magnitude == "large"}
  @HostBinding("class.btn-sm")
  protected get buttonSmallBinding(): boolean {return this.magnitude == "small"}
  @HostBinding("class.cute-btn-xs")
  protected get buttonSmallerBinding(): boolean {return this.magnitude == "smaller"}
  @HostBinding("class.cute-btn-xxs")
  protected get buttonSmallestBinding(): boolean {return this.magnitude == "smallest"}

  @HostBinding("style.--cute-icon-button-color-rgb")
  protected get iconButtonColorBinding(): string {
    return this.buttonStyle=="icon" ? "var("+(this.color ? this.bsColorVarName : "--bs-body-color-rgb")+")" : "";
  }
  @HostBinding("style.--cute-base-button-color-rgb")
  protected get baseButtonColorBinding(): string {
    return this.buttonStyle=="base" ? "var("+(this.color ? this.bsColorVarName : "--bs-body-color-rgb")+")" : "";
  }

  /** Returns button style name. */
  get buttonStyle(): string {
    return this._buttonStyle;
  }

  protected get bsColorVarName(): string {
    if (this.color) {
      if (this.color=="link") {
        return `--bs-${this.color}-color-rgb`;
      }
      return `--bs-${this.color}-rgb`;
    }
    return "";
  }

  protected constructor(...args: unknown[]);
  protected constructor() {
    super();
    const config = inject(CUTE_BUTTON_CONFIG, {optional: true});
    this.disabledInteractive = config?.disabledInteractive ?? false;
    this.wrapText = config?.wrapText ?? false;
    this._ripple = RippleManager.getInstance(this._nativeElement);

    this._isAnchor = (this._nativeElement.tagName == "A");
  }

  protected override generateId(): string {
    return ""; // `cute-button-${++nextUniqueId}`;
  }

  protected _getTabIndex() {
    if (this._isAnchor) {
      return this.disabled && !this.disabledInteractive ? -1 : this.tabIndex;
    }
    return this.tabIndex;
  }

  private _setupAsAnchor() {
    this._cleanupClick = this._ngZone.runOutsideAngular(() =>
      this._renderer.listen(this._nativeElement, 'click', (event: Event) => {
        if (this.disabled) {
          event.preventDefault();
          event.stopImmediatePropagation();
        }
      }),
    );
  }

  protected override setDisabledState(newState: BooleanInput): boolean {
    if (this._isAnchor) {
      const isDisabled = coerceBooleanProperty(newState);
      if (isDisabled) {
        this._savedTabIndex = this.tabIndex;
        this.tabIndex = -1;
      } else {
        this.tabIndex = this._savedTabIndex;
      }
    }
    return super.setDisabledState(newState);
  }
  private _savedTabIndex: number|undefined;

  protected _getAriaDisabled() {
    if (this.ariaDisabled != null) {
      return this.ariaDisabled;
    }
    if (this._isAnchor) {
      return this.disabled || null;
    }
    return this.disabled && this.disabledInteractive ? true : null;
  }

  protected _getDisabledAttribute() {
    //return this.disabledInteractive || !this.disabled ? null : true;
    return this.disabled ? true : null;
  }

  protected _haltDisabledEvents (event: Event): void {
    // A disabled button shouldn't apply any actions
    if (this.disabled && (this.disabledInteractive || this._isAnchor)) {
      event.preventDefault();
      event.stopImmediatePropagation();
    }
  };

  /** Whether to apply a `focus-ring` css-class to the button when it focused via keyboard interaction */
  protected get displayFocusRing(): boolean {
    return this.buttonStyle == "base" && this.hasClass("cdk-keyboard-focused");
  }

  override ngOnInit() {
    super.ngOnInit();

    this._focusMonitor.monitor(this._elementRef, true);

    ["mousedown", "mouseup", "click"].forEach((type) => {
      fromEvent<MouseEvent>(this._nativeElement, type, { capture: true })
        .pipe(takeUntil(this._destroyed$))
        .subscribe((ev)=> this._onMouseEvent(ev));
    });
  }

  override ngAfterContentInit() {
    super.ngAfterContentInit();

    if (this._icons && this.buttonStyle == "icon") {
     this._icons.forEach(icon => {icon.defaultColor = this.color;});
    }
  }

  override ngAfterViewInit() {
    super.ngAfterViewInit();

    // Some internal tests depend on the timing of this,
    // otherwise we could bind it in the constructor.
    if (this._isAnchor) {
      this._setupAsAnchor();
    }
  }

  ngDoCheck() {
    // This line was added due to "Expression Changed After Checked..." error raised if we place it in the @HostBinding
    this.toggleClass("focus-ring", this.displayFocusRing);
  }

  override ngOnDestroy() {
    super.ngOnDestroy();
    this._cleanupClick?.();
    this._ripple.stop();
    this._destroyed$.next();
    this._destroyed$.complete();
  }

  /** mouse events handler */
  private _onMouseEvent(event: MouseEvent) {

    this._haltDisabledEvents(event);

    if (!event.defaultPrevented && event.type == "mousedown") {
      this._launchRipple(event);
    }
  }

  private _launchRipple(event: MouseEvent): void {
    if (this._ripple && !this._ripple.disabled) {
      const options: RippleOptions = {};
      if (this.buttonStyle == "icon") {
        options.centered = true;
        options.color = "rgba(var(--cute-icon-button-color), 0.25)";
      }
      this._ripple.launch(event, options);
    }
  }

}
