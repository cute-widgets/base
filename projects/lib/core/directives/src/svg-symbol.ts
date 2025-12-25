/**
 * @license Apache-2.0
 *
 * Copyright (c) 2025 CuteWidgets Team. All Rights Reserved.
 *
 * You may not use this file except in compliance with the License
 * that can be found at http://www.apache.org/licenses/LICENSE-2.0
 */
import {Directive, ElementRef, inject, Input, OnInit, SecurityContext} from "@angular/core";
import {DomSanitizer} from "@angular/platform-browser";

/**
 * Appends `<use href=[symbolPath]>` as a child element of the SVG.
 * @example
 * ```html
 * <svg width="1em" height="1em" [cuteSvgSymbol]="BOOTSTRAP_ICONS+'#collection'"></svg>
 * ```
 */
@Directive({
  selector: 'svg[cuteSvgSymbol]',
  host: {
    '[attr.cuteSvgSymbol]': 'null',
    'ngSkipHydration': 'true',
  },
  standalone: true,
})
export class CuteSvgSymbol implements OnInit {
  private _elementRef = inject<ElementRef<SVGElement>>(ElementRef);
  private _sanitizer = inject(DomSanitizer);

  /** Path to SVG **symbol** element including its `id` prefixed with **#**. */
  @Input({alias: "cuteSvgSymbol", required: true}) svgSymbol: string|null = null ;

  constructor() {
  }

  ngOnInit() {
    const url = this._sanitizer.sanitize(SecurityContext.URL, this.svgSymbol);
    if (url) {
      this._elementRef.nativeElement.innerHTML = `<use href="${url}"></use>`;
    }
  }

}
