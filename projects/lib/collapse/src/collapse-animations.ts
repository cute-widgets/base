/**
 * @license Apache-2.0
 *
 * Copyright (c) 2025 CuteWidgets Team. All Rights Reserved.
 *
 * You may not use this file except in compliance with the License
 * that can be found at http://www.apache.org/licenses/LICENSE-2.0
 */
import {
  animate,
  AnimationTriggerMetadata,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';

/** Time and timing curve for **collapse** animations. */
export const CUTE_COLLAPSE_ANIMATION_TIMING = '225ms cubic-bezier(0.4,0.0,0.2,1)';

/**
 * Animations used by the CuteWidgets` collapse element.
 */
export const cuteCollapseAnimations: {
  //readonly indicatorRotate: AnimationTriggerMetadata;
  readonly bodyExpansion: AnimationTriggerMetadata;
} = {
  /** Animation that rotates the indicator arrow. */
  /*
  indicatorRotate: trigger('indicatorRotate', [
    state('collapsed, void', style({transform: 'rotate(0deg)'})),
    state('expanded', style({transform: 'rotate(180deg)'})),
    transition(
      'expanded <=> collapsed, void => collapsed',
      animate(EXPANSION_PANEL_ANIMATION_TIMING),
    ),
  ]),
  */
  /** Animation that expands and collapses the panel content. */
  bodyExpansion: trigger('bodyExpansion', [
    state('collapsed, void', style({height: '0px', visibility: 'hidden'})),
    state('collapsed-hor, void', style({width: '0px', visibility: 'hidden'})),
    // Clear the `visibility` while open, otherwise the content will be visible when placed in
    // a parent that's `visibility: hidden`, because `visibility` doesn't apply to descendants
    // that have a `visibility` of their own (see #27436).
    state('expanded', style({height: '*', visibility: ''})),
    state('expanded-hor', style({width: '*', visibility: ''})),
    transition(
      //'expanded <=> collapsed, expanded-hor <=> collapsed-hor, :enter',
      '* => *, :enter, :leave',
      animate(CUTE_COLLAPSE_ANIMATION_TIMING),
    )
  ]),
};
