/**
 * @license Apache-2.0
 *
 * Copyright (c) 2025 CuteWidgets Team. All Rights Reserved.
 *
 * You may not use this file except in compliance with the License
 * that can be found at http://www.apache.org/licenses/LICENSE-2.0
 */

export type MouseGeneralCursor =
  | "auto"
  | "default"
  | "none";

export type MouseLinkAndStatusCursor =
  | "context-menu"
  | "help"
  | "pointer"
  | "progress"
  | "wait";

export type MouseSelectionCursor =
  | "cell"
  | "crosshair"
  | "text"
  | "vertical-text";

export type MouseDragAndDropCursor =
  | "alias"
  | "copy"
  | "move"
  | "no-drop"
  | "not-allowed"
  | "grab"
  | "grabbing";

export type MouseResizeAndScrollCursor =
  | "all-scroll"
  | "col-resize"
  | "row-resize"
  | "n-resize"
  | "e-resize"
  | "s-resize"
  | "w-resize"
  | "ne-resize"
  | "nw-resize"
  | "se-resize"
  | "sw-resize"
  | "ew-resize"
  | "ns-resize"
  | "nesw-resize"
  | "nwse-resize";

export type MouseZoomingCursor =
  | "zoom-in"
  | "zoom-out";

export type MouseCursor =
  | MouseGeneralCursor
  | MouseLinkAndStatusCursor
  | MouseSelectionCursor
  | MouseDragAndDropCursor
  | MouseResizeAndScrollCursor
  | MouseZoomingCursor;
