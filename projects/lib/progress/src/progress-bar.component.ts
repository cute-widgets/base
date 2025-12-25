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
  Component, Directive,
  EventEmitter, inject, InjectionToken,
  Input,
  numberAttribute,
  Output,
  ViewEncapsulation
} from "@angular/core";
import {CuteBaseControl} from "@cute-widgets/base/abstract";
import {ThemeColor} from "@cute-widgets/base/core";
import {CuteProgressStacked} from "./progress-stacked.component";

const MIN_VALUE = 0;
const MAX_VALUE = 100;
const DEFAULT_THICKNESS = "1.125rem";

export type ProgressBarMode = 'determinate' | 'indeterminate' | 'buffer' | 'query';

export interface CuteProgressEvent {
  value: number;
  complete: boolean;
  sender: CuteProgressBar,
}

/** Default `cute-progress-bar` options that can be overridden. */
export interface CuteProgressBarDefaultOptions {
  /**
   * Default theme color of the progress bar. */
  color?: ThemeColor;

  /** Default mode of the progress bar. */
  mode?: ProgressBarMode;
}

/** Injection token to be used to override the default options for `cute-progress-bar`. */
export const CUTE_PROGRESS_BAR_DEFAULT_OPTIONS = new InjectionToken<CuteProgressBarDefaultOptions>(
  'CUTE_PROGRESS_BAR_DEFAULT_OPTIONS',
);

let nextId: number = 0;

@Component({
  selector: 'cute-progress-bar',
  templateUrl: './progress-bar.component.html',
  styleUrls: ['./progress-bar.component.scss'],
  exportAs: 'cuteProgressBar',
  host: {
    'class': 'cute-progress-bar',
    '[class.vertical-progress]': 'vertical',
    '[class.cute-progress-bar-stacked]': 'isStackMember()',
    '[style.width]': '(vertical && (thickness ?? "1rem")) || undefined',
    // set tab index to -1 so screen readers will read the aria-label
    // Note: there is a known issue with JAWS that does not read progressbar aria labels on FireFox
    'tabindex': '-1',
    '[attr.mode]': 'mode',
    '[attr.id]': 'id || null',
  },
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
})
export class CuteProgressBar extends CuteBaseControl {

  private _valueUpdated: boolean = false;
  protected progressStacked = inject(CuteProgressStacked, {optional: true, host: true})

  /** Mode of the progress bar. */
  @Input()
  get mode(): ProgressBarMode { return this._mode; }
  set mode(value: ProgressBarMode) {
    // Note that we don't technically need a getter and a setter here,
    // but we use it to match the behavior of the existing cute-progress-bar.
    if (value !== this._mode) {
      this._mode = value;
      if (value=="determinate") {
        const event = this._createProgressEvent();
        this.progressChange.emit(event);
      }
      this.markForCheck();
    }
  }
  private _mode: ProgressBarMode = 'determinate';

  /** The current progress value. Defaults to _zero_. Mirrored to `aria-valuenow`. */
  @Input({transform: numberAttribute})
  get value(): number {return this._value};
  set value(v: number) {
    let changed: boolean = true;
    if (v == this._value) return;
    if (v >= this.minimum && v <= this.maximum) {
      this._value = v;
    } else if (v > this.maximum) {
      if (this.autoReset) {
        this._value = this.minimum;
        if (this.mode == "determinate") {
          this.progressReset.emit();
        }
      } else {
        this._value = this.maximum;
      }
    } else if (v < this.minimum) {
      this._value = this.minimum;
    } else {
      changed = false;
    }
    if (changed) {
      if (this.mode == "determinate") {
        this._valueUpdated = true;
        const event = this._createProgressEvent();
        this.progressChange.emit( event );
      }
      this.markForCheck();
    }
  }
  private _value: number = MIN_VALUE;

  /** Progress minimum value. Default is 0. */
  @Input({transform: numberAttribute})
  get minimum(): number {return this._minimum;}
  set minimum(value: number) {
    if (value >= MIN_VALUE) {
      this._minimum = Math.min(Math.max(value, MIN_VALUE), this.maximum);
      if (this.value < this._minimum) {
        // Correct the current value
        this.value = this._minimum;
      }
    }
  }
  private _minimum: number = MIN_VALUE;

