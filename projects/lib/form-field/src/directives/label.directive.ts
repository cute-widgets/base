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

/** The floating label for a `cute-form-field`. */
@Directive({
  selector: 'cute-label',
  host: {
    '[style.font-size]': 'magnitude=="small" ? "0.875rem" : (magnitude=="large"? "1.25rem" : "")'
  }
})
export class CuteLabel /* extends ... */ {

  private _elementRef = inject(ElementRef);

  /** Relative size (scale) of the label text. */
  @Input() magnitude: RelativeSize | undefined;

  /** Returns the label's current text. */
  getText(): string {
    return (this._elementRef.nativeElement as HTMLElement).innerText;
  }

}
