import {ChangeDetectionStrategy, Component, TemplateRef, ViewChild, ViewEncapsulation} from "@angular/core";
import {DatePipe} from "@angular/common";
import {CuteTabGroup, CuteTabsModule} from "@cute-widgets/base/tabs";
import {CuteHStack, CuteVStack} from "@cute-widgets/base/layout";
import {CuteDivider} from "@cute-widgets/base/divider";
import {ViewportEdge} from "@cute-widgets/base/core";
import {CuteSelectModule} from "@cute-widgets/base/select";
import {CuteFormFieldModule} from "@cute-widgets/base/form-field";
import {CuteInputModule} from "@cute-widgets/base/input";
import {CuteCheckbox} from "@cute-widgets/base/checkbox";
import {FormsModule} from "@angular/forms";
import {CuteButton} from "@cute-widgets/base/button";
import {CuteNav} from '@cute-widgets/base/core/nav';

@Component({
  selector: 'tabs-example',
  templateUrl: './tabs-example.component.html',
  styleUrls: ['./tabs-example.component.scss'],
  exportAs: 'tabsExample',
  host: {},
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    DatePipe,
    CuteTabsModule,
    CuteHStack,
    CuteDivider,
    CuteSelectModule,
    CuteVStack,
    CuteFormFieldModule,
    CuteInputModule,
    CuteCheckbox,
    FormsModule,
    CuteButton,
  ]
})
export class TabsExampleComponent /* extends ... */ {

  protected now = Date.now();
  protected _cursor: string | undefined;

  protected tabEdge: ViewportEdge = "top";
  protected preserveContent = false;
  protected stretchTabs: boolean = false;

  @ViewChild('dynTab', {read: CuteTabGroup, static: true}) dynTab!: CuteTabGroup;
  @ViewChild('ctxContent', {read: TemplateRef, static: true}) dynTemplate!: TemplateRef<any>;

  constructor() {
  }

  log(...args: any[]) {
    console.debug(...args);
  }

  changeCursor(tabs: CuteTabGroup) {
    // if (this._cursor) {
    //   tabs.setCursor(this._cursor);
    //   this._cursor = undefined;
    // } else {
    //   this._cursor = tabs.setCursor("wait");
    // }
  }

  openTab() {
    this.dynTab.addTab("My Tab", this.dynTemplate, {message: "Created from openTab() !!!"})
      .then(cref => {
        cref.instance.link?.focus();
        console.log("Tab added: ", cref.instance.id)
      });
  }

}