  /** Progress maximum value. Default is 100. */
  @Input({transform: numberAttribute})
  get maximum(): number {return this._maximum;}
  set maximum(value: number) {
    if (value >= MIN_VALUE) {
      this._maximum = Math.max(value, this.minimum);
      if (this.value > this._maximum) {
        this.value = this._maximum;
      }
    }
  }
  private _maximum: number = MAX_VALUE;

  /** Progress step value. Default is 10. */
  @Input({transform: numberAttribute})
  get step(): number {return this._step;}
  set step(value: number) {
    this._step = Math.max( Math.min(value, this.maximum - this.minimum), 1);
  }
  private _step: number = 10;

  /** Whether the minimum progress value be automatically set when the maximum value is reached. */
  @Input({transform: booleanAttribute}) autoReset: boolean = false;

  /** Whether the component should display the current percentage or message label above the progress. */
  @Input({transform: booleanAttribute}) showLabel: boolean = false;

  /** Whether to apply a stripe via CSS gradient over the progress bar’s background color. */
  @Input({transform: booleanAttribute}) striped: boolean = false;

  /** Whether the striped gradient should be animated. */
  @Input({transform: booleanAttribute}) stripedAnimated: boolean = false;

  /** Messages that are used as progress labels. */
  @Input() messages: string[] | undefined;

  /** Message labels colors. The number of items may differ from `messages` array size. */
  @Input() messageColors: ThemeColor[] | undefined;

  /** Bar's height for horizontal progress and width for vertical one. The changing this value is ignored if the progress bar is contained in the `cute-progress-bar-stack`. */
  @Input()
  get thickness(): string|undefined { return this.progressStacked?.thickness ?? this._thickness ?? DEFAULT_THICKNESS; }
  set thickness(value: string|undefined) { this._thickness = value;}
  private _thickness: string | undefined;

  /** Whether the progress bar should be vertical. The changing this value is ignored if the progress bar is contained in the `cute-progress-bar-stack`. */
  @Input({transform: booleanAttribute})
  get vertical(): boolean { return this.progressStacked?.vertical ?? this._vertical;}
  set vertical(value: boolean) { this._vertical = value; }
  private _vertical: boolean = false;

  /** Event emitted when the progress value has been changed. */
  @Output() readonly progressChange = new EventEmitter<CuteProgressEvent>();

  /** Event emitted when the progress value has been auto reset to the `minimum` value. */
  @Output() readonly progressReset = new EventEmitter<void>();

  constructor() {
    super();

    const defaults = inject<CuteProgressBarDefaultOptions>(CUTE_PROGRESS_BAR_DEFAULT_OPTIONS, {
      optional: true,
    });

    if (defaults) {
      if (defaults.color) {
        this.color = this.defaultColor = defaults.color;
      }

      this.mode = defaults.mode || this.mode;
    }

  }

  private _createProgressEvent(): CuteProgressEvent {
    return {value: this.value, complete: this.value===this.maximum, sender: this};
  }

  protected generateId(): string {
    return `cute-progress-bar-${nextId++}`;
  }

  protected isStackMember(): boolean {
    return this.progressStacked != null;
  }

  protected getMessageIndex(): number {
    if (this.messages && this.messages.length > 0) {
      return Math.floor( this.value / (this.maximum - this.minimum) * this.messages.length);
    }
    return -1;
  }

  /** Returns the current completion percentage. */
  getPercent(): number {
    if (this.mode=="determinate") {
      return Math.round((this.value - this.minimum) / (this.maximum - this.minimum) * 100);
    }
    return 100;
  }

  /** Retrieves the progressbar calculated label. */
  getLabel(): string {
    const index = this.getMessageIndex();
    if (index >= 0) {
      return this.messages![index];
    }
    return `${this.getPercent()}%`;
  }

  /** Returns the progressbar label color */
  getLabelColor(): string | null {
    if (this.messageColors && this.messageColors.length > 0) {
      const index = this.getMessageIndex();
      if (index >= 0) {
        const colorIndex = Math.floor(index / this.messages!.length * this.messageColors.length);
        return this.messageColors[colorIndex];
      }
    }
    return null;
  }

  /**
   * Increments/decrements progress value.
   * @param nStep Step to increment/decrement the current progress value. Default is the component's {@link step} value.
   */
  increment(nStep?: number) {
    this.value += nStep ?? this.step;
  }

  override ngOnInit() {
    super.ngOnInit();

    if ( !this._valueUpdated ) {
      // Sending the current value to the realm
      this.progressChange.emit( this._createProgressEvent() );
    }
  }

}
