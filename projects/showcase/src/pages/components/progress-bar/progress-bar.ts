import {Component, OnInit, ViewChild} from '@angular/core';
import {CuteHStack, CuteVStack} from '@cute-widgets/base/layout';
import {CuteProgressBar, CuteProgressBarModule} from '@cute-widgets/base/progress';
import {ThemeColor} from '@cute-widgets/base/core';

@Component({
  selector: 'app-progress-bar',
  imports: [
    CuteVStack,
    CuteProgressBarModule,
    CuteHStack
  ],
  templateUrl: './progress-bar.html',
  styleUrl: './progress-bar.scss',
})
export class ProgressBarPage implements OnInit {
  @ViewChild("pbar_1", {static: true}) pbar1!: CuteProgressBar;
  @ViewChild("pbar_2", {static: true}) pbar2!: CuteProgressBar;

  processingMessages: string[] = ["Pre-processing step...", "Processing step...", "Post-processing step..."]
  processingColors: ThemeColor[] = [] //["info", "link", "warning"];

  ngOnInit() {
    setInterval(()=>{
      this.pbar1.increment();
      this.pbar2.increment();
    }, 200);
  }

}
