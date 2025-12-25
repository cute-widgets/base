/**
 * @license Apache-2.0
 *
 * Copyright (c) 2025 CuteWidgets Team. All Rights Reserved.
 *
 * You may not use this file except in compliance with the License
 * that can be found at http://www.apache.org/licenses/LICENSE-2.0
 */
import {inject, Pipe, PipeTransform, SecurityContext} from '@angular/core';
import {DomSanitizer, SafeValue} from "@angular/platform-browser";

/**
 * Gets a safe value from either a known safe value or a value with unknown safety.
 *
 * @example
 * ```html
 * <div [innerHTML]="item.htmlContent | sanitize:'html'"></div>
 * ```
 */
@Pipe({
  name: 'sanitize'
})
export class CuteSanitizePipe implements PipeTransform {
  protected sanitizer: DomSanitizer = inject(DomSanitizer);

  transform(value: any, context: 'html'|'style'|'script'|'url'|'resourceUrl'|'none' = 'html'): SafeValue|null {
    if (typeof value==="string") {
      switch (context.toLowerCase()) {
        case 'html': return this.sanitizer.sanitize(SecurityContext.HTML, value);
        case 'style': return this.sanitizer.sanitize(SecurityContext.STYLE, value);
        case 'script': return this.sanitizer.sanitize(SecurityContext.SCRIPT, value);
        case 'url': return this.sanitizer.sanitize(SecurityContext.URL, value);
        case 'resourceUrl': return this.sanitizer.sanitize(SecurityContext.RESOURCE_URL, value);
        case 'none': return this.sanitizer.sanitize(SecurityContext.NONE, value);
        default: throw new Error(`Invalid security context specified: ${context}`);
      }
    }
    return "";
  }
}
