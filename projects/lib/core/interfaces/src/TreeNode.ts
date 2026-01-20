/**
 * @license Apache-2.0
 *
 * Copyright (c) 2025 CuteWidgets Team. All Rights Reserved.
 *
 * You may not use this file except in compliance with the License
 * that can be found at http://www.apache.org/licenses/LICENSE-2.0
 */

import {RichThemeColor} from "@cute-widgets/base/core/theming";

/**
 * A structure that populates the properties for individual items in a TreeView control.
 */
export interface TreeNode<D=unknown> {
  /** Unique identifier */
  id?: string;
  /** Identifies the string label associated with the item. */
  label: string;
  /** Specifies whether the item has children. */
  hasChildren?: boolean;
  /** Children items. */
  children?: TreeNode<D>[];
  /** Item short description */
  microHelp?: string;
  /** Indicates the level of the item in the TreeView control. */
  level?: number;
  /** Any user-defined data. */
  data?: D;
  /** Router link. */
  routerLink?: string | string[];
  /** Identifies the image displayed next to the item label. */
  icon?: string;
  /** Icon color. */
  iconColor?: string;
  /** Icon CSS class(es). */
  iconClass?: string | string[] | Record<string, boolean>;
  /** Identifies the state picture associated with the item. */
  stateIcon?: string;
  /** The badge text associated with the item. */
  badge?: string;
  /** Badge theme color. */
  badgeColor?: RichThemeColor;
  /** Is node enabled? Default is _true_. */
  enabled?: (()=>boolean)|boolean;
  /** Is node visible? Default is _true_. */
  visible?: (()=>boolean)|boolean;

  status?: {
    /** Specifies whether the node is expanded. */
    expanded?: boolean;
    /** Specifies whether the node has been populated with children. */
    populated?: boolean;
    /** Specifies whether the item has focus. */
    hasFocus?: boolean;
    /** Specifies whether the item is selected. */
    selection?: 'checked' | 'indeterminate' | 'unchecked';
  };

}
