CuteWidgets' `cute-collapse` component is used to show and hide some content on the page. 
As a rule, buttons or anchors are used as triggers for these actions and are mapped to specific elements you toggle. 
Vertical collapsing an element will animate the `height` from its current value to `0`.
Given how CSS handles animations, you shouldn't use `padding` on a `collapse` component. 

### Placement
The `cute-collapse` component supports horizontal collapsing/expanding. Set the `horizontal` input
property to _true_ to transition the `width` instead of `height` and set a `width` on 
the immediate child element.

### Trigger
To allow the user to collapse/expand any content block on the page, you can use any HTML element as a trigger. 
Simply apply the `cuteCollapseTriggerFor` directive to it, referencing the `CuteCollapse`
component through a template or component variable. 

### Interaction
To collapse/expand some content programmatically the `CuteCollapse` has the according 
methods. You may call `open()` to expand content, `close()` to collapse it, or `toggle()` to change
the mode to the opposite. The component's current state can be received via its `collapsed` property.

### Outputs
The following events of the `CuteCollapse` can be used to fine-tune the user interface based on the
component's state:

| Event            | Description                              |
|------------------|------------------------------------------|
| _beforeExpand_   | Event emitting before expand element     |
| _beforeCollapse_ | Event emitting before collapse element   |
| _afterExpand_    | Event emitting after expand element      |
| _afterCollapse_  | Event emitting after collapse element    |
  

### Accessibility

The `CuteCollapseTriggerFor` directive  will automatically toggle `aria-expanded` attribute on the `CuteCollapse` based on whether 
the collapsible element has been opened or closed. This directive also assigns the `CuteCollapse`'s identifier value to its `aria-controls` property.
   
### Example:

```html
<p>
  <button cute-button [cuteCollapseTriggerFor]="collapseCard" color="info">Show collapsed</button>
</p>
<div style="min-height: 50px">
  <cute-collapse #collapseCard horizontal="false">
    <cute-card style="width: 300px;">
      <cute-card-header>
        Card Header
      </cute-card-header>
      <cute-card-body>
        <h5 cuteCardTitle>Card Title</h5>
        Some placeholder content for the collapse component. This panel is hidden by default but revealed when the user activates the relevant trigger.
      </cute-card-body>
    </cute-card>
  </cute-collapse>
</div>

```
