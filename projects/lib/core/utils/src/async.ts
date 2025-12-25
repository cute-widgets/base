/**
 * @license Apache-2.0
 *
 * Copyright (c) 2025 CuteWidgets Team. All Rights Reserved.
 *
 * You may not use this file except in compliance with the License
 * that can be found at http://www.apache.org/licenses/LICENSE-2.0
 */

/**
 * Resolves a promise after the delay time in milliseconds
 * @param ms Number of milliseconds to wait
 *
 * @see {@link Scheduler.wait}
 */
export async function delay (ms: number): Promise<void> {
  return new Promise(resolve => {
    setTimeout(resolve, ms);
  });
}

/**
 * Runs a function after the delay time in milliseconds
 * @param callback Function to run
 * @param ms Number of milliseconds to delay. Default is `0`.
 *
 * @see {@link Scheduler.postTask}
 */
export async function post(callback: Function, ms: number = 0): Promise<void> {
  return new Promise((resolve)=> {
    setTimeout(() => resolve(callback()), ms);
  });
}
