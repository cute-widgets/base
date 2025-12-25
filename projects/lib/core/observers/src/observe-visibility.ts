/**
 * @license Apache-2.0
 *
 * Copyright (c) 2025 CuteWidgets Team. All Rights Reserved.
 *
 * You may not use this file except in compliance with the License
 * that can be found at http://www.apache.org/licenses/LICENSE-2.0
 */

import {coerceNumberProperty, coerceElement} from '@angular/cdk/coercion';
import {
  AfterContentInit,
  Directive,
  ElementRef,
  EventEmitter,
  Injectable,
  Input,
  OnDestroy,
  Output,
  booleanAttribute, InjectionToken, numberAttribute, inject,
} from '@angular/core';
import {Observable, Subject, Subscription, Observer, EMPTY} from 'rxjs';
import {debounceTime} from 'rxjs/operators';

export const CUTE_VISIBILITY_OBSERVER_OPTIONS = new InjectionToken<IntersectionObserverInit>("CUTE_VISIBILITY_OBSERVER_OPTIONS");

/**
 * Factory service that creates a new IntersectionObserver and allows us to stub it out in unit tests.
 */
@Injectable({providedIn: 'root'})
export class IntersectionObserverFactory {
  private _injectedOptions: IntersectionObserverInit|null = inject(CUTE_VISIBILITY_OBSERVER_OPTIONS, {optional: true});
  private readonly _defaultOptions: IntersectionObserverInit|null;

  constructor(...args: unknown[]);
  constructor () {

    this._defaultOptions = this._injectedOptions ? {...this._injectedOptions} : null;

    const root = this._defaultOptions?.root;
    if (root && root instanceof Element && getComputedStyle(root).overflowY === "visible") {
      this._defaultOptions!.root = null;
    }
  }

  /** `IntersectionObserver` factory method. Returns _null_ if the API is not supported. */
  createInstance(callback: IntersectionObserverCallback, options?: IntersectionObserverInit): IntersectionObserver | null {
    const observerOptions: IntersectionObserverInit = {
      root: options?.root ?? this._defaultOptions?.root,
      rootMargin: options?.rootMargin ?? this._defaultOptions?.rootMargin,
      threshold: options?.threshold ?? this._defaultOptions?.threshold,
    };
    return typeof IntersectionObserver === 'undefined' ? null : new IntersectionObserver(callback, observerOptions);
  }
}

/**
 * An injectable service that allows watching elements for visibility changes.
 */
@Injectable({providedIn: 'root'})
export class CuteVisibilityObserver implements OnDestroy {
  private _intersectionObserverFactory = inject(IntersectionObserverFactory, {optional: true});

  /** Keeps track of the existing IntersectionObservers, so they can be reused. */
  private _observedElements = new Map<
    Element,
    {
      observer: IntersectionObserver | null;
      readonly stream: Subject<IntersectionObserverEntry[]>;
      count: number;
    }
  >();

  constructor() {}

  ngOnDestroy() {
    this._observedElements.forEach((_, element) => this._cleanupObserver(element));
  }

  /**
   * Observe visibility changes on an element.
   * @param element The element to observe for visibility changes.
   * @param options Options to customize the observer
   * @returns Observable object
   */
  observe(element: Element, options?: IntersectionObserverInit): Observable<IntersectionObserverEntry[]>;
  /**
   * Observe visibility changes on an element.
   * @param element The element to observe for visibility changes.
   * @param options Options to customize the observer
   * @returns Observable object
   */
  observe(element: ElementRef<Element>, options?: IntersectionObserverInit): Observable<IntersectionObserverEntry[]>;
  observe(elementOrRef: Element | ElementRef<Element>, options?: IntersectionObserverInit): Observable<IntersectionObserverEntry[]> {
    const element = coerceElement(elementOrRef);

    return new Observable((observer: Observer<IntersectionObserverEntry[]>) => {
      const stream = this._observeElement(element, options);
      const subscription = stream.subscribe(observer);

      return () => {
        subscription.unsubscribe();
        this._unobserveElement(element);
      };
    });
  }

  /**
   * Observes the given element by using the existing IntersectionObserver if available, or creating a
   * new one if not.
   */
  private _observeElement(element: Element, options?: IntersectionObserverInit): Observable<IntersectionObserverEntry[]> {
    if (this._intersectionObserverFactory) {
      if (!this._observedElements.has(element)) {
        const stream = new Subject<IntersectionObserverEntry[]>();
        const observer = this._intersectionObserverFactory.createInstance(entries => stream.next(entries), options);
        if (observer) {
          observer.observe(element);
        }
        this._observedElements.set(element, {observer, stream, count: 1});
      } else {
        this._observedElements.get(element)!.count++;
      }
      return this._observedElements.get(element)!.stream;
    }
    return EMPTY;
  }

