import {Component, inject} from '@angular/core';
import {CuteHStack, CuteVStack} from '@cute-widgets/base/layout';
import {CuteFormFieldModule} from '@cute-widgets/base/form-field';
import {CuteSelectModule} from '@cute-widgets/base/select';
import {CuteButtonModule} from '@cute-widgets/base/button';
import {
  CuteSnackBar,
  CuteSnackBarHorizontalPosition, CuteSnackbarModule, CuteSnackBarRef,
  CuteSnackBarVerticalPosition,
} from '@cute-widgets/base/snack-bar';
import {CuteIconModule} from '@cute-widgets/base/icon';
import {FormsModule} from '@angular/forms';
import {CuteInputModule} from '@cute-widgets/base/input';
import {ThemeColor} from '@cute-widgets/base/core';
import {ComponentHeader} from '../../../shared/utils/component-header';

@Component({
  selector: 'app-snack-bar',
  imports: [
    FormsModule,
    CuteHStack,
    CuteInputModule,
    CuteFormFieldModule,
    CuteSelectModule,
    CuteButtonModule,
    CuteVStack,
    ComponentHeader,
  ],
  templateUrl: './snack-bar.html',
  styleUrl: './snack-bar.scss',
})
export class SnackBarPage {

  private _snackBar = inject(CuteSnackBar);

  poolParty: CuteSnackBarRef<any> | undefined;
  pizzaParty: CuteSnackBarRef<any> | undefined;
  duration: number = 0;
  color: ThemeColor | undefined;

  horizontalPosition: CuteSnackBarHorizontalPosition = 'end';
  verticalPosition: CuteSnackBarVerticalPosition = 'top';

  openSnackBar() {
    this.poolParty = this._snackBar.open('Cannonball!!', "Splash", {
      horizontalPosition: this.horizontalPosition,
      verticalPosition: this.verticalPosition,
      color: this.color,
      gradientFill: true,
      dismissible: false,
      duration: this.duration * 1000,
    });
    this.poolParty.onAction().subscribe(()=>{
      console.log("Pool party with action close.")
    });
    this.poolParty.afterDismissed().subscribe((value)=> {
      console.log("Pool party dismissed. Value="+value.dismissedByAction)
    });
  }

  openPizzaSnackBar() {
    this.pizzaParty = this._snackBar.openFromComponent(PizzaPartyAnnotatedComponent, {
      horizontalPosition: this.horizontalPosition,
      verticalPosition: this.verticalPosition,
      duration: this.duration * 1000,
      color: this.color,
      gradientFill: true,
    });
  }

}

@Component({
  selector: 'snack-bar-annotated-component-example-snack',
  template: `
    <cute-snack-bar-header>
      <cute-icon fontIcon="bootstrap-fill" style="color:blue; font-size: 1rem;" class="me-2"></cute-icon>
      <strong class="me-auto">Bootstrap</strong>
      <small>11 mins ago</small>
      <button cuteButton="close-button" magnitude="small" (click)="snackBarRef.dismiss()"></button>
    </cute-snack-bar-header>

    <div cuteSnackBarBody>
        <span class="example-pizza-party" cuteSnackBarLabel>
            This is a toast message. Pizza party!!!
        </span>
<!--        <span cuteSnackBarActions>-->
<!--          <button cute-button cuteSnackBarAction (click)="snackBarRef.dismissWithAction()">🍕</button>-->
<!--        </span>-->
    </div>
  `,
  styles: [`
    :host {
      display: flex;
      /*align-items: center;*/
    }

    //.example-pizza-party {
    //  color: hotpink;
    //}
  `,
  ],
  imports: [CuteButtonModule, CuteSnackbarModule, CuteIconModule,]
})
export class PizzaPartyAnnotatedComponent {
  snackBarRef = inject(CuteSnackBarRef);
}
