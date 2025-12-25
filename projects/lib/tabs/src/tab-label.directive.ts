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
import {Directive, InjectionToken, inject} from '@angular/core';
import {CUTE_TAB} from "./tab.component";

/**
 * Injection token that can be used to reference instances of `CuteTabLabel`. It serves as
 * alternative token to the actual `CuteTabLabel` class which could cause unnecessary
 * retention of the class and its directive metadata.
 */
export const CUTE_TAB_LABEL = new InjectionToken<CuteTabLabel>('CuteTabLabel');

/** Used to flag tab labels for use with the portal directive */
@Directive({
  selector: 'ng-template[cute-tab-label], ng-template[cuteTabLabel]',
  exportAs: 'cuteTabLabel',
  providers: [{provide: CUTE_TAB_LABEL, useExisting: CuteTabLabel}],
})
export class CuteTabLabel {
  _closestTab = inject(CUTE_TAB, {optional: true});
}
