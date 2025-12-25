export interface ToolbarItem {
  /** Icon ligature */
  icon?: string;
  /** Icon color */
  iconColor?: string;
  /** Specifies the order of the item in the toolbar */
  order?: number;
  /** Specifies the amount of empty space before the item in the toolbar */
  spaces?: number;
  /** Specifies the text that displays in the toolbar item when the display text option is on for toolbars */
  text?: string;
  /** Specifies whether the toolbar item displays. Default is _false_ */
  visible?: boolean;
}
