/**
 * @license Apache-2.0
 *
 * Copyright (c) 2025 CuteWidgets Team. All Rights Reserved.
 *
 * You may not use this file except in compliance with the License
 * that can be found at http://www.apache.org/licenses/LICENSE-2.0
 */

import {ChangeDetectionStrategy, Component, InjectionToken, ViewEncapsulation} from "@angular/core";

/**
 * Injection token that can be used for a `CuteSlider` to provide itself as a
 * parent to the `CuteSliderThumb` and `CuteSliderRangeThumb`.
 * Used primarily to avoid circular imports.
 * @docs-private
 */
export const CUTE_SLIDER = new InjectionToken<CuteSlider>('CUTE-SLIDER');


@Component({
  selector: 'cute-slider',
  template: `<ng-content></ng-content>`,
  styles: [`
  `],
  exportAs: 'cuteSlider',
  host: {},
  providers: [
    {provide: CUTE_SLIDER, useExisting: CuteSlider},
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class CuteSlider /* extends ... */ {

  constructor() {
  }

}
