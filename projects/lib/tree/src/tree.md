The `cute-tree` provides a **CuteWidgets** styled tree that can be used to display hierarchy
data.

This tree builds on the foundation of the CDK tree and uses a similar interface for its
data source input and template, except that its element and attribute selectors will be prefixed
with `cute-` instead of `cdk-`.

There are two types of trees: Flat tree and nested tree. The DOM structures are different for these
two types of trees. Flat trees generally offer better performance, while nested trees provide
flexibility.

#### Flat tree
In a flat tree, the hierarchy is flattened; nodes are not rendered inside of each other,
but instead are rendered as siblings in sequence. An instance of `TreeFlattener` is
used to generate the flat list of items from hierarchical data. The "level" of each tree
node is read through the `getLevel` method of the `TreeControl`; this level can be
used to style the node such that it is indented to the appropriate level.

```html
<cute-tree>
  <cute-tree-node> parent node </cute-tree-node>
  <cute-tree-node> -- child node1 </cute-tree-node>
  <cute-tree-node> -- child node2 </cute-tree-node>
</cute-tree>
```

Flat trees are generally easier to style and inspect. They are also more friendly to scrolling
variations, such as infinite or virtual scrolling. Flat trees generally offer better performance.


#### Nested tree
In Nested tree, children nodes are placed inside their parent node in DOM. The parent node has an
outlet to keep all the children nodes.

```html
<cute-tree>
   <cute-nested-tree-node>
     parent node
     <cute-nested-tree-node> -- child node1 </cute-nested-tree-node>
     <cute-nested-tree-node> -- child node2 </cute-nested-tree-node>
   </cute-nested-tree-node>
</cute-tree>
```

Nested trees are easier to work with when hierarchical relationships are visually
represented in ways that would be difficult to accomplish with flat nodes.


### Usage

#### Writing your tree template

In order to use the tree, you must define a tree node template. There are two types of tree nodes,
`<cute-tree-node>` for flat tree and `<cute-nested-tree-node>` for nested tree. The tree node
template defines the look of the tree node, expansion/collapsing control and the structure for
nested children nodes.

A node definition is specified via any element with `cuteTreeNodeDef`. This directive exports the node
data to be used in any bindings in the node template.

```html
<cute-tree-node *cuteTreeNodeDef="let node">
  {{node.key}}: {{node.value}}
</cute-tree-node>
```

##### Flat tree node template

Flat trees use the `level` of a node to both render and determine hierarchy of the nodes for screen
readers. This may be provided either via `levelAccessor`, or will be calculated by `CuteTree` if
`childrenAccessor` is provided.

Spacing can be added either by applying the `cuteTreeNodePadding` directive or by applying custom styles
based on the `aria-level` attribute.


##### Nested tree node template

When using nested tree nodes, the node template must contain a `cuteTreeNodeOutlet`, which marks
where the children of the node will be rendered.

```html
<cute-nested-tree-node *cuteTreeNodeDef="let node">
  {{node.value}}
  <ng-container cuteTreeNodeOutlet></ng-container>
</-nested-tree-node>
```

#### Adding expand/collapse

The `cuteTreeNodeToggle` directive can be used to add expand/collapse functionality for tree nodes.
The toggle calls the expand/collapse functions in the `cuteTree` and is able to expand/collapse
a tree node recursively by setting `[cuteTreeNodeToggleRecursive]` to _true_.

`cuteTreeNodeToggle` should be attached to button elements, and will trigger upon click or keyboard
activation. For icon buttons, ensure that `aria-label` is provided.

```html
<cute-tree-node *cuteTreeNodeDef="let node">
  <button cuteTreeNodeToggle aria-label="toggle tree node" [cuteTreeNodeToggleRecursive]="true">
    <cute-icon>expand</cute-icon>
  </button>
  {{node.value}}
</cute-tree-node>
```

### Toggle

