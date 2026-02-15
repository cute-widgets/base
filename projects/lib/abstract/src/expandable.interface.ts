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

  /** Id of the `Expandable` component. */
  id?: string;
  /** Changes the expanded state of the `Expandable` component. */
  expanded: boolean | Signal<boolean>;

  /** Sets the expanded state of the `Expandable` component to _true_. */
  open(): void;
  /** Sets the expanded state of the `Expandable` component to _false_. */
  close(): void;
  /** Toggles the expanded state of the `Expandable` component. */
  toggle(): void;
}
