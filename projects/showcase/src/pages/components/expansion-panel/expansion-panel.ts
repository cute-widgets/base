import {Component, OnInit, ViewChild} from '@angular/core';
import {CuteExpansionModule, CuteExpansionPanel} from '@cute-widgets/base/expansion';
import {CuteHStack, CuteVStack} from '@cute-widgets/base/layout';
import {CuteCheckbox} from '@cute-widgets/base/checkbox';
import {CuteButton} from '@cute-widgets/base/button';
import {CuteIconModule} from '@cute-widgets/base/icon';
import {ComponentHeader} from '../../../shared/utils/component-header';

@Component({
  selector: 'app-expansion-panel',
  imports: [CuteExpansionModule, CuteVStack, CuteCheckbox, CuteHStack, CuteButton, CuteIconModule, ComponentHeader],
  templateUrl: './expansion-panel.html',
  styleUrl: './expansion-panel.scss',
})
export class ExpansionPanelPage implements OnInit {

  @ViewChild("pan1", {static: true}) panel1!: CuteExpansionPanel

  protected log(...msg: string[]) {
    console.log(...msg);
  }

  ngOnInit() {
    setTimeout(() => this.panel1.open(), 1000);
  }

}
