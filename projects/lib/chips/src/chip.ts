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
  AfterViewInit,
  AfterContentInit,
  Component,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  ContentChild,
  EventEmitter,
  Input,
  NgZone,
  OnDestroy,
  Output,
  ViewEncapsulation,
  ViewChild,
  ContentChildren,
  QueryList,
  OnInit,
  DoCheck,
  inject,
  booleanAttribute,
  ANIMATION_MODULE_TYPE,
  Injector,
  DOCUMENT, HOST_TAG_NAME
} from '@angular/core';

import {BACKSPACE, DELETE} from '@angular/cdk/keycodes';
import {merge, Subject, Subscription} from 'rxjs';
import {CuteFocusableControl} from "@cute-widgets/base/abstract";
import {CuteChipAvatar, CuteChipTrailingIcon, CuteChipRemove, CuteChipEdit} from './chip-icons';
import {CuteChipAction} from './chip-action';
import {CUTE_CHIP, CUTE_CHIP_AVATAR, CUTE_CHIP_EDIT, CUTE_CHIP_REMOVE, CUTE_CHIP_TRAILING_ICON} from './tokens';

let uid = 0;

/** Represents an event fired on an individual `mat-chip`. */
export interface CuteChipEvent {
  /** The chip the event was fired on. */
  chip: CuteChip;
}

/**
 * A Chip base component used inside the `CuteChipSet` component.
 * Extended by `CuteChipOption` and `CuteChipRow` for different interaction patterns.
 */
@Component({
  selector: 'cute-basic-chip, [cute-basic-chip], cute-chip, [cute-chip]',
  exportAs: 'cuteChip',
  templateUrl: './chip.html',
  styleUrl: './chip.scss',
  host: {
    'class': 'cute-chip',
    '[class.btn]': '_isStandardStaticChip',
    '[class.btn-sm]': '_isStandardStaticChip',
    '[class.border]': '_isStandardStaticChip',
    '[class.rounded-pill]': '_isStandardStaticChip',
    '[class.cute-static-chip]': '_isStandardStaticChip',
    '[class.cute-chip-with-avatar]': 'leadingIcon',
    '[class.cute-chip-highlighted]': 'highlighted',
    '[class.disabled]': '_isStandardStaticChip && disabled',
    '[class.cute-basic-chip]': '_isBasicChip',
    '[class.cute-standard-chip]': '!_isBasicChip',
    '[class.cute-chip-with-trailing-icon]': '_hasTrailingIcon()',
    '[class._cute-animation-noopable]': '_animationsDisabled',
    '[id]': 'id',
    '[attr.role]': 'role',
    '[attr.tabindex]': '_getTabIndex()',
    '[attr.aria-label]': 'ariaLabel',
    '(keydown)': '_handleKeydown($event)',
  },
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [{ provide: CUTE_CHIP, useExisting: CuteChip }],
  imports: [CuteChipAction]
})
export class CuteChip extends CuteFocusableControl implements OnInit, AfterViewInit, AfterContentInit, DoCheck, OnDestroy {
  public override _changeDetectorRef = inject(ChangeDetectorRef);
  protected _ngZone = inject(NgZone);
  private readonly _tagName = inject(HOST_TAG_NAME);
  protected _document = inject(DOCUMENT);

  /** Emits when the chip is focused. */
  readonly _onFocus = new Subject<CuteChipEvent>();

  /** Emits when the chip is blurred. */
  readonly _onBlur = new Subject<CuteChipEvent>();

  /** Whether this chip is a basic (unstyled) chip. */
  protected _isBasicChip: boolean | undefined;

  protected _isStandardStaticChip: boolean | undefined;

  /** Whether the chip has focus. */
  private _hasFocusInternal = false;

  /** Whether moving focus into the chip is pending. */
  private _pendingFocus: boolean | undefined;

  /** Subscription to changes in the chip's actions. */
  private _actionChanges: Subscription | undefined;

  /** Whether animations for the chip are enabled. */
  protected _animationsDisabled: boolean;

  /** All avatars present in the chip. */
  @ContentChildren(CUTE_CHIP_AVATAR, {descendants: true})
  protected _allLeadingIcons!: QueryList<CuteChipAvatar>;

  /** All trailing icons present in the chip. */
  @ContentChildren(CUTE_CHIP_TRAILING_ICON, {descendants: true})
  protected _allTrailingIcons!: QueryList<CuteChipTrailingIcon>;

