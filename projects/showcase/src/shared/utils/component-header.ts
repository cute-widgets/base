import {Directive} from "@angular/core";

@Directive({
  selector: '[componentHeader]',
  exportAs: 'componentHeader',
  host: {
    'class': 'sticky-top p-3 mb-3 text-center text-md-start bg-body-tertiary'
  },
  standalone: true,
})
export class ComponentHeader /* extends ... */ {

  constructor() {
  }

}
