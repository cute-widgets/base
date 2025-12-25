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
import {EventEmitter, TemplateRef, InjectionToken} from '@angular/core';
import {Direction} from '@angular/cdk/bidi';
import {FocusOrigin} from '@angular/cdk/a11y';
import {MenuPositionX, MenuPositionY} from './menu-positions';
import {CuteMenuContent} from './menu-content';

/**
 * Injection token used to provide the parent menu to menu-specific components.
 */
export const CUTE_MENU_PANEL = new InjectionToken<CuteMenuPanel>('CUTE_MENU_PANEL');

/**
 * Interface for a custom menu panel that can be used with `cuteMenuTriggerFor`.
 */
export interface CuteMenuPanel<T = any> {
    xPosition: MenuPositionX;
    yPosition: MenuPositionY;
    overlapTrigger: boolean;
    templateRef: TemplateRef<any>;
    readonly closed: EventEmitter<void | 'click' | 'keydown' | 'tab'>;
    parentMenu?: CuteMenuPanel | undefined;
    direction?: Direction;
    focusFirstItem: (origin?: FocusOrigin) => void;
    resetActiveItem: () => void;
    setPositionClasses?: (x: MenuPositionX, y: MenuPositionY) => void;

   /**
    * @deprecated No longer used and will be removed.
    * @breaking-change 21.0.0
    */
    setElevation?(depth: number): void;
    lazyContent?: CuteMenuContent;
    backdropClass?: string;
    overlayPanelClass?: string | string[];
    hasBackdrop?: boolean;
    readonly panelId?: string;

    /**
     * @deprecated To be removed.
     * @breaking-change 8.0.0
     */
    addItem?: (item: T) => void;

    /**
     * @deprecated To be removed.
     * @breaking-change 8.0.0
     */
    removeItem?: (item: T) => void;
}
