# CuteWidgets

**[@cute-widgets/base](https://github.com/cute-widgets/base)** is an open-source UI component library for Angular applications.
All components are implemented as native directives and styled using the design and utility
classes of the [Bootstrap 5+](https://getbootstrap.com/) framework. At the same time, the internal implementation and external API of 
core **Cute Widgets** are based on the source code of the popular MIT-licensed [Angular Material](https://material.angular.dev/) 
library. In a sense, **[@cute-widgets/base](https://github.com/cute-widgets/base)** is a complete reincarnation of the latter.

### Architecture and Design Principles

Components adopt structural and behavioral patterns from **Angular Material**, including:

- Consistent input/output naming (`[disabled]`, `(change)`)
- Form control integration via `ControlValueAccessor`
- Content projection using well-defined slots
- Focus management and keyboard navigation
- Accessibility attributes (ARIA roles, labels, states)
- Responsive behavior out of the box
- Seamless integration with **Bootstrap** classes and layout


### Highlights

- **35+ free components**

The full set of [Angular Material](https://material.angular.dev/) 20+ components is 
available in the open-source `@cute-widgets/base` package.

- **Looks like Bootstrap** 

Visual styling adheres to [Bootstrap 5+](https://getbootstrap.com/) CSS classes.
Components apply standard class names such as `.btn`, `.form-control`, `.table`, and `.card`,
ensuring compatibility with existing Bootstrap projects.

- **Themes out of the box**

Supports Bootstrap CSS variables, dark mode, embedded and custom color themes. The Bootstrap icon font is set by default.

- **Powered by Angular Material**

Fully redesigned code of the popular library with almost full 
program interface compatibility, full `a11y`, keyboard navigation, internationalization, and enterprise-grade 
stability.

- **Ready for teams**

Standalone components, signals, SSR, and lazy loading — all Angular’s latest features.
No more custom CSS hacks and design compromises. Just a seamless, production-ready UI library for Angular 20+ applications.

- **PRO components**

Advanced featured components (Carousel, ChartJs, EditMask, Dropdown, etc.) 
are available in `@cute-widgets/pro` library and need the Commercial license.
 
### Get Started

1. Install the open-source library
```bash
npm install @cute-widgets/base
```
or with yarn
```bash
yarn add @cute-widgets/base
```

2. Copy and paste the following excerpt in your _src/styles.scss_ file to include the minimum required compiled and minified CSS bundles:

```scss
@use "bootstrap/dist/css/bootstrap.min.css";
//@use "bootstrap/dist/css/bootstrap.rtl.min.css";
@use "bootstrap-icons/font/bootstrap-icons";
@use '@angular/cdk/overlay-prebuilt.css';
```

> **Note**   
You don't need to include **Bootstrap**'s compiled and minified JavaScript plugins and use `data-bs-*` attributes in your components. All the necessary behavior is implemented within the Cute Widgets themselves.

3. Import components

Just import the desired component module and start using it.

```typescript
// app.component.ts
import {CuteButtonModule} from '@cute-widgets/base/button';
import {CuteCardModule} from '@cute-widgets/base/card';

@Component({
    selector: 'app-root',
    template: `
        <cute-card>
            <cute-card-header> My header </cite-card-header>
            <cute-card-body> My body </cute-card-body>
            <cute-card-footer>    
                <button cute-button color="primary">Click me</button>
            </cute-card-footer>    
        </cute-card>
    `,
    imports: [CuteButtonModule, CuteCardModule],
})
export class AppComponent {}
```


### Why @cute-widgets/base?

###### ✅ Simpler than Angular Material

Angular Material is powerful but often too heavy for simple projects.
`@cute-widgets/base` offers:

- Smaller bundle size
- Fewer dependencies
- More intuitive APIs
- No mandatory theming engine

###### ✅ Better than raw Bootstrap

Bootstrap is great, but lacks true Angular integration.
Our components:

- Are native Angular directives
- Support reactive forms
- Have proper change detection
- Emit events, not just DOM events

###### ✅ Designed for Real Projects

We focus on what developers actually need:

- Clean, readable code
- Predictable behavior
- Easy customization
- Supporting i18n and RTL
- Great developer experience

###### ✅ All components:

- Use standard Bootstrap classes (e.g., `.btn`, `.form-control`)
- Are fully accessible (ARIA, keyboard support)
- Work with Bootstrap’s grid and utilities
- Support dark mode via Bootstrap’s `.bg-dark`, `.text-white`, etc.

### What's the next

Now you have a full set of open-source components available in the **Angular Material** library since **20.x** version, but with the `cute` prefix and styled with **Bootstrap 5+**. In fact, you have much more.

> **Note**  
> The developers of **CuteWidgets** have tried to ensure maximum compatibility in terms of 
> selector names and input/output program interfaces with the parent library, changing only its 
> visual representation. However, 100% compatibility of the internal API of components and 
> services is not guaranteed and may change in the future.

To simplify the process of getting started with **@cute-widgets/base** components the small `projects/showcase` application was created.
All you need to do is run the `ng serve` command in the terminal window and navigate to http://localhost:4200 in the browser, or press 
`o+Enter` in the development server's console window. For a detailed description of using a specific component, see the according **.md** file in the component's folder.

Here is another example of using base components similar to **Bootstrap**, but with **Angular Material** power. As you can see we just replace the **mat*** prefixes with **cute*** in a component's template:

```html
<!-- @angular/material -->
<button matButton="outlined" color="primary" 
        (click)="onSaveButtonClick()">
    <mat-icon> save </mat-icon>
    Save changes
</button> 
```

```html
<!-- @cute-widgets/base -->
<button cuteButton="outlined" color="primary" 
        (click)="onSaveButtonClick()">
  <cute-icon> bi-floppy </cute-icon>
  Save changes
</button> 
```


### Contributing

For bug reports or feature requests, please use [GitHub Issues](https://github.com/cute-widgets/base/issues).
To contribute to the project, `fork` the **CuteWidgets** project and create a `Pull Request` in a separate branch.

### License
Apache-2.0

---
© 2025 CuteWidgets Team. All rights reserved. 🌐



