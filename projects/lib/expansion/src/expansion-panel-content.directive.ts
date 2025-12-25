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
import {Directive, TemplateRef, inject} from '@angular/core';
import {CUTE_EXPANSION_PANEL, CuteExpansionPanelBase} from './expansion-panel-base';

/**
 * Expansion panel content that will be rendered lazily
 * after the panel is opened for the first time.
 */
@Directive({
  selector: 'ng-template[cuteExpansionPanelContent]',
  standalone: true,
})
export class CuteExpansionPanelContent {
  _template = inject<TemplateRef<any>>(TemplateRef);
  _expansionPanel = inject<CuteExpansionPanelBase>(CUTE_EXPANSION_PANEL, {optional: true});

  constructor(...args: unknown[]);
  constructor() {}
}
