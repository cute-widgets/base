/**
 * @license Apache-2.0
 *
 * Copyright (c) 2025 CuteWidgets Team. All Rights Reserved.
 *
 * You may not use this file except in compliance with the License
 * that can be found at http://www.apache.org/licenses/LICENSE-2.0
 */

export type TaskPriority = "user-blocking"|"user-visible"|"background";

/**
 * A class with static methods specifically designed for scheduling tasks in the browser.
 */
export class Scheduler {

  /** Yielding to the main thread in the browser. */
  static async yield(): Promise<void> {
    const globalScheduler = (globalThis as any).scheduler;
    if (globalScheduler?.yield) {
      return globalScheduler.yield();
    }

    // Fall back to yielding with setTimeout.
    return new Promise(resolve => {
      setTimeout(resolve, 0);
    });
  }

  /**
   * Resolves a promise after the delay time in milliseconds
   * @param ms Number of milliseconds to wait
   *
   * @see {@link delay}
   */
  static async wait(ms: number): Promise<void> {
    const startNow = performance.now();
    while ((performance.now() - startNow) < ms) {
      await Scheduler.yield();
    }
  }

  /**
   * Adding a task to be scheduled according to their priority.
   * @param callback Function to run
   * @param options Scheduler options
   *
   * @see {@link async.post}
   */
  static async postTask(callback: Function, options?: {priority?: TaskPriority, signal?: any, delay?: number}): Promise<void> {
    const globalScheduler = (globalThis as any).scheduler;
    if (globalScheduler?.postTask) {
      return globalScheduler.postTask(callback, options);
    }
    return new Promise((resolve)=> {
      setTimeout(() => resolve(callback()), options?.delay ?? 0);
    });
  }

}
