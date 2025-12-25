/**
 * @license Apache-2.0
 *
 * Copyright (c) 2025 CuteWidgets Team. All Rights Reserved.
 *
 * You may not use this file except in compliance with the License
 * that can be found at http://www.apache.org/licenses/LICENSE-2.0
 */
import {Directive, inject, TemplateRef} from "@angular/core";

/**
 * Lazy loading content of the `cute-nav-item` element.
 */
@Directive({
  selector: 'ng-template[cuteNavContent], ng-template[cute-nav-content]',
  exportAs: 'cuteNavContent',
  standalone: true,
})
export class CuteNavContent /* extends ... */ {
  public readonly template = inject<TemplateRef<unknown>>(TemplateRef);
}
