/**
 * @license Apache-2.0
 *
 * Copyright (c) 2025 CuteWidgets Team. All Rights Reserved.
 *
 * You may not use this file except in compliance with the License
 * that can be found at http://www.apache.org/licenses/LICENSE-2.0
 */

/**
 * Gets transition duration total value
 * @param element Source HTML element
 * @returns Duration with delay time in milliseconds
 */
export function getOverallTransitionDuration(element: HTMLElement): number {
  return getTransitionDelay(element) + getTransitionDuration(element);
}

/**
 * Gets transition duration value
 * @param element Source HTML element
 * @returns Duration time in milliseconds
 */
export function getTransitionDuration(element: HTMLElement): number {
  const {transitionDuration } = window.getComputedStyle(element);
  const durationInMilliseconds = transitionDuration.toLowerCase().endsWith("ms");
  const transitionDurationMs = parseFloat(transitionDuration) * (durationInMilliseconds ? 1 : 1000);

  return (transitionDurationMs);
}

/**
 * Gets duration to wait before starting transition
 * @param element Source HTML element
 * @returns Delay time in milliseconds
 */
export function getTransitionDelay(element: HTMLElement): number {
  const { transitionDelay} = window.getComputedStyle(element);
  const delayInMilliseconds = transitionDelay.toLowerCase().endsWith("ms");
  const transitionDelayMs = parseFloat(transitionDelay) * (delayInMilliseconds ? 1 : 1000);

  return (transitionDelayMs);
}

