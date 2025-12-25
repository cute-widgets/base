/**
 * @license Apache-2.0
 *
 * Copyright (c) 2025 CuteWidgets Team. All Rights Reserved.
 *
 * You may not use this file except in compliance with the License
 * that can be found at http://www.apache.org/licenses/LICENSE-2.0
 */
import {Directive, ElementRef, inject, Input} from "@angular/core";
import {RelativeSize} from "@cute-widgets/base/core/types";

/** Intro text to be shown underneath the label of the form field control. */
@Directive({
  selector: 'cute-intro',
  exportAs: 'cuteIntro',
  host: {
    '[style.font-size]': 'magnitude=="small" ? "0.875rem" : (magnitude=="large"? "1.25rem" : "")'
  },
  standalone: true,
})
export class CuteIntro /* extends ... */ {
  private _elementRef = inject(ElementRef);

  /** Relative size (scale) of the intro text */
  @Input()
  magnitude: RelativeSize | undefined;

  /** Returns the intro's current text. */
  getText(): string {
    return (this._elementRef.nativeElement as HTMLElement).innerText;
  }

}
