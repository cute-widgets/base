/**
 * @license Apache-2.0
 *
 * Copyright (c) 2025 CuteWidgets Team. All Rights Reserved.
 *
 * You may not use this file except in compliance with the License
 * that can be found at http://www.apache.org/licenses/LICENSE-2.0
 */

import {NgModule} from "@angular/core";
import {CuteObserveVisibility, CuteVisibilityObserver, IntersectionObserverFactory} from "./observe-visibility";
import {CommonModule} from "@angular/common";
import {CuteObserveContent} from "./observe-content";

@NgModule({
  imports: [CommonModule, CuteObserveVisibility, CuteObserveContent],
  exports: [CuteObserveVisibility, CuteObserveContent],
  providers: [
    IntersectionObserverFactory,
    CuteVisibilityObserver,
  ],
})
export class CuteObserversModule {}