  /** All edit icons present in the chip. */
  @ContentChildren(CUTE_CHIP_EDIT, {descendants: true})
  protected _allEditIcons!: QueryList<CuteChipEdit>;

  /** All remove icons present in the chip. */
  @ContentChildren(CUTE_CHIP_REMOVE, {descendants: true})
  protected _allRemoveIcons!: QueryList<CuteChipRemove>;

  _hasFocus() {
    return this._hasFocusInternal;
  }

  /** A unique id for the chip. If none is supplied, it will be auto-generated. */
  protected override generateId(): string {
    return `cute-chip-${uid++}`;
  }

  /** The `id` of a span that contains this chip's aria description. */
  protected _ariaDescriptionId = `${this.id}-aria-description`;

  /** Whether the chip list is disabled. */
  _chipListDisabled: boolean = false;

  /** Whether the chip was focused when it was removed. */
  _hadFocusOnRemove = false;

  private _textElement!: HTMLElement;

  /**
   * The value of the chip. Defaults to the content inside
   * the `cute-chip-action-label` element.
   */
  @Input()
  get value(): any {
    return this._value !== undefined ? this._value : this._textElement?.textContent!.trim();
  }
  set value(value: any) {
    this._value = value;
  }
  protected _value: any;

  /**
   * Determines whether the chip displays the remove styling and emits (removed) events.
   */
  @Input({transform: booleanAttribute})
  removable: boolean = true;

  /**
   * Colors the chip for emphasis as if it were selected.
   */
  @Input({transform: booleanAttribute})
  highlighted: boolean = false;

  /** Whether the ripple effect is disabled or not. */
  @Input({transform: booleanAttribute})
  disableRipple: boolean = false;

  /** Emitted when a chip is to be removed. */
  @Output() readonly removed: EventEmitter<CuteChipEvent> = new EventEmitter<CuteChipEvent>();

  /** Emitted when the chip is destroyed. */
  @Output() readonly destroyed: EventEmitter<CuteChipEvent> = new EventEmitter<CuteChipEvent>();

  /** The unstyled chip selector for this component. */
  protected basicChipAttrName = 'cute-basic-chip';

  /** The chip's leading icon. */
  @ContentChild(CUTE_CHIP_AVATAR) leadingIcon: CuteChipAvatar | undefined;

  /** The chip's leading edit icon. */
  @ContentChild(CUTE_CHIP_EDIT) editIcon: CuteChipEdit | undefined;

  /** The chip's trailing icon. */
  @ContentChild(CUTE_CHIP_TRAILING_ICON) trailingIcon: CuteChipTrailingIcon | undefined;

  /** The chip's trailing remove icon. */
  @ContentChild(CUTE_CHIP_REMOVE) removeIcon: CuteChipRemove | undefined;

  /** Action receiving the primary set of user interactions. */
  @ViewChild(CuteChipAction) primaryAction: CuteChipAction | undefined;

  /**
   * Handles the lazy creation of the CuteChip ripple.
   * Used to improve initial load time of large applications.
   */
  //_rippleLoader: MatRippleLoader = inject(MatRippleLoader);

  override getDisabledState(): boolean {
    return super.getDisabledState() || this._chipListDisabled;
  }

  private _injector = inject(Injector);

  constructor(...args: unknown[]);

  constructor() {
    super();
    const animationMode = inject(ANIMATION_MODULE_TYPE, {optional: true});
    this._animationsDisabled = animationMode === 'NoopAnimations';

    const tabIndex = this.getAttribute("tabindex");
    if (tabIndex) {
      this.tabIndex = parseInt(tabIndex) ?? -1;
    } else {
      this.tabIndex = undefined;
    }
    this._monitorFocus();
  }

  override ngOnInit() {
    super.ngOnInit();
    // This check needs to happen in `ngOnInit` so the overridden value of
    // `basicChipAttrName` coming from base classes can be picked up.
    const element = this._elementRef.nativeElement;
    this._isBasicChip =
      element.hasAttribute(this.basicChipAttrName) ||
      element.tagName.toLowerCase() === this.basicChipAttrName;

    this._isStandardStaticChip = !this._isBasicChip &&
      (element.tagName.toLowerCase() === "cute-chip" ||
        element.tagName.toLowerCase() === "cute-chip-row");

  }

  override ngAfterViewInit() {
    super.ngAfterViewInit();

    this._textElement = this._elementRef.nativeElement.querySelector('.cute-chip-action-label')!;

    if (this._pendingFocus) {
      this._pendingFocus = false;
      this.focus();
    }
  }

