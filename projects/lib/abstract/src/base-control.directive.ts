/**
 * @license Apache-2.0
 *
 * Copyright (c) 2025 CuteWidgets Team. All Rights Reserved.
 *
 * You may not use this file except in compliance with the License
 * that can be found at http://www.apache.org/licenses/LICENSE-2.0
 */
import {
  Directive,
  ChangeDetectorRef,
  ElementRef,
  inject,
  Input,
  OnChanges,
  OnDestroy,
  SimpleChanges,
  Renderer2, AfterViewInit, OnInit, AfterContentInit, booleanAttribute, isDevMode, InjectionToken, DestroyRef,
} from '@angular/core';
import {BooleanInput, coerceBooleanProperty} from "@angular/cdk/coercion";
import {Observable, Subscriber} from "rxjs";
import {RichThemeColor} from "@cute-widgets/base/core";

export interface ThematicControl {
  /** Theme color palette for the component. */
  color: RichThemeColor | undefined;
  /** Adds a linear gradient as background image to the backgrounds. */
  gradientFill: boolean;
  /** Default color to fall back to if no value is set. */
  defaultColor: RichThemeColor | undefined;
}

export interface CuteWidget extends ThematicControl {
  id: string | undefined;
  role: string | undefined;
  element: Readonly<ElementRef<HTMLElement>>;
  owner: CuteWidget | null;
  disabled: boolean;
  tag: any;
  enable(): void;
  disable(): void;
  toggleDisabled(): void;
  hasClass(name: string): boolean;
  toggleClass(name: string, force?: boolean): boolean;
  getAttribute(name: string): string | null;
  setAttribute(name: string, value: string, namespace?: string | null | undefined): void;
  hasAttributes(...attributes: string[]): boolean;
  markForCheck(): void;
}

/** Widget's injection token */
export const CUTE_WIDGET = new InjectionToken<CuteWidget>("CUTE-WIDGET");

/**
 * This widget base class and each of its descendant should be used as a parent for classes decorated with `@Component`.
 * Attribute directives should not extend this class and its descendants to avoid property value conflicts.
 */
