import {ChangeDetectionStrategy, Component, inject, ViewEncapsulation} from "@angular/core";
import {FormControl, ReactiveFormsModule} from "@angular/forms";
import {LiveAnnouncer} from "@angular/cdk/a11y";
import {
  CuteChipInputEvent,
  CuteChipsModule
} from "@cute-widgets/base/chips";
import {CuteButtonModule} from "@cute-widgets/base/button";
import {CuteFormFieldModule} from "@cute-widgets/base/form-field";
import {CuteIconModule} from "@cute-widgets/base/icon";
import {CuteInputModule} from "@cute-widgets/base/input";

@Component({
    selector: 'chips-from-control',
    templateUrl: './chips-from-control.component.html',
    styleUrls: ['./chips-from-control.component.scss'],
    exportAs: 'chipsFromControl',
    host: {},
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [
        CuteButtonModule,
        CuteFormFieldModule,
        CuteIconModule,
        CuteChipsModule,
        ReactiveFormsModule,
        CuteInputModule,
    ]
})
export class ChipsFromControlComponent /* extends ... */ {

  keywords = ['angular', 'how-to', 'tutorial', 'accessibility'];
  formControl = new FormControl(['angular']);

  announcer = inject(LiveAnnouncer);

  removeKeyword(keyword: string) {
    const index = this.keywords.indexOf(keyword);
    if (index >= 0) {
      this.keywords.splice(index, 1);

      this.announcer.announce(`removed ${keyword}`);
    }
  }

  add(event: CuteChipInputEvent): void {
    const value = (event.value || '').trim();

    // Add our keyword
    if (value) {
      this.keywords.push(value);
    }

    // Clear the input value
    event.chipInput!.clear();
  }

  constructor() {
  }

}
