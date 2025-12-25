`<cute-progress-spinner>`, or shortly `<cute-spinner>` is a circular indicator of progress and activity.

<!-- example(progress-spinner-overview) -->

### Progress mode
The progress-spinner supports two modes, "determinate" and "indeterminate". The default mode is "indeterminate".
The `<cute-spinner>` component is an alias for `<cute-progress-spinner mode="indeterminate">`.

| Mode          | Description                                                                      |
|---------------|----------------------------------------------------------------------------------|
| determinate   | Standard progress indicator, fills from 0% to 100%                               |
| indeterminate | Indicates that something is happening without conveying a discrete progress      |


In "determinate" mode, the progress is set via the `value` property, which can be a whole number between 0 and 100.

In "indeterminate" mode, the `value` property is ignored.

### Border and growing

`CuteProgressSpinner` supports two types of spinners - the _border_ and _growing_ spinners.
The both are lightweight loading indicators. But the latter doesn't technically spin, it does repeatedly grow.

### Colors

You can customize the color of border and grow spinners with `color` input property. 
Default color is `currentColor` value.

### Size

You can change the size of the spinner with the `magnitude` input property or set the `diameter` of the spinner explicitly.
The latter has a higher priority.

### Accessibility

`CuteProgressSpinner` implements the ARIA `role="status"` pattern. By default, the spinner
sets `aria-valuemin` to `0` and `aria-valuemax` to `100`. Avoid changing these values, as this may
cause incompatibility with some assistive technology.

Always provide an accessible label via `aria-label` or `aria-labelledby` for each spinner.
