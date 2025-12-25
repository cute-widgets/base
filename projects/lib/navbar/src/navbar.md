## How it works
Here’s what you need to know before getting started with the navbar:

* Navbars require a wrapping `<cute-navbar>` component with optional `breakpoint` input property for responsive collapsing and color scheme classes.
* Navbars and their contents are fluid by default. Change the container to limit their horizontal width in different ways.
* Use **Bootstrap**'s spacing and flex utility classes for controlling spacing and alignment within navbars.
* Navbars are responsive by default, but you can easily modify them to change that.

## Placement
All navbars in **CuteWidgets** have the `position` input property that determines the placement of the navbar in non-static 
position: `fixed-top`,`fixed-bottom`,`sticky-top`,`sticky-bottom`. Use `sticky-top` when navbar needs to scroll with 
the page until it reaches the top, then stays there. `sticky-bottom` is applied when navbar should scroll with the 
page until it reaches the bottom, then stays there.

Fixed navbars use `position: fixed`, meaning they’re pulled from the normal flow of the DOM and may require custom CSS 
(e.g., `padding-top` on the `<body>`) to prevent overlap with other elements.

## Supported content
Navbars come with built-in support for a handful of subcomponents. Choose from the following directives as needed:

* `[cuteNavbarBrand]` for your company, product, or project name.
* `[cuteNavbarNav]` for a full-height and lightweight navigation (including support for dropdowns).
* `[cuteNavbarToggler]` for collapse/expand our `<cute-navbar-content>` and other navigation toggling behaviors.
* `[cuteNavbarText]` for adding vertically centered strings of text.
* Use **Bootstrap**'s flex and spacing utilities for any form controls and actions.
* Use `<cute-navbar-content>` component for grouping and hiding navbar contents by a parent breakpoint.
* Add an optional .navbar-nav-scroll to set a max-height and scroll expanded navbar content.

## Brand
The `cuteNavbarBrand` directive can be applied to most elements, but an _anchor_ works best, as some elements might require utility classes or custom styles.
Add your text or an `<img>` or both within an element with the `cuteNavbarBrand` directive.

## Navigation
Navbar navigation links build on our `cute-navbar-nav*` directives with their own modifier suffixes and require the use of `cuteNavbarToggler` directive for proper 
responsive styling. Navigation in navbars will also grow to occupy as much horizontal space as possible to keep your navbar contents securely aligned.
The `cute-navbar-nav` directive extends `cute-nav` and is built with flexbox and provide a strong foundation for building all types of navigation components.

## Toggle
The navigation bar togglers which are used as a trigger to change the collapse/expand state of the `cute-navbar-content`, are left-aligned by default, but should they follow a sibling element like a `cute-navbar-brand`, they’ll automatically be aligned to the far right. 
Reversing your markup will reverse the placement of the toggler.

## Example

```html
<cute-navbar breakpoint="lg" class="border-bottom border-body mb-3" color="secondary-emphasis">
  <img src="/assets/cute-widgets.png" style="height: 2.5rem" alt="CuteWidgets Logo"/>
  <a cuteNavbarBrand href="#" class="fw-semibold">CuteWidgets</a>
  <button cuteNavbarToggler [cuteNavbarTogglerFor]="navbarContent" cuteButton="outline-button" aria-label="Toggle navigation">
    <cute-icon>list</cute-icon>
  </button>
  <cute-navbar-content>
    <!-- Navigation's bar -->
    <ul cute-navbar-nav class="me-auto mb-2 mb-lg-0">
      <li cute-nav-item>
        <a cute-nav-link active="true" routerLink="">Home</a>
      </li>
      <li cute-nav-item>
        <a cute-nav-link routerLink="">Link</a>
      </li>
      <li cute-nav-item>
        <a cute-nav-link disabled>Disabled</a>
      </li>
    </ul>
    <form class="d-flex" role="search">
      <input cuteInput class="me-2" type="search" placeholder="Search docs" aria-label="Search">
      <button cuteButton="outline-button" color="success" type="submit">Search</button>
    </form>
  </cute-navbar-content>
</cute-navbar>
```
