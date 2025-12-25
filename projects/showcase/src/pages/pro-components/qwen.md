# @cute-widgets/base: Angular Component Library with Bootstrap Styling and Material-inspired API

`@cute-widgets/base` is an open-source UI component library for Angular applications. Components are implemented as native directives and styled using Bootstrap 5+ design conventions. The API surface follows patterns established by Angular Material, enabling familiar usage semantics while integrating with Bootstrap’s layout and utility system.

The library supports standalone components and NgModule-based architectures. All directives are tree-shakable, accessible, and responsive by default.

## Architecture and Design Principles

Components adopt structural and behavioral patterns from Angular Material, including:
- Consistent input/output naming (`[disabled]`, `(change)`)
- Form control integration via `ControlValueAccessor`
- Content projection using well-defined slots
- Focus management and keyboard navigation
- Accessibility attributes (ARIA roles, labels, states)

Visual styling adheres to Bootstrap 5+ CSS classes. No custom theme engine is included. Components apply standard class names such as `.btn`, `.form-control`, `.table`, and `.card`, ensuring compatibility with existing Bootstrap projects.

Encapsulation is set to `Emulated` by default. Select components use `ShadowDom` where isolation improves style stability.

The build pipeline targets ES2023 and generates FESM2023, ESM2020, and UMD bundles. Tree-shaking is enabled via side-effect-free marking in `package.json`. Public API is exposed through `public-api.ts`.

Internal logic is organized into base classes and feature mixins. For example, form controls inherit from a shared `FormFieldControl` base, ensuring consistent behavior across inputs, checkboxes, and selects.

Component templates are statically analyzed for performance. Dynamic content is projected via `<ng-content>` with explicit select conditions or slot attributes.

No runtime framework-specific checks are performed. Compatibility is ensured at build time.

## Installation

Install the package using npm or yarn:

```bash
npm install @cute-widgets/base
