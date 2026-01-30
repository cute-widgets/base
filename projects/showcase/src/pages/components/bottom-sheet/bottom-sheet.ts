import {Component, inject} from '@angular/core';
import {CuteButton} from '@cute-widgets/base/button';
import {CuteListModule} from '@cute-widgets/base/list';
import {CuteBottomSheetModule, CuteBottomSheet, CuteBottomSheetRef} from '@cute-widgets/base/bottom-sheet';
import {CuteIcon} from '@cute-widgets/base/icon';
import {ComponentHeader} from '../../../shared/utils/component-header';
import {AbstractPage} from '../abstract/abstract-page';

@Component({
  selector: 'app-bottom-sheet',
  imports: [
    CuteButton,
    CuteIcon,
    ComponentHeader
  ],
  templateUrl: './bottom-sheet.html',
  styleUrl: './bottom-sheet.scss',
})
export class BottomSheetPage extends AbstractPage {
  private _bottomSheet = inject(CuteBottomSheet);

  openBottomSheet(): void {
    this._bottomSheet.open(BottomSheetOverviewExampleSheet);
  }
}

@Component({
  selector: 'bottom-sheet-overview-example-sheet',
  templateUrl: 'bottom-sheet-overview-example-sheet.html',
  imports: [CuteListModule],
})
export class BottomSheetOverviewExampleSheet {
  private _bottomSheetRef =
    inject<CuteBottomSheetRef<BottomSheetOverviewExampleSheet>>(CuteBottomSheetRef);

  openLink(event: MouseEvent): void {
    this._bottomSheetRef.dismiss();
    event.preventDefault();
  }
}
