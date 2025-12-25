import { Component } from '@angular/core';
import {CutePaginatorModule, PageEvent} from '@cute-widgets/base/paginator';
import {FormsModule} from '@angular/forms';
import {CuteFormFieldModule} from '@cute-widgets/base/form-field';
import {CuteInputModule} from '@cute-widgets/base/input';
import {CuteCheckboxModule} from '@cute-widgets/base/checkbox';
import {JsonPipe} from '@angular/common';
import {CuteDivider} from '@cute-widgets/base/divider';
import {CuteHStack, CuteVStack} from '@cute-widgets/base/layout';
import {CuteSelectModule} from '@cute-widgets/base/select';
import {ThemeColor} from '@cute-widgets/base/core';

@Component({
  selector: 'app-paginator',
  imports: [
    FormsModule,
    CuteFormFieldModule,
    CuteInputModule,
    CuteCheckboxModule,
    CutePaginatorModule,
    JsonPipe,
    CuteDivider,
    CuteVStack,
    CuteHStack,
    CuteSelectModule,
  ],
  templateUrl: './paginator.html',
  styleUrl: './paginator.scss',
})
export class PaginatorPage {
  length = 50;
  pageSize = 10;
  pageIndex = 0;
  pageSizeOptions = [5, 10, 25];

  hidePageSize = false;
  showPageSizeOptions = true;
  showFirstLastButtons = true;
  disabled = false;
  color: ThemeColor | undefined;

  pageEvent: PageEvent | undefined;

  handlePageEvent(e: PageEvent) {
    this.pageEvent = e;
    this.length = e.length;
    this.pageSize = e.pageSize;
    this.pageIndex = e.pageIndex;
  }

  setPageSizeOptions(setPageSizeOptionsInput: string) {
    if (setPageSizeOptionsInput) {
      this.pageSizeOptions = setPageSizeOptionsInput.split(',').map(str => +str);
    }
  }
}
