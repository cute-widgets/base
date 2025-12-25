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
import {AriaDescriber, FocusMonitor} from '@angular/cdk/a11y';
import {ENTER, SPACE} from '@angular/cdk/keycodes';
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  Inject,
  Input,
  OnDestroy,
  OnInit,
  Optional,
  ViewEncapsulation,
  booleanAttribute, isDevMode,
} from '@angular/core';
import {merge, Subscription} from 'rxjs';
import {
  CUTE_SORT_DEFAULT_OPTIONS,
  CuteSort,
  CuteSortable,
  CuteSortDefaultOptions,
  SortHeaderArrowPosition,
} from './sort';
import {cuteSortAnimations} from './sort-animations';
import {SortDirection} from './sort-direction';
import {getSortHeaderNotContainedWithinSortError} from './sort-errors';
import {CuteSortHeaderIntl} from './sort-header-intl';

/**
 * Valid positions for the arrow to be in for its opacity and translation. If the state is a
 * sort direction, the position of the arrow will be above/below and opacity 0. If the state is
 * _hint_, the arrow will be in the center with a slight opacity. _Active_ state means the arrow will
 * be fully opaque in the center.
 *
 * @docs-private
 * @deprecated No longer being used, to be removed.
 * @breaking-change 21.0.0
 */
export type ArrowViewState = SortDirection | 'hint' | 'active';

/**
 * States describing the arrow's animated position (animating _fromState_ to _toState_).
 * If the _fromState_ is not defined, there will be no animated transition to the _toState_.
 * @docs-private
 * @deprecated No longer being used, to be removed.
 * @breaking-change 21.0.0
 */
export interface ArrowViewStateTransition {
  fromState?: ArrowViewState;
  toState?: ArrowViewState;
}

/** Column definition associated with a `CuteSortHeader`. */
interface CuteSortHeaderColumnDef {
  name: string;
}

/**
 * Applies sorting behavior (click to change sort) and styles to an element, including an
 * arrow to display the current sort direction.
 *
 * Must be provided with an id and contained within a parent `CuteSort` directive.
 *
 * If used on header cells in a CdkTable, it will automatically default its id from its containing
 * column definition.
 */
@Component({
  selector: '[cute-sort-header]',
  exportAs: 'cuteSortHeader',
  templateUrl: './sort-header.html',
  styleUrls: ['./sort-header.scss'],
  host: {
    'class': 'cute-sort-header',
    '(click)': '_handleClick()',
    '(keydown)': '_handleKeydown($event)',
    '(mouseenter)': '_setIndicatorHintVisible(true)',
    '(mouseleave)': '_setIndicatorHintVisible(false)',
    '[attr.aria-sort]': '_getAriaSortAttribute()',
    '[class.cute-sort-header-disabled]': '_isDisabled()',
  },
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [
    cuteSortAnimations.indicator,
    cuteSortAnimations.leftPointer,
    cuteSortAnimations.rightPointer,
    cuteSortAnimations.arrowOpacity,
    cuteSortAnimations.arrowPosition,
    cuteSortAnimations.allowChildren,
  ],
  standalone: true,
})
export class CuteSortHeader implements CuteSortable, OnDestroy, OnInit, AfterViewInit {
  private _rerenderSubscription: Subscription | undefined;

  /**
   * The element with role="button" inside this component's view. We need this to apply
   * a description with AriaDescriber.
   */
  private _sortButton: HTMLElement | null = null;

  /**
   * Flag set to true when the indicator should be displayed while the sort is not active. Used to
   * provide an affordance that the header is sortable by showing on focus and hover.
   */
  _showIndicatorHint: boolean = false;

  /**
   * The view transition state of the arrow (translation/ opacity) - indicates its `from` and `to`
   * position through the animation. If animations are currently disabled, the `fromState` is removed
   * so that there is no animation displayed.
   */
  _viewState: ArrowViewStateTransition = {};

  /** The direction the arrow should be facing, according to the current state. */
  _arrowDirection: SortDirection = '';

  /**
   * Whether the view state animation should show the transition between the `from` and `to` states.
   */
  _disableViewStateAnimation = false;

  /**
   * ID of this sort header. If used within the context of a CdkColumnDef, this will default to
   * the column's name.
   */
  @Input('cute-sort-header') id: string = "";

  /** Sets the position of the arrow that displays when sorted. */
  @Input() arrowPosition: SortHeaderArrowPosition = 'after';

  /** Overrides the sort start value of the containing CuteSort for this CuteSortable. */
  @Input() start: SortDirection = "";

