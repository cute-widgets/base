`CuteWidgets` includes the base but powerful `cute-nav` directive which is designed to describe various navigation markups as 
their wrapping component. `CuteNav` enhanced by _flexbox_ and provides a strong foundation for building all types of 
navigation components. It also includes some style overrides (for working with lists), some link padding for 
larger hit areas, and basic disabled styling.

The two main directives, `cute-nav-item` and `cute-nav-link`, can be used as child elements of a `cute-nav` directive, so 
your markup can be very flexible. You can use any html-elements as hosts for these directives. Since `cute-nav` is a flexible 
component, `cute-nav-link`s behave similarly to `cute-nav-item`s, but without additional markup.

### Presentation
You can present the navigation elements in the various styles. Apply `base`, `tabs`, `pills` or `underline` as a value to
`cute-nav` directive.

### Orientation
By default, `cute-nav`'s child elements are horizontal oriented. You can stack your navigation by changing the 
`orientation` input property to `vertical` value.  

### Horizontal alignment
Change the horizontal alignment of your `cute-nav`s with `alignment` input property. By default, 
navs are start-aligned, but you can easily change them to center or end-aligned.

### Fill and Justify
You can determine how the `cute-nav`'s content is stretched by set a value to `stretchItems` input property. 
The available options are taking up the entire available width (**none**), proportionally (**fill**) or equally (**justified**).
The width is determined by the longest `cute-nav-link`'s label. By default, stretching of items is not used (**none**).

### Lazy Loading for `tab` item content
To lazy load a content of a `cute-nav-item` element of `tabs` nav add `<ng-template cute-nav-content>` markup to item's projected content 
as in the following example:
```html
<nav #tab1="cuteNav" cute-nav="tabs" class="me-3">
  <cute-nav-item>
    <a cute-nav-link routerLink="">Profile</a>
    <ng-template cute-nav-content>
      <p>
        This is some placeholder content the <b>Profile</b> tab's associated content. 
        Clicking another tab will toggle the visibility of this one for the next. 
        The tab JavaScript swaps classes to control the content visibility and styling.
        You can use it with tabs, pills, and any other <code>.nav</code>-powered navigation.
        <cute-divider></cute-divider>
        Some more text...
      </p>
    </ng-template>
  </cute-nav-item>
  ...
  <div class="mt-2" style="height: auto">
    <cute-nav-outlet [for]="tab1"></cute-nav-outlet>
  </div>
</nav>
```

> For more featured _tabs_ you can use the `cute-tab-group` component. 

> Most of the time the `cute-nav-item` directive is not so required for nav markups in **Bootstrap** framework. However, in some navigation use cases it is used:
>
> - **tabs**, **pills** and **underline** markups use `cute-nav-item` and `cute-nav-link` both
> - **fill** and **justify** may use `cute-nav-item` to make sure each of the items fill the width
> - lazy loading content definition using `<ng-template cuteNavContent>...</ng-template>` as a projected content of a tab's nav item

### Outputs
Depending on the internal states, `cute-nav` can emit the following output events:

| Event                | Description                                                                                                |
|:---------------------|------------------------------------------------------------------------------------------------------------|
| selectedIndexChange  | Output to enable support for two-way binding on `[(selectedIndex)]`                                        |
| selectedLinkChange   | `CuteNavChangeEvent` emitted when the `nav` selection has changed                                          |
| selectedLinkChanging | `CuteNavChangeEvent` emitted when the `nav` selection gets changing and can be prevented by some condition |
| focusChange          | `CuteNavChangeEvent` emitted when focus has changed within a `nav`-element                                 | 

## Accessibility


### Example
```html
<ul cute-nav="pills">
  <li cute-nav-item>
    <a cute-nav-link [active]="isActive" href="#">Home</a>
  </li>
  <li cute-nav-item>
    <a cute-nav-link href="#">Link 1</a>
  </li>
  <li cute-nav-item>
    <a cute-nav-link href="#">Link 2</a>
  </li>
  <li cute-nav-item>
    <a cute-nav-link disabled>Disabled</a>
  </li>
</ul>
```
