import { MenuItem } from "./MenuItem";
import { Focusable } from "./Focusable";

export interface MenuOwner extends Focusable {
  menuItemClicked: (mi: MenuItem) => void;
}
