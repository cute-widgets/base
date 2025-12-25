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

/** @docs-private */
export function createMissingDateImplError(provider: string) {
  return Error(
    `CuteDatepicker: No provider found for ${provider}. You must add one of the following ` +
    `to your app config: provideNativeDateAdapter, provideDateFnsAdapter, ` +
    `provideLuxonDateAdapter, provideMomentDateAdapter, or provide a custom implementation.`,
  );
}
