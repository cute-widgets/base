`<cute-paginator>` provides navigation for paged information, typically used with a table.

````html
<!-- example(paginator-overview) -->
<cute-paginator
  [length]="500"
  [pageSize]="10"
  [pageSizeOptions]="[5, 10, 20]"
  [showFirstLastButtons]="true"
  [showPrevNextLabels]="true"
  [hideBorders]="false"
  middleSectionStyle="range"
  color="secondary"
  magnitude="small"
  alignment="start"
  aria-label="Select page of periodic elements"
  (page)="onPageChanged($event)">
</cute-paginator>
````

### Basic use
Each paginator instance requires:
* The number of items per page (default set to 50)
* The total number of items being paged

The current page index defaults to 0, but can be explicitly set via pageIndex.

When the user interacts with the paginator, a `PageEvent` will be fired that can be used to update
any associated data view.

### Page size options
The paginator displays a dropdown of page sizes for the user to choose from. The options for this
dropdown can be set via `pageSizeOptions`

The current pageSize will always appear in the dropdown, even if it is not included in
pageSizeOptions.

If you want to customize some of the optional of the `cute-select` inside the `cute-paginator`, you
can use the `selectConfig` input.

### Internationalization
The labels for the paginator can be customized by providing your own instance of `CutePaginatorIntl`.
This will allow you to change the following:
1. The label for the length of each page.
2. The range text displayed to the user.
3. The tooltip messages on the navigation buttons.

### Accessibility
The paginator uses `role="group"` to semantically group its child controls. You must add an
`aria-label` or `aria-labelledby` attribute to `<cute-paginator>` with a label that describes
the content controlled by the pagination control.

You can set the `aria-label` attributes for the button and select controls within the paginator in
`CutePaginatorIntl`.