  /**
   * Un-observes the given element and cleans up the underlying IntersectionObserver if nobody else is
   * observing this element.
   */
  private _unobserveElement(element: Element) {
    if (this._observedElements.has(element)) {
      this._observedElements.get(element)!.count--;
      if (!this._observedElements.get(element)!.count) {
        this._cleanupObserver(element);
      }
    }
  }

  /** Clean up the underlying IntersectionObserver for the specified element. */
  private _cleanupObserver(element: Element) {
    if (this._observedElements.has(element)) {
      const {observer, stream} = this._observedElements.get(element)!;
      if (observer) {
        observer.disconnect();
      }
      stream.complete();
      this._observedElements.delete(element);
    }
  }
}

/**
 * Directive that triggers intersection event whenever the visibility of its associated element has changed
 * relative to the specified root element. The root element must be the ancestor of the directive's element.
 * Keep in mind that each directive's element will have its own instance of the `IntersectionObserver` class.
 */
@Directive({
  selector: '[cuteObserveVisibility], [cute-observe-visibility]',
  exportAs: 'cuteObserveVisibility',
  standalone: true,
})
export class CuteObserveVisibility implements AfterContentInit, OnDestroy {
  private _visibilityObserver = inject(CuteVisibilityObserver);
  private _elementRef: ElementRef<Element> = inject(ElementRef);

  private _currentSubscription: Subscription | null = null;

  /** Event emitted for each intersection change between directive's and root elements. */
  @Output('cuteObserveVisibility') readonly intersectionChange = new EventEmitter<IntersectionObserverEntry[]>();

  /**
   * Whether observing visibility is disabled. This option can be used
   * to disconnect the underlying IntersectionObserver until it is needed.
   */
  @Input({alias: 'cuteObserveVisibilityDisabled', transform: booleanAttribute})
  get disabled(): boolean { return this._disabled; }
  set disabled(value: boolean) {
    if (value !== this._disabled) {
      this._disabled = value;
      this._disabled ? this._unsubscribe() : this._subscribe();
    }
  }
  private _disabled = false;

  /**
   * Debounce interval in milliseconds for emitting the visibility changes.
   * Default is without delay (0).
   */
  @Input({alias: "cuteObserveVisibilityDebounce", transform: numberAttribute})
  get debounce(): number { return this._debounce; }
  set debounce(value: number) {
    if (value !== this._debounce) {
      this._debounce = coerceNumberProperty(value);
      this._subscribe();
    }
  }
  private _debounce: number = 0;

  /**
   * A single number or an array of numbers which indicate at what percentage of the target's visibility
   * the observer's callback should be executed. Number(s) must be in range 0..1.
   * The default is 0 (meaning as soon as even one pixel is visible, the callback will be run).
   */
  @Input("cuteObserveVisibility")
  get threshold(): number|number[]|undefined {return this._threshold;}
  set threshold(value: number|number[]|undefined) {
    if (value !== this._threshold) {
      this._threshold = value;
      this._subscribe();
    }
  }
  private _threshold: number|number[]|undefined;

  /** Margin around the root. A string of one to four values similar to the CSS margin property, e.g., "10px 20px 30px 40px" (top, right, bottom, left).  */
  @Input("cuteObserveVisibilityRootMargin")
  get rootMargin(): number|string|undefined { return this._rootMargin; }
  set rootMargin(value: number|string|undefined) {
    if (value !== this._rootMargin) {
      if (typeof value === "number") {
        value = isNaN(value) ? undefined : Math.round(value)+"px";
      }
      this._rootMargin = value;
      this._subscribe();
    }
  }
  private _rootMargin: number|string|undefined;

  @Input("cuteObserveVisibilityRoot")
  get root(): Element|undefined { return this._root; }
  set root(value: Element|ElementRef|Document|undefined) {
    if (value !== this._root) {
      this._root = coerceElement(value);
      this._subscribe();
    }
  }
  private _root: Element|undefined;

  constructor(...args: unknown[]);
  constructor() {}

  private _subscribe() {
    this._unsubscribe();
    const options = {root: this.root, rootMargin: this.rootMargin, threshold: this.threshold} as IntersectionObserverInit;
    const stream = this._visibilityObserver.observe(this._elementRef, Object.getOwnPropertyNames(options).length > 0 ? options : undefined);

    this._currentSubscription = (
      this.debounce ? stream.pipe(debounceTime(this.debounce)) : stream
    ).subscribe(this.intersectionChange);
  }

  private _unsubscribe() {
    this._currentSubscription?.unsubscribe();
  }

  ngAfterContentInit() {
    if (!this._currentSubscription && !this.disabled) {
      this._subscribe();
    }
  }

  ngOnDestroy() {
    this._unsubscribe();
  }

}
