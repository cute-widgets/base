/**
 * @license Apache-2.0
 *
 * Copyright (c) 2025 CuteWidgets Team. All Rights Reserved.
 *
 * You may not use this file except in compliance with the License
 * that can be found at http://www.apache.org/licenses/LICENSE-2.0
 */
import {inject, Pipe, PipeTransform} from '@angular/core';
import { DomSanitizer, SafeValue } from "@angular/platform-browser";

/**
 * Bypass security and trust the given value to be a safe resource.
 * > WARNING: calling this method with untrusted user data exposes your application to XSS security risks!
 * @example
 * ```html
 * <img [src]="item.source | safe:'url'" alt="Item image"/>
 * ```
 */
@Pipe({
  name: 'safe'
})
export class CuteSafePipe implements PipeTransform {
  protected sanitizer: DomSanitizer = inject(DomSanitizer);

  transform(value: any, type: 'html'|'style'|'script'|'url'|'resourceUrl' = "html"): SafeValue {
    if (typeof value==="string") {
      switch (type.toLowerCase()) {
        case 'html': return this.sanitizer.bypassSecurityTrustHtml(value);
        case 'style': return this.sanitizer.bypassSecurityTrustStyle(value);
        case 'script': return this.sanitizer.bypassSecurityTrustScript(value);
        case 'url': return this.sanitizer.bypassSecurityTrustUrl(value);
        case 'resourceUrl': return this.sanitizer.bypassSecurityTrustResourceUrl(value);
        default: throw new Error(`Invalid safe type specified: ${type}`);
      }
    }
    return "";
  }
}