A `cuteTreeNodeToggle` can be added in the tree node template to expand/collapse the tree node. The
toggle toggles the expand/collapse functions in `TreeControl` and is able to expand/collapse a
tree node recursively by setting `[cuteTreeNodeToggleRecursive]` to `true`.

The toggle can be placed anywhere in the tree node, and is only toggled by `click` action.


### Padding (Flat tree only)

The `cuteTreeNodePadding` can be placed in a flat tree's node template to display the `level`
information of a flat tree node.

```html
<cute-tree-node *cuteTreeNodeDef="let node" cuteTreeNodePadding>
  {{node.value}}
</cute-tree-node>
```

This is unnecessary for a nested tree, since the hierarchical structure of the DOM allows for 
padding to be added via CSS.

### Conditional template

The tree may include multiple node templates, where a template is chosen
for a particular data node via the `when` predicate of the template.

```html
<cute-tree-node *cuteTreeNodeDef="let node" cuteTreeNodePadding>
  {{node.value}}
</cute-tree-node>
<cute-tree-node *cuteTreeNodeDef="let node; when: isSpecial" cuteTreeNodePadding>
  [ A special node {{node.value}} ]
</cute-tree-node>
```

### Data Source

#### Connecting the tree to a data source

Similar to `cute-table`, you can provide data to the tree through a `DataSource`. When the tree receives
a `DataSource` it will call its `connect()` method which returns an observable that emits an array
of data. Whenever the data source emits data to this stream, the tree will render an update.

Because the data source provides this stream, it bears the responsibility of toggling tree
updates. This can be based on anything: tree node expansion change, websocket connections, user
interaction, model updates, time-based intervals, etc.

There are two main methods of providing data to the tree:

* flattened data, combined with `levelAccessor`. This should be used if the data source already
  flattens the nested data structure into a single array.
* only root data, combined with `childrenAccessor`. This should be used if the data source is
  already provided as a nested data structure.

#### `levelAccessor`

`levelAccessor` is a function that when provided a datum, returns the level the data sits at in the
tree structure. If `levelAccessor` is provided, the data provided by `dataSource` should contain all
renderable nodes in a single array.

The data source is responsible for handling node expand/collapse events and providing an updated
array of renderable nodes, if applicable. This can be listened to via the `(expansionChange)` event
on `cute-tree-node` and `cute-nested-tree-node`.

#### `childrenAccessor`

`childrenAccessor` is a function that when provided a datum, returns the children of that particular
datum. If `childrenAccessor` is provided, the data provided by `dataSource` should _only_ contain
the root nodes of the tree.

#### `trackBy`

To improve performance, a `trackBy` function can be provided to the tree similar to Angular’s
[`ngFor` `trackBy`](https://angular.dev/api/common/NgForOf?tab=usage-notes). This informs the
tree how to uniquely identify nodes to track how the data changes with each update.

```html
<cute-tree [dataSource]="dataSource" [childrenAccessor]="childrenAccessor" [trackBy]="trackByFn">
```

### Accessibility

The `<cute-tree>` implements the [`tree` widget](https://www.w3.org/WAI/ARIA/apg/patterns/treeview/),
including keyboard navigation and appropriate roles and ARIA attributes.

In order to use the new accessibility features, migrating to `levelAccessor` and `childrenAccessor`
is required. Trees using `treeControl` do not implement the correct accessibility features for
backwards compatibility.

#### isExpandable

In order for the tree to correctly determine whether a node is expandable, the `isExpandable`
property must be set on all `cute-tree-node` or `cute-tree-nested-node` that are expandable.

#### Activation actions

For trees with nodes that have actions upon activation or click, `<cute-tree-node>` will emit
`(activation)` events that can be listened to when the user activates a node via keyboard
interaction.

```html
<cute-tree-node
    *cuteTreeNodeDef="let node"
    (click)="performAction(node)"
    (activation)="performAction($event)">
</cute-tree-node>
```

In this example, `$event` contains the node's data and is equivalent to the implicit data passed in
the `cuteTreeNodeDef` context.
