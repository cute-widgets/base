export interface MenuAction {
  type: "RouterLink"|"ExternalURL"|"AppEvent"|"DwScript";
  text: string;
  target?: "Main"|"Popup"|"Response";
}
