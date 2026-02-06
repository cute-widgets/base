`<cute-form-field>` is a component used to wrap several Cute Widgets components and apply common
`.form-control` styles such as the underline, floating label, and hint messages.

In this document, "form field" refers to the wrapper component `<cute-form-field>` and
"form field control" refers to the component that the `<cute-form-field>` is wrapping
(e.g. the input, textarea, select, etc.)

The following Cute Widgets components are designed to work inside a `<cute-form-field>`:
* [`<input cuteNativeControl>` &amp; `<textarea cuteNativeControl>`](https://cutewidgets.com/components/input)
* [`<select cuteNativeControl>`](https://cutewidgets.com/components/select)
* [`<cute-select>`](https://cutewidgets.com/components/select)
* [`<cute-chip-list>`](https://cutewidgets.com/components/chips)

<!-- example(form-field-overview) -->

### Form field appearance variants
`cute-form-field` supports two different appearance variants which can be set via the `appearance`
input: `fill` and `outline`. The `fill` appearance displays the form field with a filled background
box and an underline, while the `outline` appearance shows the form field with a border all the way
around.

Out of the box, if you do not specify an `appearance` for the `<cute-form-field>` it will default to
`fill`. However, this can be configured using a global provider to choose a different default
appearance for your app.

```ts
@NgModule({
  providers: [
    {provide: CUTE_FORM_FIELD_DEFAULT_OPTIONS, useValue: {appearance: 'outline'}}
  ]
})
```

<!-- example(form-field-appearance) -->

### Floating label

The floating label is a text label displayed on top of the form field control when
the control does not contain any text or when `<select cuteNativeControl>` does not show any option
text. By default, no floating is applied to label. The `floatLabel` property of `<cute-form-field>` can be used 
to change this default floating behavior. It can be set to `always` to float the label even when no text 
is present in the form field control, or to `auto` when the floating label floats above the form field control
only if it contains any text. Set it to `never` to restore the default behavior. The label for a form field can be specified by adding a `cute-label` element.  

If the form field control is marked with a `required` attribute, an asterisk will be appended to the
label to indicate the fact that it is a required field. If unwanted, this can be disabled by
setting the `hideRequiredMarker` property on `<cute-form-field>`.

<!-- example(form-field-label) -->

The floating label behavior can be adjusted globally by providing a value for
`CUTE_FORM_FIELD_DEFAULT_OPTIONS` in your application's root module. Like the `floatLabel` input,
the option can be either set to `never`,`always` or `auto`.

```ts
@NgModule({
  providers: [
    {provide: CUTE_FORM_FIELD_DEFAULT_OPTIONS, useValue: {floatLabel: 'always'}}
  ]
})
```

### Hint labels

Hint labels are additional descriptive text that appears below the form field's underline. A
`<cute-form-field>` can have up to two hint labels; one start-aligned (left in an LTR language, right
in RTL), and one end-aligned.

Hint labels are specified in one of two ways: either by using the `hintLabel` property of
`<cute-form-field>`, or by adding a `<cute-hint>` element inside the form field. When adding a hint
via the `hintLabel` property, it will be treated as the start hint. Hints added via the
`<cute-hint>` hint element can be added to either side by setting the `align` property on
`<cute-hint>` to either `start` or `end`. Attempting to add multiple hints to the same side will
raise an error.

<!-- example(form-field-hint) -->

### Error messages

Error messages can be shown under the form field underline by adding `cute-error` elements inside the
form field. Errors are hidden initially and will be displayed on invalid form fields after the user
has interacted with the element or the parent form has been submitted. Since the errors occupy the
same space as the hints, the hints are hidden when the errors are shown.

If a form field can have more than one error state, it is up to the consumer to toggle which
messages should be displayed. This can be done with CSS, `@if` or `@switch`. Multiple error
messages can be shown at the same time if desired, but the `<cute-form-field>` only reserves enough
space to display one error message at a time. Ensuring that enough space is available to display
multiple errors is up to the user.

```html
<cute-form-field>
    <cute-label>Enter your email</cute-label>
    <input
      cuteInput
      placeholder="pat@example.com"
      [formControl]="email"
      (blur)="updateErrorMessage()"
      required
    />
    @if (email.invalid) {
      <cute-error>{{errorMessage()}}</cute-error>
    }
  </cute-form-field>
```

> **Important!**
> Due to a fundamental limitation of the Angular content projection system, more than one nested control flow 
> statements (@if, @for, @switch) are not supported. Until this bug is fixed, you should move the `cute-error`'s 
> content creation logic to the component code or use a combination of the deprecated structured directives 
> (NgIf, NgFor, NgSwitch) and the new control flow blocks as a workaround.
> See this issue discussion [hear](https://github.com/angular/angular/issues/54035#issuecomment-1906512645) and 
> [hear](https://github.com/angular/angular/issues/64504).
> 

### Prefix & suffix

Custom content can be included before and after the input tag, as a prefix or suffix. It will be
included within the visual container that wraps the form control as per the Cute Widgets specification.

Adding the `cutePrefix` directive to an element inside the `<cute-form-field>` will designate it as
the prefix. Similarly, adding `cuteSuffix` will designate it as the suffix.

If the prefix/suffix content is purely text-based, it is recommended to use the `cuteTextPrefix` or
`cuteTextSuffix` directives which ensure that the text is aligned with the form control.

<!-- example(form-field-prefix-suffix) -->

### Custom form field controls

In addition to the form field controls that Cute Widgets provides, it is possible to create
custom form field controls that work with `<cute-form-field>` in the same way. For additional
information on this see the guide on
[Creating Custom cute-form-field Controls](/guide/creating-a-custom-form-field-control).

### Theming

`<cute-form-field>` has a `color` property which can be set to one of the options of
the Bootstrap’s color palette. This will set the color of the form field underline and 
floating label based on the theme colors of your app.

<!-- example(form-field-theming) -->

### Accessibility

By itself, `CuteFormField` does not apply any additional accessibility treatment to a control.
However, several of the form field's optional features interact with the control contained within
the form field.

When you provide a label via `<cute-label>`, `CuteFormField` automatically associates this label with
the field's control via a native `<label>` element, using the `for` attribute to reference the
control's ID.

If a floating label is specified, it will be automatically used as the label for the form
field control. If no floating label is specified, the user should label the form field control
themselves using `aria-label`, `aria-labelledby` or `<label for=...>`.

When you provide informational text via `<cute-hint>` or `<cute-error>`, `CuteFormField` automatically
adds these elements' IDs to the control's `aria-describedby` attribute. Additionally, `CuteError`
applies `aria-live="polite"` by default such that assistive technology will announce errors when
they appear.

### Troubleshooting

#### Error: A hint was already declared for align="..."

This error occurs if you have added multiple hints for the same side. Keep in mind that the
`hintLabel` property adds a hint to the start side.

#### Error: cute-form-field must contain a CuteFormFieldControl

This error occurs when you have not added a form field control to your form field. If your form
field contains a native `<input>` or `<textarea>` element, make sure you've added the `cuteInput`
directive to it and have imported `CuteInputModule`. Other components that can act as a form field
control include `<cute-select>`, `<cute-chip-list>`, and any custom form field controls you've
created.
