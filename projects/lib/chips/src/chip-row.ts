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
import {ENTER} from '@angular/cdk/keycodes';
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ContentChild,
  EventEmitter,
  Input,
  Output,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import {CuteChip, CuteChipEvent} from './chip';
import {CuteChipEditInput} from './chip-edit-input';
import {takeUntil} from 'rxjs/operators';
import {CUTE_CHIP} from './tokens';
import {CuteChipAction} from './chip-action';

/** Represents an event fired on an individual `cute-chip` when it is edited. */
export interface CuteChipEditedEvent extends CuteChipEvent {
  /** The final edit value. */
  value: string;
}

/**
 * An extension of the CuteChip component used with CuteChipGrid and
 * the cuteChipInputFor directive.
 */
@Component({
    selector: 'cute-chip-row, [cute-chip-row], cute-basic-chip-row, [cute-basic-chip-row]',
    templateUrl: './chip-row.html',
    styleUrl: './chip.scss',
    host: {
        'class': 'cute-chip-row',
        '[class.cute-chip-with-avatar]': 'leadingIcon',
        '[class.cute-chip-disabled]': 'disabled',
        '[class.cute-chip-editing]': '_isEditing',
        '[class.cute-chip-editable]': 'editable',
        '[class.cute-chip-highlighted]': 'highlighted',
        '[class.cute-chip-with-trailing-icon]': '_hasTrailingIcon()',
        /*
        '[class.mdc-evolution-chip--disabled]': 'disabled',
        '[class.mdc-evolution-chip--with-trailing-action]': '_hasTrailingIcon()',
        '[class.mdc-evolution-chip--with-primary-graphic]': 'leadingIcon',
        '[class.mdc-evolution-chip--with-primary-icon]': 'leadingIcon',
        '[class.mdc-evolution-chip--with-avatar]': 'leadingIcon',
        */
        '[id]': 'id',
        // Has to have a negative tabindex to capture
        // focus and redirect it to the primary action.
        '[attr.tabindex]': 'disabled ? null : -1',
        '[attr.aria-label]': 'null',
        '[attr.aria-description]': 'null',
        '[attr.role]': 'role',
        '(focus)': '_handleFocus($event)',
        '(dblclick)': '_handleDoubleclick($event)',
    },
    providers: [
        { provide: CuteChip, useExisting: CuteChipRow },
        { provide: CUTE_CHIP, useExisting: CuteChipRow },
    ],
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CuteChipAction, CuteChipEditInput]
})
export class CuteChipRow extends CuteChip implements AfterViewInit {
  protected override basicChipAttrName = 'cute-basic-chip-row';

  /**
   * The editing action has to be triggered in a timeout. While we're waiting on it, a blur
   * event might occur which will interrupt the editing. This flag is used to avoid interruptions
   * while the editing action is being initialized.
   */
  private _editStartPending = false;

  @Input() editable: boolean = false;

  /** Emitted when the chip is edited. */
  @Output() readonly edited: EventEmitter<CuteChipEditedEvent> =
                              new EventEmitter<CuteChipEditedEvent>();

  /** The default chip edit input that is used if none is projected into this chip row. */
  @ViewChild(CuteChipEditInput) defaultEditInput?: CuteChipEditInput;

  /** The projected chip edit input. */
  @ContentChild(CuteChipEditInput) contentEditInput?: CuteChipEditInput;

  _isEditing = false;

  constructor(...args: unknown[]);

  constructor() {
    super();

    this.role = 'row';
    this._onBlur.pipe(takeUntil(this.destroyed)).subscribe(() => {
      if (this._isEditing && !this._editStartPending) {
        this._onEditFinish();
      }
    });
  }

  override _hasTrailingIcon() {
    // The trailing icon is hidden while editing.
    return !this._isEditing && super._hasTrailingIcon();
  }

  /** Sends focus to the first gridcell when the user clicks anywhere inside the chip. */
  _handleFocus(event: FocusEvent) {
    if (!this._isEditing && !this.disabled) {
      this.focus();
    }
  }

  override _handleKeydown(event: KeyboardEvent): void {
    if (event.keyCode === ENTER && !this.disabled) {
      if (this._isEditing) {
        event.preventDefault();
        this._onEditFinish();
      } else if (this.editable) {
        this._startEditing(event);
      }
    } else if (this._isEditing) {
      // Stop the event from reaching the chip set in order to avoid navigating.
      event.stopPropagation();
    } else {
      super._handleKeydown(event);
    }
  }

  _handleDoubleclick(event: MouseEvent) {
    if (!this.disabled && this.editable) {
      this._startEditing(event);
    }
  }

  private _startEditing(event: Event) {
    if (
      !this.primaryAction ||
      (this.removeIcon && this._getSourceAction(event.target as Node) === this.removeIcon)
    ) {
      return;
    }

    // The value depends on the DOM so we need to extract it before we flip the flag.
    const value = this.value;

    this._isEditing = this._editStartPending = true;

    // Starting the editing sequence below depends on the edit input
    // query resolving on time. Trigger a synchronous change detection to
    // ensure that it happens by the time we hit the timeout below.
    this._changeDetectorRef.detectChanges();

    // TODO(crisbeto): this timeout shouldn't be necessary given the `detectChange` call above.
    // Defer initializing the input so it has time to be added to the DOM.
    setTimeout(() => {
      this._getEditInput().initialize(value);
      this._editStartPending = false;
    });
  }

  private _onEditFinish() {
    this._isEditing = this._editStartPending = false;
    this.edited.emit({chip: this, value: this._getEditInput().getValue()});

    // If the edit input is still focused or focus was returned to the body after it was destroyed,
    // return focus to the chip contents.
    if (
      this._document.activeElement === this._getEditInput().getNativeElement() ||
      this._document.activeElement === this._document.body
    ) {
      this.primaryAction?.focus();
    }
  }
  /*
  override _isRippleDisabled(): boolean {
    return super._isRippleDisabled() || this._isEditing;
  }
  */

  /**
   * Gets the projected chip edit input, or the default input if none is projected in. One of these
   * two values is guaranteed to be defined.
   */
  private _getEditInput(): CuteChipEditInput {
    return this.contentEditInput || this.defaultEditInput!;
  }
}
