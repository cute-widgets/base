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
import {APP_ID, inject, Injectable} from '@angular/core';

/**
 * Keeps track of the ID count per prefix. This helps us make the IDs a bit more deterministic
 * like they were before the service was introduced. Note that ideally we wouldn't have to do
 * this, but there are some internal tests that rely on the IDs.
 */
const counters: Record<string, number> = {};

/** Service that generates unique IDs for DOM nodes. */
@Injectable({providedIn: 'root'})
export class IdGenerator {
  private _appId = inject(APP_ID);

  /**
   * Generates a unique ID with a specific prefix.
   * @param prefix Prefix to add to the ID.
   */
  getId(prefix: string): string {
    // Omit the app ID if it's the default `ng`. Since the vast majority of pages have one
    // Angular app on them, we can reduce the number of breakages by not adding it.
    if (this._appId !== 'ng') {
      prefix += this._appId;
    }

    if (!counters.hasOwnProperty(prefix)) {
      counters[prefix] = 0;
    }

    return `${prefix}${counters[prefix]++}`;
  }

  /**
   * Generates UUID (ver.4) string using simple algorithm based on random value only
   */
  getUUID(): string {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'
      .replace(/[xy]/g, (c) => {
        const r: number = (Math.random() * 16) | 0,
              v: number = c == 'x' ? r : (r & 0x3) | 0x8;
        return v.toString(16);
      });
  }

}
