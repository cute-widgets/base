/**
 * @license Apache-2.0
 *
 * Copyright (c) 2025 CuteWidgets Team. All Rights Reserved.
 *
 * You may not use this file except in compliance with the License
 * that can be found at http://www.apache.org/licenses/LICENSE-2.0
 */

import {TreeNode} from "./TreeNode";
import {ToolbarItem} from "./ToolbarItem";

/**
 * Menu Item interface is used for items in a drop-down or cascading menu
 */
export interface MenuItem<D=unknown> extends TreeNode<D> {
  /** An array of the submenu items. */
  children?: MenuItem<D>[];
  /** Whether an item is the default item. */
  default?: (()=>boolean)|boolean;
  /** Is item checked? Default is _false_. */
  checked?: (()=>boolean)|boolean;
  /** Item is clicked (selected or unselected). */
  clicked?: () => void;
  /** Toolbar's item definition. */
  toolBarItem?: ToolbarItem;
}

