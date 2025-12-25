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

/**
 * Throws an exception for the case when menu's x-position value isn't valid.
 * In other words, it doesn't match 'before' or 'after'.
 */
export function throwCuteMenuInvalidPositionX() {
    throw Error(`xPosition value must be either 'before' or after'.
      Example: <cute-menu xPosition="before"></cute-menu>`);
}

/**
 * Throws an exception for the case when menu's y-position value isn't valid.
 * In other words, it doesn't match 'above' or 'below'.
 */
export function throwCuteMenuInvalidPositionY() {
    throw Error(`yPosition value must be either 'above' or below'.
      Example: <cute-menu yPosition="above"></cute-menu>`);
}

/**
 * Throws an exception for the case when a menu is assigned
 * to a trigger that is placed inside the same menu.
 */
export function throwCuteMenuRecursiveError() {
    throw Error(
        `cuteMenuTriggerFor: menu cannot contain its own trigger. Assign a menu that is ` +
        `not a parent of the trigger or move the trigger outside of the menu.`,
    );
}
