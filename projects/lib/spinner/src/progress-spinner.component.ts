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
  Component, inject, InjectionToken,
  Input,
  numberAttribute,
  ViewEncapsulation
} from "@angular/core";
import {CuteBaseControl} from "@cute-widgets/base/abstract";
import {RelativeSize3} from "@cute-widgets/base/core";
import {RichThemeColor} from '@cute-widgets/base/core/theming';

/** Possible mode for a progress spinner. */
export type ProgressSpinnerMode = 'determinate' | 'indeterminate';

/** Default `cute-progress-spinner` options that can be overridden. */
export interface CuteProgressSpinnerDefaultOptions {
  /**
   * Default theme color of the progress spinner. */
  color?: RichThemeColor;
  /** Diameter of the spinner. */
  diameter?: number;
  /** Relative size of the spinner. */
  magnitude?: RelativeSize3;
  /** Width of the spinner's stroke. */
  strokeWidth?: number;
  /**
   * Whether the animations should be force to be enabled, ignoring if the current environment
   * disables them.
   */
  // _forceAnimations?: boolean;
}

/** Injection token to be used to override the default options for `cute-progress-spinner`. */
export const CUTE_PROGRESS_SPINNER_DEFAULT_OPTIONS =
  new InjectionToken<CuteProgressSpinnerDefaultOptions>('cute-progress-spinner-default-options', {
    providedIn: 'root',
    factory: () => ({magnitude: 'middle'}),
  });

/**
 * Spinner can be used to indicate the loading state or the execution of some time-consuming process in the project.
 */
@Component({
    selector: 'cute-progress-spinner, cute-spinner',
    templateUrl: './progress-spinner.component.html',
    styleUrls: ['./progress-spinner.component.scss'],
    exportAs: 'cuteProgressSpinner',
    host: {
      'class': 'cute-progress-spinner',
      '[class.spinner-border]': '!growing',
      '[class.spinner-grow]': 'growing',
      '[class.spinner-border-sm]': 'magnitude=="small" && !growing',
      '[class.spinner-grow-sm]': 'magnitude=="small" && growing',
      '[class.cute-spinner-border-lg]': 'magnitude=="large" && !growing',
      '[class.cute-spinner-grow-lg]': 'magnitude=="large" && growing',
      '[class]': 'color ? "text-"+color : ""',
      '[style.--bs-spinner-border-width]': 'strokeWidth || null',
      '[style.--bs-spinner-width]': 'diameter || null',
      '[style.--bs-spinner-height]': 'diameter || null',
      '[attr.aria-valuemin]': '0',
      '[attr.aria-valuemax]': '100',
      '[attr.aria-valuenow]': 'mode === "determinate" ? value : null',
      '[attr.aria-label]': 'ariaLabel || null',
      '[attr.mode]': 'mode',
      // set tab index to -1 so screen readers will read the aria-label
      // Note: there is a known issue with JAWS that does not read progressbar aria labels on FireFox
      'tabindex': '-1',
      '[role]': 'mode==="indeterminate"? "status": "progressbar"',
    },
    standalone: true,
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CuteProgressSpinner extends CuteBaseControl {

  /** Mode of the progress spinner. Default is `indeterminate`. */
  @Input() mode: ProgressSpinnerMode = "indeterminate";

  /** Value of the progress bar. Defaults to zero. Mirrored to aria-valuenow. */
  @Input({transform: numberAttribute})
  get value(): number { return this.mode === 'determinate' ? this._value : 0; }
  set value(v: number) {
    this._value = Math.max(0, Math.min(100, v || 0));
  }
  private _value = 0;

  /** Switch to grow-type spinner. */
  @Input({transform: booleanAttribute}) growing: boolean = false;

  /** Relative size of the spinner */
  @Input() magnitude: RelativeSize3 | undefined;

  /** Stroke width of the bordered progress spinner. */
  @Input()
  get strokeWidth(): string|undefined {return this._strokeWidth}
  set strokeWidth(value: string|number|undefined) {
    if (typeof value === "number") {
      value = value+"px";
    } else if (typeof value === "string") {
      if (value.trimEnd().match(/[0-9]$/)) {
        value = Number.parseInt(value)+"px";
      }
    }
    this._strokeWidth = value;
  }
  private _strokeWidth: string | undefined;

  /** Diameter of the progress spinner. */
  @Input()
  get diameter(): string|undefined {return this._diameter}
  set diameter(value: string|number|undefined) {
    if (typeof value === "number") {
      value = value+"px";
    } else if (typeof value === "string") {
      if (value.trimEnd().match(/[0-9]$/)) {
        value = Number.parseInt(value)+"px";
      }
    }
    this._diameter = value;
  }
  private _diameter: string | undefined;

  constructor(...args: unknown[]);
  constructor() {
    super();
    const defaults = inject<CuteProgressSpinnerDefaultOptions>(CUTE_PROGRESS_SPINNER_DEFAULT_OPTIONS, {optional: true});

    this.mode = this._nativeElement.nodeName.toLowerCase()==='cute-spinner' ? 'indeterminate' : 'determinate';

    if (defaults) {
      if (defaults.color)       { this.color = this.defaultColor = defaults.color; }
      if (defaults.diameter)    { this.diameter = defaults.diameter; }
      if (defaults.magnitude)   { this.magnitude = defaults.magnitude; }
      if (defaults.strokeWidth) { this.strokeWidth = defaults.strokeWidth; }
    }
  }

  protected generateId(): string {
    return "";
  }

}
