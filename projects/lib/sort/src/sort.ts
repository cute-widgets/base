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
  EventEmitter,
  Inject,
  InjectionToken,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Optional,
  Output,
  booleanAttribute, isDevMode, SimpleChanges,
} from '@angular/core';
import {Observable, ReplaySubject, Subject} from 'rxjs';
import {SortDirection} from './sort-direction';
import {
  getSortDuplicateSortableIdError,
  getSortHeaderMissingIdError,
  getSortInvalidDirectionError,
} from './sort-errors';
import {CuteBaseControl} from "@cute-widgets/base/abstract";

/** Position of the arrow that displays when sorted. */
export type SortHeaderArrowPosition = 'before' | 'after';

/** Interface for a directive that holds sorting state consumed by `CuteSortHeader`. */
export interface CuteSortable {
  /** The id of the column being sorted. */
  id: string;

  /** Starting a sort direction. */
  start: SortDirection;

  /** Whether to disable clearing the sorting state. */
  disableClear: boolean;
}

/** The current sort state. */
export interface Sort {
  /** The id of the column being sorted. */
  active: string;

  /** The sort direction. */
  direction: SortDirection;
}

/** Default options for `cute-sort`.  */
export interface CuteSortDefaultOptions {
  /** Whether to disable clearing the sorting state. */
  disableClear?: boolean;
  /** Position of the arrow that displays when sorted. */
  arrowPosition?: SortHeaderArrowPosition;
}

/** Injection token to be used to override the default options for `mat-sort`. */
export const CUTE_SORT_DEFAULT_OPTIONS = new InjectionToken<CuteSortDefaultOptions>(
  'CUTE_SORT_DEFAULT_OPTIONS',
);


/** Container for CuteSortables to manage the sort state and provide default sort parameters. */
@Directive({
  selector: '[cuteSort]',
  exportAs: 'cuteSort',
  host: {
    'class': 'cute-sort',
  },
  standalone: true,
})
export class CuteSort implements OnChanges, OnDestroy, OnInit {
  private _initializedStream = new ReplaySubject<void>(1);

  /** Collection of all registered sortables that this directive manages. */
  sortables = new Map<string, CuteSortable>();

  /** Used to notify any child components listening to state changes. */
  readonly _stateChanges = new Subject<void>();

  /** The id of the most recently sorted CuteSortable. */
  @Input('cuteSortActive') active: string | undefined;

  /**
   * The direction to set when a CuteSortable is initially sorted.
   * May be overridden by the CuteSortable's sort start.
   */
  @Input('cuteSortStart') start: SortDirection = 'asc';

  /** The sort direction of the currently active CuteSortable. */
  @Input('cuteSortDirection')
  get direction(): SortDirection { return this._direction; }
  set direction(direction: SortDirection) {
    if (
      direction &&
      direction !== 'asc' &&
      direction !== 'desc' &&
      isDevMode()
    ) {
      throw getSortInvalidDirectionError(direction);
    }
    this._direction = direction;
  }
  private _direction: SortDirection = '';

  /**
   * Whether to disable the user from clearing the sort by finishing the sort direction cycle.
   * May be overridden by the CuteSortable's disable clear input.
   */
  @Input({alias: 'cuteSortDisableClear', transform: booleanAttribute})
  protected disableClear: boolean = false;

  /** Whether the sortable is disabled. */
  @Input({alias: 'cuteSortDisabled', transform: booleanAttribute})
  disabled: boolean = false;

  /** Event emitted when the user changes either the active sort or sort direction. */
  @Output('cuteSortChange') readonly sortChange: EventEmitter<Sort> = new EventEmitter<Sort>();

  /** Emits when the paginator is initialized. */
  initialized$: Observable<void> = this._initializedStream;

  constructor(
    @Optional()
    @Inject(CUTE_SORT_DEFAULT_OPTIONS)
    private _defaultOptions?: CuteSortDefaultOptions,
  ) {}

  /**
   * Register function to be used by the contained CuteSortables. Adds the CuteSortable to the
   * collection of CuteSortables.
   */
  register(sortable: CuteSortable): void {
    if (isDevMode()) {
      if (!sortable.id) {
        throw getSortHeaderMissingIdError();
      }

      if (this.sortables.has(sortable.id)) {
        throw getSortDuplicateSortableIdError(sortable.id);
      }
    }

    this.sortables.set(sortable.id, sortable);
  }

  /**
   * Unregister function to be used by the contained CuteSortables. Removes the CuteSortable from the
   * collection of contained CuteSortables.
   */
  deregister(sortable: CuteSortable): void {
    this.sortables.delete(sortable.id);
  }

  /** Sets the active sort id and determines the new sort direction. */
  sort(sortable: CuteSortable): void {
    if (this.active != sortable.id) {
      this.active = sortable.id;
      this.direction = sortable.start ? sortable.start : this.start;
    } else {
      this.direction = this.getNextSortDirection(sortable);
    }

    this.sortChange.emit({active: this.active, direction: this.direction});
  }

  /** Returns the next sort direction of the active sortable, checking for potential overrides. */
  getNextSortDirection(sortable: CuteSortable): SortDirection {
    if (!sortable) {
      return '';
    }

    // Get the sort direction cycle with the potential sortable overrides.
    const disableClear =
      sortable?.disableClear ?? this.disableClear ?? !!this._defaultOptions?.disableClear;
    let sortDirectionCycle = getSortDirectionCycle(sortable.start || this.start, disableClear);

    // Get and return the next direction in the cycle
    let nextDirectionIndex = sortDirectionCycle.indexOf(this.direction) + 1;
    if (nextDirectionIndex >= sortDirectionCycle.length) {
      nextDirectionIndex = 0;
    }
    return sortDirectionCycle[nextDirectionIndex];
  }

  ngOnInit() {
    this._initializedStream.next();
  }

  ngOnChanges(changes: SimpleChanges) {
    this._stateChanges.next();
  }

  ngOnDestroy() {
    this._stateChanges.complete();
    this._initializedStream.complete();
  }
}

/** Returns the sort direction cycle to use given the provided parameters of order and clear. */
function getSortDirectionCycle(start: SortDirection, disableClear: boolean): SortDirection[] {
  let sortOrder: SortDirection[] = ['asc', 'desc'];
  if (start == 'desc') {
    sortOrder.reverse();
  }
  if (!disableClear) {
    sortOrder.push('');
  }

  return sortOrder;
}