  /** whether the sort header is disabled. */
  @Input({transform: booleanAttribute})
  disabled: boolean = false;

  /**
   * Description applied to MatSortHeader's button element with aria-describedby. This text should
   * describe the action that will occur when the user clicks the sort header.
   */
  @Input()
  get sortActionDescription(): string {
    return this._sortActionDescription;
  }
  set sortActionDescription(value: string) {
    this._updateSortActionDescription(value);
  }
  // Default the action description to "Sort" because it's better than nothing.
  // Without a description, the button's label comes from the sort header text content,
  // which doesn't give any indication that it performs a sorting operation.
  private _sortActionDescription: string = 'Sort';

  /** Overrides the disable clear value of the containing CuteSort for this CuteSortable. */
  @Input({transform: booleanAttribute})
  disableClear: boolean = false;

  constructor(
    /**
     * @deprecated `_intl` parameter isn't being used anymore, and it'll be removed.
     * @breaking-change 13.0.0
     */
    public _intl: CuteSortHeaderIntl,
    private _changeDetectorRef: ChangeDetectorRef,
    // `CuteSort` is not optionally injected, but just asserted manually w/ better error.
    // tslint:disable-next-line: lightweight-tokens
    @Optional() public _sort: CuteSort,
    @Inject('CUTE_SORT_HEADER_COLUMN_DEF')
    @Optional()
    public _columnDef: CuteSortHeaderColumnDef,
    private _focusMonitor: FocusMonitor,
    private _elementRef: ElementRef<HTMLElement>,
    /** @breaking-change 14.0.0 _ariaDescriber will be required. */
    @Optional() private _ariaDescriber?: AriaDescriber | null,
    @Optional()
    @Inject(CUTE_SORT_DEFAULT_OPTIONS)
      defaultOptions?: CuteSortDefaultOptions,
  ) {
    // Note that we use a string token for the `_columnDef`, because the value is provided both by
    // `material/table` and `cdk/table` and we can't have the CDK depending on Material,
    // and we want to avoid having the sort header depending on the CDK table because
    // of this single reference.
    if (!_sort && isDevMode()) {
      throw getSortHeaderNotContainedWithinSortError();
    }

    if (defaultOptions?.arrowPosition) {
      this.arrowPosition = defaultOptions?.arrowPosition;
    }

    this._handleStateChanges();
  }

  ngOnInit() {
    if (!this.id && this._columnDef) {
      this.id = this._columnDef.name;
    }

    // Initialize the direction of the arrow and set the view state to be immediately that state.
    this._updateArrowDirection();
    this._setAnimationTransitionState({
      toState: this._isSorted() ? 'active' : this._arrowDirection,
    });

    this._sort.register(this);

    this._sortButton = this._elementRef.nativeElement.querySelector('.cute-sort-header-container')!;
    this._updateSortActionDescription(this._sortActionDescription);
  }

  ngAfterViewInit() {
    // We use the focus monitor because we also want to style
    // things differently based on the focus origin.
    this._focusMonitor.monitor(this._elementRef, true).subscribe(origin => {
      const newState = !!origin;
      if (newState !== this._showIndicatorHint) {
        this._setIndicatorHintVisible(newState);
        this._changeDetectorRef.markForCheck();
      }
    });
  }

  ngOnDestroy() {
    this._focusMonitor.stopMonitoring(this._elementRef);
    this._sort.deregister(this);
    this._rerenderSubscription?.unsubscribe();
  }

  /**
   * Sets the "hint" state such that the arrow will be semi-transparently displayed as a hint to the
   * user showing what the active sort will become. If set to false, the arrow will fade away.
   */
  _setIndicatorHintVisible(visible: boolean) {
    // No-op if the sort header is disabled - should not make the hint visible.
    if (this._isDisabled() && visible) {
      return;
    }

    this._showIndicatorHint = visible;

    if (!this._isSorted()) {
      this._updateArrowDirection();
      if (this._showIndicatorHint) {
        this._setAnimationTransitionState({fromState: this._arrowDirection, toState: 'hint'});
      } else {
        this._setAnimationTransitionState({fromState: 'hint', toState: this._arrowDirection});
      }
    }
  }

  /**
   * Sets the animation transition view state for the arrow's position and opacity. If the
   * `disableViewStateAnimation` flag is set to true, the `fromState` will be ignored so that
   * no animation appears.
   */
  _setAnimationTransitionState(viewState: ArrowViewStateTransition) {
    this._viewState = viewState || {};

    // If the animation for arrow position state (opacity/translation) should be disabled,
    // remove the fromState so that it jumps right to the toState.
    if (this._disableViewStateAnimation) {
      this._viewState = {toState: viewState.toState};
    }
  }

