/**
 * @license Apache-2.0
 *
 * Copyright (c) 2025 CuteWidgets Team. All Rights Reserved.
 *
 * You may not use this file except in compliance with the License
 * that can be found at http://www.apache.org/licenses/LICENSE-2.0
 */
import {Signal} from "@angular/core";

export interface Expandable {

    open(): void;
    close(): void;
    toggle(): void;

    expanded: boolean | Signal<boolean>;

}
