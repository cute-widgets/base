/**
 * @license Apache-2.0
 *
 * Copyright (c) 2025 CuteWidgets Team. All Rights Reserved.
 *
 * You may not use this file except in compliance with the License
 * that can be found at http://www.apache.org/licenses/LICENSE-2.0
 */
import {
  AfterContentInit,
  booleanAttribute,
  ChangeDetectionStrategy,
  Component, Directive,
  EventEmitter, inject,
  Input, NgZone,
  Output,
  ViewEncapsulation
} from "@angular/core";
import {CdkAccordionItem} from '@angular/cdk/accordion';
import {BooleanInput, coerceBooleanProperty} from '@angular/cdk/coercion';
import {CuteLayoutControl, Expandable} from "@cute-widgets/base/abstract";
import {_animationsDisabled} from '@cute-widgets/base/core';

// Increasing integer for generating unique ids for checkbox components.
let nextUniqueId = 0;

/** Animation states */
export type CuteCollapseState = 'expanded' | 'collapsed';

@Directive({
  hostDirectives: [{directive: CdkAccordionItem, outputs: ["expandedChange"]}],
})
export abstract class CuteCollapseBase extends CuteLayoutControl implements Expandable, AfterContentInit {
  protected _ngZone = inject(NgZone);
  protected _accordionItem = inject(CdkAccordionItem);
  protected _animationsDisabled = _animationsDisabled();
  private _cleanupTransitionHandlers: (() => void)[] = [];

  /** Whether the `CuteCollapse` is expanded. */
  @Input({transform: booleanAttribute})
  get expanded(): boolean {return this._accordionItem.expanded;}
  set expanded(value: boolean) {this._accordionItem.expanded = value;}

  /** Expanding/Collapsing directionality, _horizontal_ or _vertical_. Default is _vertical_. */
  @Input({transform: booleanAttribute})
  horizontal: boolean = false;

  /** Whether the animation while collapsing/expanding should be disabled */
  @Input({transform: booleanAttribute})
  get disableAnimation(): boolean {return this._disableAnimation ?? this._animationsDisabled;}
  set disableAnimation(value: boolean) { this._disableAnimation = value; }
  private _disableAnimation: boolean | undefined;

  /** Event emitting before expand element */
  @Output() readonly beforeExpand = new EventEmitter<void>();
  /** Event emitting before collapse element */
  @Output() readonly beforeCollapse = new EventEmitter<void>();

  /** Event emitting after expand element */
  @Output() readonly afterExpand = new EventEmitter<void>();
  /** Event emitting after collapse element */
  @Output() readonly afterCollapse = new EventEmitter<void>();

  constructor() {
    super();
  }

  protected override setDisabledState(newState: BooleanInput, emitEvent?: boolean): boolean {
    if (super.setDisabledState(newState, emitEvent)) {
      this._accordionItem.disabled = coerceBooleanProperty(newState);
      return true;
    }
    return false;
  }

  protected override generateId(): string {
    return `cute-collapse-${nextUniqueId++}`;
  }

  /** Gets the expanded state string. */
  getState(): CuteCollapseState {
    return this._accordionItem.expanded ? 'expanded' : 'collapsed';
  }

  /**
   * @inheritDoc
   * Part of `Expandable` interface.
   */
  toggle(): void {
    this._accordionItem.toggle();
  }

  /**
   * @inheritDoc
   * Part of `Expandable` interface.
   */
  open(): void {
    this._accordionItem.open();
  }

  /**
   * @inheritDoc
   * Part of `Expandable` interface.
   */
  close(): void {
    this._accordionItem.close();
  }

  private _transitionStartListener = (event: TransitionEvent) => {
    if (event.target === this._nativeElement &&
      (event.propertyName === 'grid-template-rows' || event.propertyName === 'grid-template-columns')
    ) {
      this._ngZone.run(() => {
        if (this._accordionItem.expanded) {
          this.beforeExpand.emit();
        } else {
          this.beforeCollapse.emit();
        }
      });
    }
  }

  private _transitionEndListener = (event: TransitionEvent) => {
    if (event.target === this._nativeElement &&
      (event.propertyName === 'grid-template-rows' || event.propertyName === 'grid-template-columns')
    ) {
      this._ngZone.run(() => {
        if (this._accordionItem.expanded) {
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
      if (this.disableAnimation) {
        this._accordionItem.opened.subscribe(() => this._ngZone.run(() => this.beforeExpand.emit()));
        this._accordionItem.closed.subscribe(() => this._ngZone.run(() => this.beforeCollapse.emit()));
        this._accordionItem.opened.subscribe(() => this._ngZone.run(() => this.afterExpand.emit()));
        this._accordionItem.closed.subscribe(() => this._ngZone.run(() => this.afterCollapse.emit()));
      } else {
        setTimeout(() => {
          const element = this._nativeElement;
          this._cleanupTransitionHandlers.push(
            this._renderer.listen(element, 'transitionend', this._transitionEndListener),
            this._renderer.listen(element, 'transitionstart', this._transitionStartListener),
          );
          element.classList.add('cute-collapse-animations-enabled');
        }, 200);
      }
    });
  }

  override ngAfterContentInit() {
    super.ngAfterContentInit();
    this._setupAnimationEvents();
  }

  override ngOnDestroy() {
    super.ngOnDestroy();
    this._cleanupTransitionHandlers.forEach(cleanup => cleanup());
  }

}

/**
 * This collapse component is used to show and hide content.
 * Buttons or anchors are used as triggers that are mapped to specific elements you toggle.
 */
@Component({
  selector: 'cute-collapse',
  templateUrl: './collapse.component.html',
  styleUrl: './collapse.component.scss',
  exportAs: 'cuteCollapse',
  host: {
    'class': 'cute-collapse',
    '[class]': '"cute-collapse-"+(horizontal ? "horizontal" : "vertical")+" "+getState()',
    '[id]': 'id || null',
  },
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CuteCollapse extends CuteCollapseBase {}