@Directive({
    host: {
        'class': 'cute-widget',
        '[class.cute-thematic-widget]': 'color',
        '[class.bg-gradient]': 'gradientFill',
    },
    providers: [{provide: CUTE_WIDGET, useExisting: CuteBaseControl}]
})
export abstract class CuteBaseControl
            implements CuteWidget, OnInit, AfterViewInit, AfterContentInit, OnChanges, OnDestroy
{
  private readonly _uniqueId:  string | undefined;

  protected readonly _elementRef: ElementRef<HTMLElement> = inject(ElementRef);
  protected readonly _changeDetectorRef: ChangeDetectorRef = inject(ChangeDetectorRef);
  protected readonly _renderer: Renderer2 = inject(Renderer2);
  protected readonly _destroyRef: DestroyRef = inject(DestroyRef);

  /** Owner widget */
  readonly owner = inject(CUTE_WIDGET, {skipSelf: true, optional: true})

  /**
   * A list of subscribers that subscribed before the directive was initialized.
   * Should be notified during markInitialized.
   * Set to null after pending subscribers are notified, and should
   * not expect to be populated after.
   */
  private _pendingSubscribers: Subscriber<void>[] | null = [];

  protected get _nativeElement(): HTMLElement {
    return this._elementRef.nativeElement;
  }

  /**
   * Marks the state as initialized and notifies pending subscribers. Should be called at the end
   * of ngOnInit.
   */
  protected _markInitialized(): void {
    if (this.isInitialized && isDevMode()) {
      throw Error('CuteBaseControl error:/r/n'
                           +'This directive has already been marked as initialized and '
                           +'should not be called twice.',
      );
    }

    this._isInitialized = true;

    if (this._pendingSubscribers != null) {
      this._pendingSubscribers.forEach(this._notifySubscriber);
      this._pendingSubscribers = null;
    }
  }

  /** Emits and completes the subscriber stream (should only emit once). */
  private _notifySubscriber(subscriber: Subscriber<void>): void {
    subscriber.next();
    subscriber.complete();
  }

  /**
   * Observable stream that emits when the directive initializes. If already initialized, the
   * subscriber is stored to be notified once _markInitialized is called.
   */
  readonly initialized$:Observable<void> = new Observable<void>(subscriber => {
    // If initialized, immediately notify the subscriber. Otherwise, store the subscriber to notify
    // when _markInitialized is called.
    if (this.isInitialized) {
      this._notifySubscriber(subscriber);
    } else {
      this._pendingSubscribers!.push(subscriber);
    }
  });

  /** Whether this directive has been marked as initialized. */
  get isInitialized(): boolean {
    return this._isInitialized;
  }
  private _isInitialized: boolean = false;

  /** Gets a reference to the `ElementRef` object */
  get element(): Readonly<ElementRef<HTMLElement>> {
    return this._elementRef;
  }

  /** The element's identifier */
  @Input()
  get id(): string|undefined {return this._id};
  set id(value: string|undefined) {this._id = value;}
  private _id: string | undefined;

  /** Default color, which is set when no value is set to the `color` property */
  @Input() defaultColor: RichThemeColor | undefined;

  /** Theme color palette for the component. */
  @Input()
  get color(): RichThemeColor|undefined { return this._color ?? this.defaultColor ?? this.owner?.color; }
  set color(value: RichThemeColor|undefined) { this.setColor(value); }
  private _color: RichThemeColor | undefined;

  /** Adds a linear gradient as a background image to the backgrounds */
  @Input({transform: booleanAttribute})
  gradientFill: boolean = false;

  /**
   * Makes the host element not mutable, focusable, or even submitted with the form
   */
  @Input({transform: booleanAttribute})
  get disabled(): boolean { return this.getDisabledState(); }
  set disabled(value: BooleanInput) {
    if (coerceBooleanProperty(value) !== this._disabled) {
      this.setDisabledState(value);
    }
  }
  private _disabled: boolean = false;

  /**
   * Attached to the aria-label attribute of the host element.In most cases, aria-labelledby will
   * take precedence so this may be omitted.
   */
  @Input('aria-label')
  ariaLabel: string | null = null;
  /**
   * Users can specify the `aria-labelledby` attribute which will be forwarded to the input element
   */
  @Input('aria-labelledby')
  ariaLabelledby: string | null = null;
  /**
   * The 'aria-describedby' attribute is read after the element's label and field type.
   */
  @Input('aria-describedby')
  ariaDescribedby: string | null = null;
  /**
   * The 'aria-description' attribute for the content of the element.
   */
  @Input('aria-description')
  ariaDescription: string | null = null;
  /**
   * Provides semantic meaning to content, allowing screen readers and other tools to present and
   * support interaction with an object
   */
  @Input()
  get role(): string | undefined {return this._role;}
  set role(value: string|undefined) {
    this._role = (typeof value == "string" ? value.trim().toLowerCase() : "") || undefined;
  }
  private _role: string | undefined;

  /** Any arbitrary user data */
  @Input()
  tag: any;

  /** Returns the unique id for the visual hidden input control */
  protected get inputId(): string {
    return `${this.id || this._uniqueId}-input`;
  }

  protected constructor() {
    const generatedId = this.generateId().trim();
    if (generatedId.length > 0) {
      this._id = this._uniqueId = generatedId;
    }
  }

  /**
   * Sets the type of mouse cursor using a keyword, or load a specific icon to use.
   * @param cursor A mouse cursor keyword or icon
   * @returns The current mouse cursor
   */
  // async setCursor(cursor: MouseCursor|string): Promise<MouseCursor|string> {
  //   const oldCursor = <MouseCursor> getComputedStyle(this._nativeElement).cursor;
  //   this._nativeElement.style.cursor = cursor;
  //   await yieldToMain();
  //   return oldCursor;
  // }

  /**
   * Whether the option is disabled. Can be overridden in descendant classes
   * @returns Current disabled state
   */
  protected getDisabledState(): boolean {
    return this._disabled;
  }

  /**
   * Changes the `disabled` status of the component. Can be overridden in descendant classes
   * @param newState New boolean for `disabled` state
   * @param emitEvent Emit state change event
   * @returns Change result
   */
  protected setDisabledState(newState: BooleanInput, emitEvent?: boolean): boolean {
    const coercedState = coerceBooleanProperty(newState);
    if (coercedState !== this.disabled) {
      this._disabled = coercedState;
      Promise.resolve().then(()=>this.markForCheck());
      return true;
    }
    return false;
  }

  /**
   * Sets a new color value. Can be overridden in descendant classes.
   * @param value New `ThemeColor` value
   * @returns Old color value
   */
  protected setColor(value: RichThemeColor | undefined): RichThemeColor | undefined {
    const oldColor = this._color;
    if (oldColor !== value) {
      this._color = value;
      this.markForCheck();
    }
    return oldColor;
  }

  /**
   * Returns an element's unique identifier that, if not empty, is assigned to `id` property as a default value.
   * Must be overridden in the descendant classes.
   * @abstract
   */
  protected abstract generateId(): string;

  /** Returns the root owner widget if it exists */
  getRootOwner(): CuteWidget | null {
    let root = this.owner;
    while (root) {
      root = root.owner;
    }
    return root;
  }

  /** Sets a property on a target element using the current Renderer implementation. */
  setProperty(key: string, value: unknown): void {
    this._renderer.setProperty(this._nativeElement, key, value);
  }
  /** Returns the value of a specified attribute on the component's host element. */
  getAttribute(name: string): string | null {
    return this._nativeElement.getAttribute(name);
  }
  /** Sets the value of an attribute on the component's host element */
  setAttribute(name: string, value: string, namespace?: string | null | undefined): void {
    this._renderer.setAttribute(this._nativeElement, name, value, namespace);
  }
  /** Gets whether the component has one of the given attributes. */
  hasAttributes(...attributes: string[]): boolean {
    return attributes.some(attribute => this._nativeElement.hasAttribute(attribute));
  }
  /** Adds a class to an element in the DOM. */
  addClass(name: string): void {
    this._renderer.addClass(this._nativeElement, name);
  }
  /** Removes a class from an element in the DOM. */
  removeClass(name: string): void {
    this._renderer.removeClass(this._nativeElement, name);
  }
  /** Returns a boolean value — _true_ if the element's class list contains the given token, otherwise _false_. */
  hasClass(name: string): boolean {
    return this._nativeElement.classList.contains(name);
  }
  /**
   * Adds a CSS class if it is not in the element's class list, otherwise remove it
   * @param name CSS class name
   * @param force If included, turns the toggle into a one way-only operation. If set to _false_, then the class name will only be removed, but not added. If set to _true_, then the class name will only be added, but not removed.
   */
  toggleClass(name: string, force?: boolean): boolean {
    return this._nativeElement.classList.toggle(name, force);
  }
  /**
   * Returns a boolean value indicating whether a _node_ is a descendant of the current node
   * @param node HTML element reference to test
   * @returns A boolean value that is `true` if _node_ is contained in the current node, `false` if not.
   * If the _node_ parameter is `null`, contains() always returns `false`.
   */
  contains(node: HTMLElement): boolean {
    return this._nativeElement.contains(node);
  }

  /** Enables the user interaction */
  enable(): void {
    this.disabled = false;
  }

  /** Disables the user interaction */
  disable(): void {
    this.disabled = true;
  }

  /** Explicitly marks the view as changed so that it can be checked again. */
  markForCheck(): void {
    this._changeDetectorRef.markForCheck();
  }
  
  /** Checks this view and its children. */
  detectChanges(): void {
    this._changeDetectorRef.detectChanges();
  }

  /** Toggles the `disabled` state of the component */
  toggleDisabled(): void {
    this.disabled = !this.disabled;
  }

  ngOnInit() {
    this._markInitialized();
  }

  ngAfterViewInit() {
  }

  ngAfterContentInit() {
  }

  ngOnChanges(changes: SimpleChanges): void {
  }

  ngOnDestroy(): void {
  }
}
