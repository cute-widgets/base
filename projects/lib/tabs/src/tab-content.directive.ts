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
import {Directive, InjectionToken, TemplateRef, inject} from '@angular/core';

/**
 * Injection token that can be used to reference instances of `CuteTabContent`. It serves as
 * alternative token to the actual `CuteTabContent` class which could cause unnecessary
 * retention of the class and its directive metadata.
 */
export const CUTE_TAB_CONTENT = new InjectionToken<CuteTabContent>('CuteTabContent');

/** Decorates the `ng-template` tags and reads out the template from it. */
@Directive({
  selector: 'ng-template[cute-tab-content], ng-template[cuteTabContent]',
  providers: [{provide: CUTE_TAB_CONTENT, useExisting: CuteTabContent}],
})
export class CuteTabContent {
  template = inject<TemplateRef<any>>(TemplateRef);
}
