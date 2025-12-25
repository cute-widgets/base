/**
 * @license Apache-2.0
 *
 * Copyright (c) 2025 CuteWidgets Team. All Rights Reserved.
 *
 * You may not use this file except in compliance with the License
 * that can be found at http://www.apache.org/licenses/LICENSE-2.0
 */

import {Directive, inject, Input, OnInit, TemplateRef, ViewContainerRef} from '@angular/core';
import {LayoutBreakpoint} from "@cute-widgets/base/core/types";
import {bsBreakpoints} from "@cute-widgets/base/core/layout";

/**
 * ```HTML
 * <div cuteResponsive="md, lg">
 *   This content is visible on medium and large screens.
 * </div>
 * ```
 */
@Directive({
  selector: '[cuteResponsive]',
  standalone: true,
})
export class CuteResponsive implements OnInit {
  private templateRef = inject(TemplateRef);
  private viewContainer = inject(ViewContainerRef);

  /** Comma-separated screen size breakpoints (e.g., 'md, lg') or an array of it. */
  @Input("cuteResponsive") breakPoints?: string | LayoutBreakpoint[];

  constructor() {}

  ngOnInit() {
    this.detectScreenSize();
  }

  private detectScreenSize() {
    const screenWidth = this.getScreenWidth();
    if (this.breakPoints?.includes(screenWidth)) {
      this.viewContainer.createEmbeddedView(this.templateRef);
    } else {
      this.viewContainer.clear();
    }
  }

  private getScreenWidth(): LayoutBreakpoint {
    const width = window.innerWidth;
    if (width >= bsBreakpoints.grid.xxl) { return 'xxl'; } else
    if (width >= bsBreakpoints.grid.xl) { return 'xl'; } else
    if (width >= bsBreakpoints.grid.lg) { return 'lg'; } else
    if (width >= bsBreakpoints.grid.md) { return 'md'; } else
    if (width >= bsBreakpoints.grid.sm) { return 'sm'; } else
    { return 'xs'; }
  }
}
