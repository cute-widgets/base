import {MediaMatcher} from '@angular/cdk/layout';
import {ANIMATION_MODULE_TYPE, inject, InjectionToken} from '@angular/core';

/** Object used to configure the animation in Angular Material. */
export interface AnimationsConfig {
  /** Whether all animations should be disabled. */
  animationsDisabled?: boolean;
}

/** Injection token used to configure the animations in CuteWidgets. */
export const CUTE_WIDGETS_ANIMATIONS = new InjectionToken<AnimationsConfig>('CUTE_WIDGETS_ANIMATIONS');

/**
 * @deprecated No longer used, will be removed.
 * @breaking-change 21.0.0
 * @docs-private
 */
export class AnimationCurves {
  static STANDARD_CURVE = 'cubic-bezier(0.4,0.0,0.2,1)';
  static DECELERATION_CURVE = 'cubic-bezier(0.0,0.0,0.2,1)';
  static ACCELERATION_CURVE = 'cubic-bezier(0.4,0.0,1,1)';
  static SHARP_CURVE = 'cubic-bezier(0.4,0.0,0.6,1)';
}

/**
 * @deprecated No longer used, will be removed.
 * @breaking-change 21.0.0
 * @docs-private
 */
export class AnimationDurations {
  static COMPLEX = '375ms';
  static ENTERING = '225ms';
  static EXITING = '195ms';
}

let reducedMotion: boolean | null = null;

/**
 * Gets the configured animations state.
 * @docs-private
 */
export function _getAnimationsState(): 'enabled' | 'di-disabled' | 'reduced-motion' {
  if (
    inject(CUTE_WIDGETS_ANIMATIONS, {optional: true})?.animationsDisabled ||
    inject(ANIMATION_MODULE_TYPE, {optional: true}) === 'NoopAnimations'
  ) {
    return 'di-disabled';
  }

  reducedMotion ??= inject(MediaMatcher).matchMedia('(prefers-reduced-motion)').matches;
  return reducedMotion ? 'reduced-motion' : 'enabled';
}

/**
 * Returns whether animations have been disabled by DI. Must be called in a DI context.
 * @docs-private
 */
export function _animationsDisabled(): boolean {
  return _getAnimationsState() !== 'enabled';
}
