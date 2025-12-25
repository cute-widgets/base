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
import {
  animate,
  AnimationTriggerMetadata,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';

/**
 * Animations used by CuteTooltip.
 */
export const cuteTooltipAnimations: {
  readonly tooltipState: AnimationTriggerMetadata;
} = {
  /** Animation that transitions a tooltip in and out. */
  tooltipState: trigger('state', [
    // TODO(crisbeto): these values are based on MDC's CSS.
    // We should be able to use their styles directly once we land #19432.
    state('initial, void, hidden', style({opacity: 0, transform: 'scale(0.8)'})),
    state('visible', style({transform: 'scale(1)'})),
    transition('* => visible', animate('150ms cubic-bezier(0, 0, 0.2, 1)')),
    transition('* => hidden', animate('75ms cubic-bezier(0.4, 0, 1, 1)')),
  ]),
};