  /** Triggers the sort on this sort header and removes the indicator hint. */
  _toggleOnInteraction() {
    this._sort.sort(this);

    // Do not show the animation if the header was already shown in the right position.
    if (this._viewState.toState === 'hint' || this._viewState.toState === 'active') {
      this._disableViewStateAnimation = true;
    }
  }

  _handleClick() {
    if (!this._isDisabled()) {
      this._sort.sort(this);
    }
  }

  _handleKeydown(event: KeyboardEvent) {
    if (!this._isDisabled() && (event.keyCode === SPACE || event.keyCode === ENTER)) {
      event.preventDefault();
      this._toggleOnInteraction();
    }
  }

  /** Whether this MatSortHeader is currently sorted in either ascending or descending order. */
  _isSorted() {
    return (
      this._sort.active == this.id &&
      (this._sort.direction === 'asc' || this._sort.direction === 'desc')
    );
  }

  /** Returns the animation state for the arrow direction (indicator and pointers). */
  _getArrowDirectionState() {
    return `${this._isSorted() ? 'active-' : ''}${this._arrowDirection}`;
  }

  /** Returns the arrow position state (opacity, translation). */
  _getArrowViewState() {
    const fromState = this._viewState.fromState;
    return (fromState ? `${fromState}-to-` : '') + this._viewState.toState;
  }

  /**
   * Updates the direction the arrow should be pointing. If it is not sorted, the arrow should be
   * facing the start direction. Otherwise, if it is sorted, the arrow should point in the currently
   * active sorted direction. The reason this is updated through a function is because the direction
   * should only be changed at specific times - when deactivated but the hint is displayed and when
   * the sort is active and the direction changes. Otherwise, the arrow's direction should linger
   * in cases such as the sort becoming deactivated but we want to animate the arrow away while
   * preserving its direction, even though the next sort direction is actually different and should
   * only be changed once the arrow displays again (hint or activation).
   */
  _updateArrowDirection() {
    this._arrowDirection = this._isSorted() ? this._sort.direction : this.start || this._sort.start;
  }

  _isDisabled() {
    return this._sort.disabled || this.disabled;
  }

  /**
   * Gets the aria-sort attribute that should be applied to this sort header. If this header
   * is not sorted, returns null so that the attribute is removed from the host element. Aria spec
   * says that the aria-sort property should only be present on one header at a time, so removing
   * ensures this is true.
   */
  _getAriaSortAttribute() {
    if (!this._isSorted()) {
      return 'none';
    }

    return this._sort.direction == 'asc' ? 'ascending' : 'descending';
  }

  /** Whether the arrow inside the sort header should be rendered. */
  _renderArrow() {
    return !this._isDisabled() || this._isSorted();
  }

  private _updateSortActionDescription(newDescription: string) {
    // We use AriaDescriber for the sort button instead of setting an `aria-label` because some
    // screen readers (notably VoiceOver) will read both the column header *and* the button's label
    // for every *cell* in the table, creating a lot of unnecessary noise.

    // If _sortButton is undefined, the component hasn't been initialized yet so there's
    // nothing to update in the DOM.
    if (this._sortButton) {
      // removeDescription will no-op if there is no existing message.
      // TODO(jelbourn): remove optional chaining when AriaDescriber is required.
      this._ariaDescriber?.removeDescription(this._sortButton, this._sortActionDescription);
      this._ariaDescriber?.describe(this._sortButton, newDescription);
    }

    this._sortActionDescription = newDescription;
  }

  /** Handles changes in the sorting state. */
  private _handleStateChanges() {
    this._rerenderSubscription = merge(
      this._sort.sortChange,
      this._sort._stateChanges,
      this._intl.changes,
    ).subscribe(() => {
      if (this._isSorted()) {
        this._updateArrowDirection();

        // Do not show the animation if the header was already shown in the right position.
        if (this._viewState.toState === 'hint' || this._viewState.toState === 'active') {
          this._disableViewStateAnimation = true;
        }

        this._setAnimationTransitionState({fromState: this._arrowDirection, toState: 'active'});
        this._showIndicatorHint = false;
      }

      // If this header was recently active and now no longer sorted, animate away the arrow.
      if (!this._isSorted() && this._viewState && this._viewState.toState === 'active') {
        this._disableViewStateAnimation = false;
        this._setAnimationTransitionState({fromState: 'active', toState: this._arrowDirection});
      }

      this._changeDetectorRef.markForCheck();
    });
  }
}
