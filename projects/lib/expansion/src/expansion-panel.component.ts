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
import {CdkAccordionItem} from "@angular/cdk/accordion";
import {
  AfterContentInit,
  ChangeDetectionStrategy,
  Component, ContentChild, ElementRef, EventEmitter, inject,
  InjectionToken, Input,
  OnChanges, OnDestroy, Output, SimpleChanges, ViewChild, ViewContainerRef,
  ViewEncapsulation,
  DOCUMENT, NgZone, Renderer2
} from "@angular/core";

import {BooleanInput, coerceBooleanProperty} from "@angular/cdk/coercion";
import {CdkPortalOutlet, TemplatePortal} from "@angular/cdk/portal";
import {UniqueSelectionDispatcher} from "@angular/cdk/collections";
import {filter, startWith, Subject, take} from "rxjs";
import {CUTE_EXPANSION_PANEL, CuteExpansionPanelBase} from "./expansion-panel-base";
import { CuteAccordionBase, CuteAccordionTogglePosition, CUTE_ACCORDION} from "./accordion-base.interface";
import { CuteExpansionPanelContent } from "./expansion-panel-content.directive";
import {Expandable} from "@cute-widgets/base/abstract";
import {_animationsDisabled} from '@cute-widgets/base/core';


/** CuteExpansionPanel's states. */
export type CuteExpansionPanelState = 'expanded' | 'collapsed';

/** Counter for generating unique element ids. */
let uniqueId = 0;

/**
 * Object that can be used to override the default options
 * for all the expansion panels in a module.
 */
export interface CuteExpansionPanelDefaultOptions {
  /** Height of the header while the panel is expanded. */
  expandedHeight: string;

  /** Height of the header while the panel is collapsed. */
  collapsedHeight: string;

  /** Whether the toggle indicator should be hidden. */
  hideToggle: boolean;
}

/**
 * Injection token that can be used to configure the default
 * options for the expansion panel component.
 */
export const CUTE_EXPANSION_PANEL_DEFAULT_OPTIONS =
  new InjectionToken<CuteExpansionPanelDefaultOptions>('CUTE_EXPANSION_PANEL_DEFAULT_OPTIONS');

/**
 * This component can be used as a single element to show expandable content, or as one of
 * multiple children of an element with the CuteAccordion directive attached.
 */