  override ngAfterContentInit(): void {
    super.ngAfterContentInit();
    // Since the styling depends on the presence of some
    // actions, we have to mark for check on changes.
    this._actionChanges = merge(
      this._allLeadingIcons?.changes,
      this._allTrailingIcons?.changes,
      this._allEditIcons?.changes,
      this._allRemoveIcons?.changes,
    ).subscribe(() => this._changeDetectorRef.markForCheck());
  }

  ngDoCheck(): void {
    //this._rippleLoader.setDisabled(this._elementRef.nativeElement, this._isRippleDisabled());
  }

  override ngOnDestroy() {
    super.ngOnDestroy();
    this._actionChanges?.unsubscribe();
    this.destroyed.emit({chip: this});
    this.destroyed.complete();
  }

  /**
   * Allows for programmatic removal of the chip.
   *
   * Informs any listeners of the removal request. Does not remove the chip from the DOM.
   */
  remove(): void {
    if (this.removable) {
      this._hadFocusOnRemove = this._hasFocus();
      this.removed.emit({chip: this});
    }
  }

  /** Whether the ripple should be disabled. */
  /*
  _isRippleDisabled(): boolean {
    return (
      this.disabled ||
      this.disableRipple ||
      this._animationsDisabled ||
      this._isBasicChip ||
      !!this._globalRippleOptions?.disabled
    );
  }
  */

  /** Returns whether the chip has a trailing icon. */
  _hasTrailingIcon() {
    return !!(this.trailingIcon || this.removeIcon);
  }

  /** Handles keyboard events on the chip. */
  _handleKeydown(event: KeyboardEvent) {
    // Ignore backspace events where the user is holding down the key
    // so that we don't accidentally remove too many chips.
    if ((event.keyCode === BACKSPACE && !event.repeat) || event.keyCode === DELETE) {
      event.preventDefault();
      this.remove();
    }
  }

  /** Allows for programmatic focusing of the chip. */
  override focus(): void {
    super.focus();

    if (!this.disabled) {
      // If `focus` is called before `ngAfterViewInit`, we won't have access to the primary action.
      // This can happen if the consumer tries to focus a chip immediately after it is added.
      // Queue the method to be called again on init.
      if (this.primaryAction) {
        this.primaryAction.focus();
      } else {
        this._pendingFocus = true;
      }
    }
  }

  /** Gets the action that contains a specific target node. */
  _getSourceAction(target: Node): CuteChipAction | undefined {
    return this._getActions().find(action => {
      const element = action._elementRef.nativeElement;
      return element === target || element.contains(target);
    });
  }

  /** Gets all the actions within the chip. */
  _getActions(): CuteChipAction[] {
    const result: CuteChipAction[] = [];

    if (this.editIcon) {
      result.push(this.editIcon);
    }

    if (this.primaryAction) {
      result.push(this.primaryAction);
    }

    if (this.removeIcon) {
      result.push(this.removeIcon);
    }

    if (this.trailingIcon) {
      result.push(this.trailingIcon);
    }

    return result;
  }

  /** Handles interactions with the primary action of the chip. */
  protected _handlePrimaryActionInteraction() {
    // Empty here, but is overwritten in child classes.
  }

  /** Handles interactions with the edit action of the chip. */
  _edit(event: Event) {
    // Empty here, but is overwritten in child classes.
  }

  /** Gets the tabindex of the chip. */
  protected _getTabIndex() {
    if (!this.role) {
      return null;
    }
    return this.disabled ? -1 : this.tabIndex;
  }

  /** Starts the focus monitoring process on the chip. */
  private _monitorFocus() {
    this._focusMonitor.monitor(this._elementRef, true).subscribe(origin => {
      const hasFocus = origin !== null;

      if (hasFocus !== this._hasFocusInternal) {
        this._hasFocusInternal = hasFocus;

        if (hasFocus) {
          this._onFocus.next({chip: this});
        } else {
          // When animations are enabled, Angular may end up removing the chip from the DOM a little
          // earlier than usual, causing it to be blurred and throwing off the logic in the chip list
          // that moves focus not the next item. To work around the issue, we defer marking the chip
          // as not focused until after the next render.
          this.markForCheck();
          setTimeout(() => this._ngZone.run(() => this._onBlur.next({chip: this})));
        }
      }
    });
  }
}
