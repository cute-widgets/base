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
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input, OnDestroy,
  Output, signal,
  ViewEncapsulation
} from "@angular/core";
import {CuteBaseControl, Expandable} from "@cute-widgets/base/abstract";
import {cuteCollapseAnimations} from "./collapse-animations";
import {Subject} from "rxjs";
import {distinctUntilChanged} from "rxjs/operators";
import {AnimationEvent} from "@angular/animations";

// Increasing integer for generating unique ids for checkbox components.
let nextUniqueId = 0;

/** Animation states */
export type CuteCollapseState = 'expanded' | 'collapsed';

/**
 * This collapse component is used to show and hide content.
 * Buttons or anchors are used as triggers that are mapped to specific elements you toggle.
 */
@Component({
  selector: 'cute-collapse',
  template: '<ng-content></ng-content>',
  styles: `
    .cute-collapse {display: block;}
    .ng-animating {overflow: hidden;}
  `,
  exportAs: 'cuteCollapse',
  host: {
    'class': 'cute-collapse', // collapse',
    //'[class.show]': '!collapsed',
    '[id]': 'id || null',
    '[@bodyExpansion]': 'getState()+(horizontal?"-hor":"")',
    '[@.disabled]': 'disableAnimation',
    '(@bodyExpansion.start)': '_bodyAnimation$.next($event)',
    '(@bodyExpansion.done)': '_bodyAnimation$.next($event)',
  },
  animations: [cuteCollapseAnimations.bodyExpansion],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true
})
export class CuteCollapse extends CuteBaseControl implements Expandable, OnDestroy {

  /** Sets the element's current state to _collapsed_ or _expanded_ value. */
  @Input({transform: booleanAttribute})
  get collapsed(): boolean { return this._collapsed(); }
  set collapsed(value: boolean) {
    if (value !== this._collapsed()) {
      if (this.disableAnimation) {
        (value ? this.beforeCollapse : this.beforeExpand).emit();
      }
      this._collapsed.set(value);
      if (this.disableAnimation) {
        (value ? this.afterCollapse : this.afterExpand).emit();
      }
    }
  }
  private _collapsed = signal<boolean>(true);

  /** Expanding/Collapsing directionality, _horizontal_ or _vertical_. Default is _vertical_. */
  @Input({transform: booleanAttribute})
  horizontal: boolean = false;

  /** Whether the animation while collapsing/expanding should be disabled */
  @Input({transform: booleanAttribute})
  disableAnimation: boolean = false;

  /** Event emitting before expand element */
  @Output() readonly beforeExpand = new EventEmitter<void>();
  /** Event emitting before collapse element */
  @Output() readonly beforeCollapse = new EventEmitter<void>();

  /** Event emitting after expand element */
  @Output() readonly afterExpand = new EventEmitter<void>();
  /** Event emitting after collapse element */
  @Output() readonly afterCollapse = new EventEmitter<void>();

  /** Weather the current state is _collapsed_ or _expanded_. Part of `Expandable` interface. */
  public get expanded(): boolean { return !this.collapsed; }

  /** Stream of body animation events. */
  protected readonly _bodyAnimation$ = new Subject<AnimationEvent>();

  constructor() {
    super();

    // We need a Subject with distinctUntilChanged, because the `done` event
    // fires twice on some browsers. See https://github.com/angular/angular/issues/24084
    this._bodyAnimation$
      .pipe(
        distinctUntilChanged((x, y) => {
          return x.phaseName === y.phaseName && x.fromState === y.fromState && x.toState === y.toState;
        }),
      )
      .subscribe((event: AnimationEvent) => {
        this.onAnimationEvent(event);
      });
  }

  protected onAnimationEvent(event: AnimationEvent) {
    if (event.fromState !== 'void') {
      const toState = event.toState;
      if (event.phaseName == "start") {
        if (toState.startsWith('expanded')) {
          this.beforeExpand.emit();
        } else if (toState.startsWith('collapsed')) {
          this.beforeCollapse.emit();
        }
      } else if (event.phaseName == "done") {
        if (toState.startsWith('expanded')) {
          this.afterExpand.emit();
        } else if (toState.startsWith('collapsed')) {
          this.afterCollapse.emit();
        }
      }
    }
  }

  protected override generateId(): string {
    return `cute-collapse-${nextUniqueId++}`;
  }

  /** Gets the expanded state string. */
  getState(): CuteCollapseState {
    return this.collapsed ? 'collapsed' : 'expanded';
  }

  /** Part of `Expandable` interface */
  toggle(): void {
    this.collapsed = !this.collapsed;
  }

  /** Part of `Expandable` interface */
  open(): void {
    if (this.collapsed) {
      this.collapsed = false;
    }
  }

  /** Part of `Expandable` interface */
  close(): void {
    if (!this.collapsed) {
      this.collapsed = true;
    }
  }

  override ngOnDestroy() {
    super.ngOnDestroy();
    this._bodyAnimation$.complete();
  }

}
