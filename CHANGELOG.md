## Changes in version 21.0.4 (2026-08-10)

feat(CuteWidget): adds addEventListener() and removeEventListener() delegation methods that implement `HasEventTargetAddRemove` interface. 

## Changes in version 21.0.3 (2026-07-29)

### Fixes
* Work with dynamic `CuteTab` in `CuteTabGroup` is more stable now.
* Small refactoring internal architecture of `CuteNav` and `CuteNavLink` directives.

### Improvements

* Small not breaking changes in some core directives.
* New `cuteClickInside` core directive has been created.

## Changes in version 21.0.2 (2026-05-07)

### Fixes
* Refactoring of `CuteInput` internal architecture.

### Improvements
* Add `magnitude` input property to `CuteToolbarRow` component.
* `CuteTooltip` now is more compatible with Angular Material component.

## Changes in version 21.0.1 (2026-03-31)

### Fixes
* Background color of the base `CuteButton` has been changed in the _focus_ state.
* `CuteSelect` now correctly displays **placeholder** for the custom triggers.
* Small changes in the `CuteTable` component.

## Changes in version 21.0.0 (2026-02-28)

### Improvements
* Upgraded to **Angular v21**.
* `CuteMenu` now works with native CSS animations.
* Add `position` input property to `CuteBadge` component.

## Changes in version 20.0.5 (2026-02-15)

### Fixes
* Fixed incorrect display of disabled states in the `CuteButtonToggle` and `CuteButtonToggleGroup` components.
* Auto scrolling has been fixed for new dynamic `CuteTab` in the vertical header positions.

### Improvements
* Changing a page number in `CutePaginator` now works more smoothly.
* `CuteDialog` is now more compatible with Angular Material's dialog component.
* `CuteTabs` and `CuteCollapse` now work with native CSS animations.

## Changes in version 20.0.4 (2026-01-30)

### Fixes:
* The internal markup of `CuteCardBody` and `CuteCardSubtitle` has been changed.
* The type of `sort` parameter in `CuteTableDataSource#sortData` has been changed to `Sort` interface.

### Improvements:
* Add `wrapLabel` input property to the `CuteButton` component. With default value of _false_.
* `CuteSort` implements the `Sort` interface now and uses native CSS animation.
* `CuteCardImage` can now be positioned by statically specifying the corresponding attribute: `[cute-card-top-image]`, `[cute-card-bottom-image]`, or `[cute-card-float-image]`.  
* `CutePaginator` and `CuteSelect` are more responsive now.
* `CuteChips` have become more cute.
* The `bsBreakpoints` object has been completely redesigned.

## Changes in version 20.0.3 (2026-01-12)

* Multiple cosmetic changes.

## Changes in version 20.0.2 (2025-12-30)

* `cute-select` now uses native CSS animation.

## Changes in version 20.0.1 (2025-12-26)

* Small changes.

## Version 20.0.0

* Initial version.