@Component({
  selector: 'cute-expansion-panel',
  templateUrl: './expansion-panel.component.html',
  styleUrls: ['./expansion-panel.component.scss'],
  exportAs: 'cuteExpansionPanel',
  host: {
    'class': 'cute-expansion-panel',
    '[class.accordion-item]': 'accordion',
    '[class.accordion]': '!accordion',
    '[class.cute-expanded]': 'expanded',
  },
  imports: [CdkPortalOutlet],
  providers: [
    // Provide CuteAccordion as undefined to prevent nested expansion panels from registering
    // to the same accordion.
    { provide: CUTE_ACCORDION, useValue: undefined },
    { provide: CUTE_EXPANSION_PANEL, useExisting: CuteExpansionPanel },
  ],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CuteExpansionPanel extends CdkAccordionItem
  implements CuteExpansionPanelBase, Expandable, AfterContentInit, OnChanges, OnDestroy
{
  private _viewContainerRef = inject(ViewContainerRef);
  private readonly _animationsDisabled = _animationsDisabled();
  private _document = inject(DOCUMENT);
  private _ngZone = inject(NgZone);
  private _elementRef = inject<ElementRef<HTMLElement>>(ElementRef);
  private _renderer = inject(Renderer2);
  private _cleanupTransitionEnd: (() => void) | undefined;

  /** Whether the toggle indicator should be hidden. */
  @Input()
  get hideToggle(): boolean { return this._hideToggle || (this.accordion && this.accordion.hideToggle); }
  set hideToggle(value: BooleanInput) {
    this._hideToggle = coerceBooleanProperty(value);
  }
  private _hideToggle = false;

  /** The position of the expansion indicator. */
  @Input()
  get togglePosition(): CuteAccordionTogglePosition {
    return this._togglePosition || (this.accordion && this.accordion.togglePosition);
  }
  set togglePosition(value: CuteAccordionTogglePosition) {
    this._togglePosition = value;
  }
  private _togglePosition: CuteAccordionTogglePosition | undefined;

  /** An event emitted after the body's expansion animation happens. */
  @Output() readonly afterExpand = new EventEmitter<void>();

  /** An event emitted after the body's collapse animation happens. */
  @Output() readonly afterCollapse = new EventEmitter<void>();

  /** Stream that emits for changes in `@Input` properties. */
  readonly _inputChanges = new Subject<SimpleChanges>();

  /** Optionally defined accordion the expansion panel belongs to. */
  override readonly accordion = inject<CuteAccordionBase>(CUTE_ACCORDION, {optional: true, skipSelf: true})!;

  /** Content that will be rendered lazily. */
  @ContentChild(CuteExpansionPanelContent) _lazyContent: CuteExpansionPanelContent | undefined;

  /** Element containing the panel's user-provided content. */
  @ViewChild('body') _body: ElementRef<HTMLElement> | undefined;

  /** Element wrapping the panel body. */
  @ViewChild('bodyWrapper')
  protected _bodyWrapper: ElementRef<HTMLElement> | undefined;

  /** Portal holding the user's content. */
  protected _portal: TemplatePortal | null = null;

  /** ID for the associated header element. Used for a11y labelling. */
  _headerId: string = `cute-expansion-panel-header-${uniqueId++}`;

  _contentId: string = this._headerId.replace("header","content");

  constructor(...args: unknown[]);
  constructor() {
    super();

    const defaultOptions = inject<CuteExpansionPanelDefaultOptions>(
      CUTE_EXPANSION_PANEL_DEFAULT_OPTIONS,
      {optional: true},
    );

    this._expansionDispatcher = inject(UniqueSelectionDispatcher);

    if (defaultOptions) {
      this.hideToggle = defaultOptions.hideToggle;
    }
  }

  /** Determines whether the expansion panel should have spacing between it and its siblings. */
  _hasSpacing(): boolean {
    if (this.accordion) {
      return this.expanded && this.accordion.displayMode === 'default';
    }
    return false;
  }

  /** Gets the expanded state string. */
  _getExpandedState(): CuteExpansionPanelState {
    return this.expanded ? 'expanded' : 'collapsed';
  }

  /** Toggles the expanded state of the expansion panel. */
  override toggle(): void {
    this.expanded = !this.expanded;
  }

  /** Sets the expanded state of the expansion panel to false. */
  override close(): void {
    this.expanded = false;
  }

  /** Sets the expanded state of the expansion panel to true. */
  override open(): void {
    this.expanded = true;
  }

  ngAfterContentInit() {
    if (this._lazyContent && this._lazyContent._expansionPanel === this) {
      // Render the content as soon as the panel becomes open.
      this.opened
        .pipe(
          startWith(null),
          filter(() => this.expanded && !this._portal),
          take(1),
        )
        .subscribe(() => {
          this._portal = new TemplatePortal(this._lazyContent!._template, this._viewContainerRef);
        });
    }

    this._setupAnimationEvents();
  }

  ngOnChanges(changes: SimpleChanges) {
    this._inputChanges.next(changes);
  }

  override ngOnDestroy() {
    super.ngOnDestroy();
    this._cleanupTransitionEnd?.();
    this._inputChanges.complete();
  }

  /** Checks whether the expansion panel's content contains the currently focused element. */
  _containsFocus(): boolean {
    if (this._body) {
      const focusedElement = this._document.activeElement;
      const bodyElement = this._body.nativeElement;
      return focusedElement === bodyElement || bodyElement.contains(focusedElement);
    }

    return false;
  }

  //private _transitionEndListener = ({target, propertyName}: TransitionEvent) => {
  private _transitionEndListener = (event: TransitionEvent) => {
    // CWT: we change `_bodyWrapper` to `_body` since our template's markup differs from original
    if (event.target === this._body?.nativeElement && event.propertyName === 'grid-template-rows') {
      // if (event.propertyName==="transform" && event.pseudoElement==="::after") {
      this._ngZone.run(() => {
        if (this.expanded) {
          this.afterExpand.emit();
        } else {
          this.afterCollapse.emit();
        }
      });
    }
  }

  protected _setupAnimationEvents() {
    // This method is defined separately, because we need to
    // disable this logic in some internal components.
    this._ngZone.runOutsideAngular(() => {
      if (this._animationsDisabled) {
        this.opened.subscribe(() => this._ngZone.run(() => this.afterExpand.emit()));
        this.closed.subscribe(() => this._ngZone.run(() => this.afterCollapse.emit()));
      } else {
        setTimeout(() => {
          const element = this._elementRef.nativeElement;
          this._cleanupTransitionEnd = this._renderer.listen(
            element,
            'transitionend',
            this._transitionEndListener,
          );
          element.classList.add('cute-expansion-panel-animations-enabled');
        }, 200);
      }
    });
  }

}
