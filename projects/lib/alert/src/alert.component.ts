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
  booleanAttribute,
  ChangeDetectionStrategy,
  Component, EventEmitter,
  Input,
  numberAttribute, Output,
  ViewEncapsulation
} from "@angular/core";
import {CuteButton} from "@cute-widgets/base/button";
import {CuteBaseControl} from "@cute-widgets/base/abstract";

let uniqueId: number = 0;

/** Alert dismiss origin. */
export type AlertDismissOrigin = "program"|"user"|"timer";

/**
 * Provide contextual feedback messages for typical user actions with the handful of available and flexible
 * alert messages.
 */
@Component({
  selector: 'cute-alert',
  template: `
    <div class="cute-alert-content">
      <ng-content></ng-content>
      @if (dismissible) {
        <button cuteButton="close-button"
                magnitude="small"
                style="box-sizing: content-box"
                [color]="color"
                (click)="dismiss('user')"
        ></button>
      }
    </div>
  `,
  styles: `
    .cute-alert {
      display: block;
    }
  `,
  exportAs: 'cuteAlert',
  host: {
    'class': 'cute-alert alert fade',
    '[class.show]': '!isDismissed',
    '[class]': '"alert-"+color',
    '[class.alert-dismissible]': 'dismissible',
    '[id]': 'id || null',
    'role': 'alert',
  },
  imports: [ CuteButton ],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CuteAlert extends CuteBaseControl {

  private _dismissed: boolean = false;
  private _dismissTimer: number|null = null;

  /** Whether the alert can be dismissed interactively. */
  @Input({transform: booleanAttribute})
  dismissible: boolean = false;

  /** The time period in milliseconds after which the alert message is automatically dismissed. */
  @Input({transform: numberAttribute})
  get duration(): number {return this._duration;}
  set duration(ms: number) {
    if (ms >= 0) {
      this._duration = ms;
    }
  }
  private _duration: number = NaN;

  /** Whether the alert has been dismissed. */
  get isDismissed(): boolean { return this._dismissed; }

  /** Event emitted when the alert is dismissed. */
  @Output() dismissed = new EventEmitter<AlertDismissOrigin>();

  constructor() {
    super();
    this.color = "primary";
  }

  protected override generateId(): string {
    return `cute-alert-${uniqueId++}`;
  }

  /** Show alert. */
  show(): void {
    if (this._dismissed) {
      this._dismissed = false;
    }
  }

  /** Dismiss the alert. */
  hide(): void {
    this.dismiss("program");
  }

  /**
   * Hide the alert from screen.
   * @param origin Dismiss origin.
   */
  protected dismiss(origin: AlertDismissOrigin = "program"):void {
    if (!this._dismissed) {
      this._dismissed = true;
      if (this._dismissTimer != null) {
        clearTimeout(this._dismissTimer);
        this._dismissTimer = null;
      }
      this.dismissed.emit(origin);
    }
  }

  override ngOnInit() {
    super.ngOnInit();

    if (this._dismissTimer != null) {
      clearTimeout(this._dismissTimer);
    }
    if (!isNaN(this._duration)) {
      this._dismissTimer = setTimeout(() => this.dismiss("timer"), this._duration);
    }
  }

  override ngOnDestroy() {
    super.ngOnDestroy();

    if (this._dismissTimer != null) {
      clearTimeout(this._dismissTimer);
      this._dismissTimer = null;
    }
  }

}
