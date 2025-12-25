/**
 * @license Apache-2.0
 *
 * Copyright (c) 2025 CuteWidgets Team. All Rights Reserved.
 *
 * You may not use this file except in compliance with the License
 * that can be found at http://www.apache.org/licenses/LICENSE-2.0
 */
import {Directive, inject, ViewContainerRef} from '@angular/core';

/**
 * It will be responsible to load components dynamically wherever required in the project.
 */
@Directive({
  selector: '[cuteDynamicChildLoader]'
})
export class CuteDynamicChildLoader {
  public readonly viewContainerRef: ViewContainerRef = inject(ViewContainerRef);
}
