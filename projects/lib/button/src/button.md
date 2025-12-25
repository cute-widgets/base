**CuteWidgets'** buttons are native `<button>` or `<a>` elements enhanced with ink ripples.

<!-- example(button-overview) -->

Native `<button>` and `<a>` elements are always used to provide the most straightforward
and accessible experience for users. A `<button>` element should be used whenever some _action_
is performed. An `<a>` element should be used whenever the user will _navigate_ to another view.

There are several button variants, each applied as a value for `cuteButton` attribute:

| Value            | Description                                                                                                                                                                |
|------------------|----------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `base-button`    | Default appearance. Rectangular text button w/ no elevation. Text buttons are used for the lowest priority actions, especially when presenting multiple options.           |
| `raised-button`  | Rectangular contained button w/ elevation. These buttons are medium-emphasis buttons that often used when a button requires visual separation from a patterned background. |
| `flat-button`    | Rectangular contained button w/ no elevation. These buttons are high-emphasis and can be used for final or unblocking actions in a flow, such as saving or confirming.     |
| `outline-button` | Rectangular outlined button w/ no elevation. These buttons are medium-emphasis buttons that often used for actions that need attention but aren't the primary action.      |
| `icon-button`    | Circular button with a transparent background, meant to contain an icon                                                                                                    |
| `fab-button`     | Circular button w/ elevation, defaults to theme's primary color                                                                                                            |
| `pill-button`    | Pelleted style buttons that similar to `filled-button`s, but have rounded edges on the sides.                                                                              |
| `circle-button`  | Circular button                                                                                                                                                            |
| `close-button`   | A generic close button for dismissing content                                                                                                                              |


### Theming
Buttons can be colored in terms of the current theme using the `color` property to set the
background color to one of the following main options: `primary`,`secondary`,`success`,`danger`,`warning`,
`info`,`light`,`dark`,`link` and `tertiary`. There are its variants with `-emphases` and `-contrast` suffixes also.

### Extended FAB buttons
Traditional FAB buttons are circular and only have space for a single icon. However, you can add the
`extended` attribute to allow the FAB to expand into a rounded rectangle shape with space for a text
label in addition to the icon. Only full-sized FABs support the `extended` attribute, mini FABs do
not.

```html
<button cuteButton="fab-button" extended>
  <cute-icon>home</cute-icon>
  Home
</button>
```

### Interactive disabled buttons
Native disabled `<button>` elements cannot receive focus and do not dispatch any events. This can
be problematic in some cases because it can prevent the app from telling the user why the button is
disabled. You can use the `disabledInteractive` input to style the button as disabled but allow for
it to receive focus and dispatch events. The button will have `aria-disabled="true"` for assistive
technology. The behavior can be configured globally through the `CUTE_BUTTON_CONFIG` injection token.

**Note:** Using the `disabledInteractive` input can result in buttons that previously prevented
actions to no longer do so, for example, a `submit` button in a form. When using this input, you should
guard against such cases in your component.

<!-- example(button-disabled-interactive) -->

### Accessibility
Cute Widgets uses native `<button>` and `<a>` elements to ensure an accessible experience by
default. A `<button>` element should be used for any interaction that _performs an action on the
current page_. An `<a>` element should be used for any interaction that _navigates to another
URL_. All standard accessibility best practices for buttons and anchors apply to `CuteButton`.

#### Disabling anchors
`CuteAnchor` supports disabling an anchor in addition to the features provided by the native
`<a>` element. When you disable an anchor, the component sets `aria-disabled="true"` and
`tabindex="-1"`. Always test disabled anchors in your application to ensure compatibility
with any assistive technology your application supports.

#### Buttons with icons
Buttons or links containing only icons (such as `fab-button`, `icon-button` and `close-button`)
should be given a meaningful label via `aria-label` or `aria-labelledby`. [See the documentation
for `CuteIcon`](https://material.angular.io/components/icon) for more
information on using icons in buttons.

#### Toggle buttons
[See the documentation for `CuteButtonToggle`](https://material.angular.io/components/button-toggle)
for information on stateful toggle buttons.
