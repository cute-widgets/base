import {Component, inject, model, signal} from '@angular/core';
import {CuteHStack, CuteVStack} from '@cute-widgets/base/layout';
import {CuteButtonModule} from '@cute-widgets/base/button';
import {CuteTooltipModule} from '@cute-widgets/base/tooltip';
import {CuteDialog, CuteDialogConfig } from '@cute-widgets/base/dialog';
import {DialogExampleComponent} from './dialog-example.component';
import {ComponentHeader} from '../../../shared/utils/component-header';
import {AbstractPage} from '../abstract/abstract-page';
import {FormsModule} from '@angular/forms';
import {CuteFormFieldModule} from '@cute-widgets/base/form-field';
import {CuteInputModule} from '@cute-widgets/base/input';
import {CuteDialogModule, CuteDialogRef, CUTE_DIALOG_DATA} from '@cute-widgets/base/dialog';
import {CuteFocusInitial} from '@cute-widgets/base/core/directives';

export interface DialogData {
  animal: string;
  name: string;
}

@Component({
  selector: 'app-dialog',
  imports: [
    ComponentHeader,
    CuteButtonModule,
    CuteFormFieldModule,
    CuteHStack,
    CuteVStack,
    FormsModule,
    CuteInputModule,
    //CuteTooltipModule
  ],
  templateUrl: './dialog.html',
  styleUrl: './dialog.scss',
})
export class DialogPage extends AbstractPage {
  private _dialog = inject(CuteDialog);


  readonly animal = signal('');
  readonly name = model('');

  openOverviewDialog(): void {
    const dialogRef = this._dialog.open(DialogOverviewExampleDialog, {
      data: {name: this.name(), animal: this.animal()},
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      if (result !== undefined) {
        this.animal.set(result);
      }
    });
  }


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


@Component({
  selector: 'dialog-overview-example',
  templateUrl: './dialog-overview-example.html',
  imports: [
    CuteFormFieldModule,
    CuteInputModule,
    FormsModule,
    CuteButtonModule,
    CuteDialogModule,
    CuteFocusInitial,
  ],
})
export class DialogOverviewExampleDialog {
  readonly dialogRef = inject(CuteDialogRef<DialogOverviewExampleDialog>);
  readonly data = inject<DialogData>(CUTE_DIALOG_DATA);
  readonly animal = model(this.data.animal);

  onNoClick(): void {
    this.dialogRef.close();
  }
}
