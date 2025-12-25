import {Component, inject} from '@angular/core';
import {CuteHStack} from '@cute-widgets/base/layout';
import {CuteButtonModule} from '@cute-widgets/base/button';
import {CuteTooltipModule} from '@cute-widgets/base/tooltip';
import {CuteDialog, CuteDialogConfig } from '@cute-widgets/base/dialog';
import {DialogExampleComponent} from './dialog-example.component';

export interface DialogData {
  animal: string;
  name: string;
}

@Component({
  selector: 'app-dialog',
  imports: [
    CuteHStack,
    CuteButtonModule,
    //CuteTooltipModule
  ],
  templateUrl: './dialog.html',
  styleUrl: './dialog.scss',
})
export class DialogPage {
  private _dialog = inject(CuteDialog);


  openDialog(fullscreen: boolean = false) {
    const dialogRef = this._dialog.open(DialogExampleComponent,
      {
        draggable: "y-axis",
        fullscreenStrategy: fullscreen ? "fullscreen" : "fullscreen-md",
        width: "400px",
        height: "auto",
        position: {top: fullscreen ? "58px" : "70px",},
        maxHeight: fullscreen ? "calc(100vh - 58px)" : "calc(100vh - 80px)",
        //hasBackdrop: false,
        //enterAnimationDuration: 300,
        //exitAnimationDuration: 300,
        //scrollStrategy: new NoopScrollStrategy(),
        data: {name: "ALEX", animal: "CASPER" }
      } as CuteDialogConfig);
    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed with result: '+result);
      //alert("Result is "+result);
    });
  }


}
