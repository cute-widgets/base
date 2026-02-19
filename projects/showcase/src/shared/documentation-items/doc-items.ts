/**
 * @license Apache-2.0
 *
 * Copyright (c) 2025 CuteWidgets Team. All Rights Reserved.
 *
 * You may not use this file except in compliance with the License
 * that can be found at http://www.apache.org/licenses/LICENSE-2.0
 *
 * This code is a modification of the `@angular/material` original
 * code licensed under MIT-style License (https://angular.dev/license).
 */

import {Injectable} from '@angular/core';

export interface AdditionalApiDoc {
  name: string;
  path: string;
}

export interface ExampleSpecs {
  prefix: string;
  exclude?: string[];
}

export interface DocItem {
  /** Id of the doc item. Used in the URL for linking to the doc. */
  id: string;
  /** Display name of the doc item. */
  name: string;
  /** Short summary of the doc item. */
  summary?: string;
  /** Package which contains the doc item. */
  packageName?: string;
  /** Project's folder. */
  projectName?: string;
  /** Specifications for which examples to be load. */
  exampleSpecs: ExampleSpecs;
  /** List of examples. */
  examples?: string[];
  /** Optional id of the API document file. */
  apiDocId?: string;
  /** Optional path to the overview file of this doc item. */
  overviewPath?: string;
  /** List of additional API docs. */
  additionalApiDocs?: AdditionalApiDoc[];
  /** Whether the doc item can display styling information. */
  hasStyling?: boolean;
  /** Optional icon of the API document file. */
  icon?: string
}

export interface DocSection {
  name: string;
  summary: string;
}

export const PRO_WIDGETS = 'pro';
export const BASE_WIDGETS = 'components';
export const SECTIONS: {[key: string]: DocSection} = {
  [BASE_WIDGETS]: {
    name: 'Components',
    summary:
      '<b>CuteWidgets</b> offers a wide variety of UI components based on the <a' +
      ' href="https://getbootstrap.com/">Bootstrap frontend toolkit</a>',
  },
  [PRO_WIDGETS]: {
    name: 'PRO components',
    summary:
      'The <b>PRO Components</b> is a set of advanced UI components for building powerful, extensible and featured frontend interface',
  },
};

const rawPath = "https://raw.githubusercontent.com/cute-widgets/base/refs/heads/main/projects/lib";

const DOCS: {[key: string]: DocItem[]} = {
  [BASE_WIDGETS]: [
    {
      id: 'alert',
      name: 'Alert',
      summary: 'Contextual feedback message for typical user actions.',
      exampleSpecs: {
        prefix: 'alert-',
      },
      additionalApiDocs: [{name: 'Testing', path: 'cute-alert-testing.html'}],
    },
    {
      id: 'autocomplete',
      name: 'Autocomplete',
      summary: 'Suggests relevant options as the user types.',
      exampleSpecs: {
        prefix: 'autocomplete-',
      },
      additionalApiDocs: [{name: 'Testing', path: 'cute-autocomplete-testing.html'}],
    },
    {
      id: 'badge',
      name: 'Badge',
      summary: 'A small value indicator that can be overlaid on another object.',
      exampleSpecs: {
        prefix: 'badge-',
      },
      additionalApiDocs: [{name: 'Testing', path: 'cute-badge-testing.html'}],
    },
    {
      id: 'bottom-sheet',
      name: 'Bottom Sheet',
      summary: 'A large interactive panel primarily for mobile devices.',
      exampleSpecs: {
        prefix: 'bottom-sheet-',
      },
      additionalApiDocs: [{name: 'Testing', path: 'cute-bottom-sheet-testing.html'}],
    },
    {
      id: 'button',
      name: 'Button',
      summary: 'An interactive button with a range of presentation options.',
      exampleSpecs: {
        prefix: 'button-',
        exclude: ['button-toggle-'],
      },
      additionalApiDocs: [{name: 'Testing', path: 'cute-button-testing.html'}],
    },
    {
      id: 'button-toggle',
      name: 'Button Toggle',
      summary: 'A groupable on/off toggle for enabling and disabling options.',
      exampleSpecs: {
        prefix: 'button-toggle-',
      },
      additionalApiDocs: [{name: 'Testing', path: 'cute-button-toggle-testing.html'}],
    },
    {
      id: 'card',
      name: 'Card',
      summary: 'A styled container for pieces of itemized content.',
      exampleSpecs: {
        prefix: 'card-',
      },
      additionalApiDocs: [{name: 'Testing', path: 'cute-card-testing.html'}],
    },
    {
      id: 'checkbox',
      name: 'Checkbox',
      summary: 'Captures boolean input with an optional indeterminate mode.',
      exampleSpecs: {
        prefix: 'checkbox-',
      },
      additionalApiDocs: [{name: 'Testing', path: 'cute-checkbox-testing.html'}],
    },
    {
      id: 'chips',
      name: 'Chips',
      summary: 'Presents a list of items as a set of small, tactile entities.',
      exampleSpecs: {
        prefix: 'chips-',
      },
      additionalApiDocs: [{name: 'Testing', path: 'cute-chips-testing.html'}],
    },
    // {
    //   id: 'core',
    //   name: 'Core',
    //   summary: 'Reusable parts used by other components in the library.',
    //   exampleSpecs: {
    //     prefix: 'core-',
    //   },
    //   additionalApiDocs: [{name: 'Testing', path: 'cute-core-testing.html'}],
    // },
    {
      id: 'collapse',
      name: 'Collapse',
      summary: 'Toggles the visibility of content.',
      exampleSpecs: {
        prefix: 'collapse-',
      },
      additionalApiDocs: [{name: 'Testing', path: 'cute-collapse-testing.html'}],
    },
    {
      id: 'datepicker',
      name: 'Datepicker',
      summary: 'Captures dates, agnostic about their internal representation.',
      exampleSpecs: {
        prefix: 'date',
      },
      additionalApiDocs: [{name: 'Testing', path: 'cute-datepicker-testing.html'}],
    },
    {
      id: 'dialog',
      name: 'Dialog',
      summary: 'A configurable modal that displays dynamic content.',
      exampleSpecs: {
        prefix: 'dialog-',
      },
      additionalApiDocs: [{name: 'Testing', path: 'cute-dialog-testing.html'}],
    },
    {
      id: 'divider',
      name: 'Divider',
      summary: 'A vertical or horizontal visual divider.',
      exampleSpecs: {
        prefix: 'divider-',
      },
      additionalApiDocs: [{name: 'Testing', path: 'cute-divider-testing.html'}],
    },
    {
      id: 'expansion',
      name: 'Expansion Panel',
      summary: 'A container which can be expanded to reveal more content.',
      exampleSpecs: {
        prefix: 'expansion-',
      },
      additionalApiDocs: [{name: 'Testing', path: 'cute-expansion-testing.html'}],
    },
    {
      id: 'form-field',
      name: 'Form Field',
      summary: 'Wraps input fields so they are displayed consistently.',
      exampleSpecs: {
        prefix: 'form-field-',
      },
      additionalApiDocs: [{name: 'Testing', path: 'cute-form-field-testing.html'}],
    },
    {
      id: 'grid-list',
      name: 'Grid List',
      summary: 'A flexible structure for presenting content items in a grid.',
      exampleSpecs: {
        prefix: 'grid-list-',
      },
      additionalApiDocs: [{name: 'Testing', path: 'cute-grid-list-testing.html'}],
    },
    {
      id: 'icon',
      name: 'Icon',
      summary: 'Renders a specified icon.',
      exampleSpecs: {
        prefix: 'icon-',
      },
      additionalApiDocs: [{name: 'Testing', path: 'cute-icon-testing.html'}],
    },
    {
      id: 'input',
      name: 'Input',
      summary: 'Enables native inputs to be used within a Form field.',
      exampleSpecs: {
        prefix: 'input-',
      },
      additionalApiDocs: [{name: 'Testing', path: 'cute-input-testing.html'}],
    },
    {
      id: 'list',
      name: 'List',
      summary: 'Presents conventional lists of items.',
      exampleSpecs: {
        prefix: 'list-',
      },
      additionalApiDocs: [{name: 'Testing', path: 'cute-list-testing.html'}],
    },
    {
      id: 'menu',
      name: 'Menu',
      summary: 'A floating panel of nestable options.',
      exampleSpecs: {
        prefix: 'menu-',
      },
      additionalApiDocs: [{name: 'Testing', path: 'cute-menu-testing.html'}],
    },
    {
      id: 'navbar',
      name: 'Navbar',
      summary: 'A powerful, responsive navigation header.',
      exampleSpecs: {
        prefix: 'menu-',
      },
      additionalApiDocs: [{name: 'Testing', path: 'cute-navbar-testing.html'}],
    },
    {
      id: 'paginator',
      name: 'Paginator',
      summary: 'Controls for displaying paged data.',
      exampleSpecs: {
        prefix: 'paginator-',
      },
      additionalApiDocs: [{name: 'Testing', path: 'cute-paginator-testing.html'}],
    },
    {
      id: 'progress-bar',
      name: 'Progress Bar',
      projectName: 'progress',
      summary: 'A linear progress indicator.',
      exampleSpecs: {
        prefix: 'progress-bar-',
      },
      additionalApiDocs: [{name: 'Testing', path: 'cute-progress-bar-testing.html'}],
    },
    {
      id: 'progress-spinner',
      name: 'Progress Spinner',
      projectName: 'spinner',
      summary: 'A circular progress indicator.',
      exampleSpecs: {
        prefix: 'progress-spinner-',
      },
      additionalApiDocs: [{name: 'Testing', path: 'cute-progress-spinner-testing.html'}],
    },
    {
      id: 'radio',
      name: 'Radio Button',
      summary: 'Allows the user to select one option from a group.',
      exampleSpecs: {
        prefix: 'radio-',
      },
      additionalApiDocs: [{name: 'Testing', path: 'cute-radio-testing.html'}],
    },
    /*
    {
      id: 'ripple',
      name: 'Ripples',
      overviewPath: 'material/core/ripple/ripple.md.html',
      summary: 'Directive for adding Material Design ripple effects',
      hasStyling: false, // Ripple styling is documented through `core`.
      exampleSpecs: {
        prefix: 'ripple-',
      },
    },
    */
    {
      id: 'select',
      name: 'Select',
      summary: 'Allows the user to select one or more options using a dropdown.',
      exampleSpecs: {
        prefix: 'select-',
      },
      additionalApiDocs: [{name: 'Testing', path: 'cute-select-testing.html'}],
    },
    {
      id: 'sidenav',
      name: 'Sidenav',
      summary: 'A container for content that is fixed to one side of the screen.',
      exampleSpecs: {
        prefix: 'sidenav-',
      },
      additionalApiDocs: [{name: 'Testing', path: 'cute-sidenav-testing.html'}],
    },
    {
      id: 'slide-toggle',
      name: 'Slide Toggle',
      projectName: 'checkbox',
      summary: 'Captures boolean values as a clickable and draggable switch.',
      exampleSpecs: {
        prefix: 'slide-toggle-',
      },
      additionalApiDocs: [{name: 'Testing', path: 'cute-slide-toggle-testing.html'}],
    },
    {
      id: 'slider',
      name: 'Slider',
      summary: 'Allows the user to input a value by dragging along a slider.',
      exampleSpecs: {
        prefix: 'slider-',
      },
      additionalApiDocs: [{name: 'Testing', path: 'cute-slider-testing.html'}],
    },
    {
      id: 'snack-bar',
      name: 'Snackbar',
      summary: 'Displays short actionable messages as an uninvasive alert.',
      exampleSpecs: {
        prefix: 'snack-bar-',
      },
      additionalApiDocs: [{name: 'Testing', path: 'cute-snack-bar-testing.html'}],
    },
    {
      id: 'sort',
      name: 'Sort Header',
      summary: 'Allows the user to configure how tabular data is sorted.',
      exampleSpecs: {
        prefix: 'sort-',
      },
      additionalApiDocs: [{name: 'Testing', path: 'cute-sort-testing.html'}],
    },
    {
      id: 'stepper',
      name: 'Stepper',
      summary: 'Presents content as steps through which to progress.',
      exampleSpecs: {
        prefix: 'stepper-',
      },
      additionalApiDocs: [{name: 'Testing', path: 'cute-stepper-testing.html'}],
    },
    {
      id: 'table',
      name: 'Table',
      summary: 'A configurable component for displaying tabular data.',
      exampleSpecs: {
        prefix: 'table-',
      },
      additionalApiDocs: [{name: 'Testing', path: 'cute-table-testing.html'}],
    },
    {
      id: 'tabs',
      name: 'Tabs',
      summary: 'Only presents one view at a time from a provided set of views.',
      exampleSpecs: {
        prefix: 'tab-',
      },
      additionalApiDocs: [{name: 'Testing', path: 'cute-tabs-testing.html'}],
    },
    {
      id: 'timepicker',
      name: 'Timepicker',
      summary: 'Allows the user to select a time of the day.',
      exampleSpecs: {
        prefix: 'time',
      },
      additionalApiDocs: [{name: 'Testing', path: 'cute-timepicker-testing.html'}],
    },
    {
      id: 'toolbar',
      name: 'Toolbar',
      summary: 'A container for top-level titles and controls.',
      exampleSpecs: {
        prefix: 'toolbar-',
      },
      additionalApiDocs: [{name: 'Testing', path: 'cute-toolbar-testing.html'}],
    },
    {
      id: 'tooltip',
      name: 'Tooltip',
      summary: 'Displays floating content when an object is hovered.',
      exampleSpecs: {
        prefix: 'tooltip-',
      },
      additionalApiDocs: [{name: 'Testing', path: 'cute-tooltip-testing.html'}],
    },
    {
      id: 'tree',
      name: 'Tree',
      summary: 'Presents hierarchical content as an expandable tree.',
      exampleSpecs: {
        prefix: 'tree-',
      },
    },
  ],
  [PRO_WIDGETS]: [
    {
      id: 'avatar',
      name: 'Avatar',
      summary: 'A visual representation of an entity, such as a user or an organization.',
      icon: 'person-circle',
      exampleSpecs: {
        prefix: 'cute-avatar-',
      },
    },
    {
      id: 'breadcrumb',
      name: 'Breadcrumb',
      summary: 'Indicates the current page’s location within a navigational hierarchy with automatically added separators.',
      icon: 'houses',
      exampleSpecs: {
        prefix: 'cute-breadcrumb-',
      },
    },
    {
      id: 'carousel',
      name: 'Carousel',
      summary: 'A slideshow component for cycling through elements—images or slides of text—like a carousel.',
      icon: 'collection-play',
      exampleSpecs: {
        prefix: 'cute-carousel-',
      },
    },
    {
      id: 'chart-js',
      name: 'Chart Js',
      summary: 'Chart component that is based on <a href="https://www.chartjs.org/">Charts.js 4.0+</a>, an open source HTML5 based charting library.',
      icon: 'bar-chart-fill',
      exampleSpecs: {
        prefix: 'cute-chart-js-',
      },
    },
    {
      id: 'inputbox',
      name: 'InputBox',
      summary: 'A dialog component for collecting and returning a user-entered value.',
      icon: 'input-cursor-text',
      exampleSpecs: {
        prefix: 'cute-inputbox-',
      },
    },
    {
      id: 'messagebox',
      name: 'MessageBox',
      summary: 'A dialog component with the title, text, icon, and buttons specified.',
      icon: 'info-circle',
      exampleSpecs: {
        prefix: 'cute-messagebox-',
      },
    },
    {
      id: 'dropdown',
      name: 'Dropdown',
      summary: 'Toggleable, contextual overlay for displaying lists of links and more.',
      icon: 'menu-button',
      exampleSpecs: {
        prefix: 'cute-dropdown-',
      },
    },
    {
      id: 'quill-editor',
      name: 'Quill editor',
      summary: 'Rich text editor component based on <a href="https://quilljs.com/">Quill</a> open source HTML5 editor.',
      icon: 'pencil-square',
      exampleSpecs: {
        prefix: 'cute-quill-editor-',
      },
    },
    {
      id: 'responsive-grid',
      name: 'Responsive grid',
      summary: 'Flexible component to responsive display its projected content in the grid layout.',
      icon: 'grid-3x3-gap-fill',
      exampleSpecs: {
        prefix: 'cute-responsive-grid-',
      },
    },
    {
      id: 'display-format',
      name: 'DisplayFormat',
      summary: 'A directive that transforms the input value to text based on the specified display mask after the input lost focus.',
      icon: 'badge-ad',
      exampleSpecs: {
        prefix: 'cute-display-format-',
      },
    },
    {
      id: 'edit-mask',
      name: 'EditMask',
      summary: 'A directive that restricts the input value to characters based on the specified editing mask.',
      icon: 'regex',
      exampleSpecs: {
        prefix: 'cute-edit-mask-',
      },
    },
    {
      id: 'frame-menu',
      name: 'FrameMenu',
      summary: 'Application level menu component.',
      icon: 'menu-button-fill',
      exampleSpecs: {
        prefix: 'cute-frame-menu-',
      },
    },
    {
      id: 'panel-menu',
      name: 'PanelMenu',
      summary: 'Expandable/collapsable page inline menu component.',
      icon: 'menu-button-wide-fill',
      exampleSpecs: {
        prefix: 'cute-panel-menu-',
      },
    },
    {
      id: 'popup-menu',
      name: 'PopupMenu',
      summary: "Popup menu component.",
      icon: 'menu-up',
      exampleSpecs: {
        prefix: 'cute-popup-menu-',
      },
    },
    {
      id: 'offcanvas',
      name: 'Offcanvas',
      summary: 'A hidden sidebar component for navigation, shopping carts, and more.',
      icon: 'layout-sidebar-inset-reverse',
      exampleSpecs: {
        prefix: 'cute-offcanvas-',
      },
    },
    {
      id: 'placeholder',
      name: 'PlaceHolder',
      summary: 'A loading placeholder (skeleton loader) component to indicate something may still be loading.',
      icon: 'grid-1x2-fill',
      exampleSpecs: {
        prefix: 'cute-placeholder-',
      },
    },
    {
      id: 'rating',
      name: 'Rating',
      summary: 'A star based selection input component.',
      icon: 'star-half',
      exampleSpecs: {
        prefix: 'cute-rating-',
      },
    },
    {
      id: 'scroll-bar',
      name: 'ScrollBar',
      summary: 'Vertical and horizontal bar with arrows at either end and a scroll box that can be used as a slider control.',
      icon: 'arrows-vertical',
      exampleSpecs: {
        prefix: 'cute-scroll-bar-',
      },
    },
    {
      id: 'virtual-scroller',
      name: 'Virtual scroller',
      summary: 'An advanced virtual scrolling component to scroll any projected content.',
      icon: 'distribute-vertical',
      exampleSpecs: {
        prefix: 'cute-virtual-scroller-',
      },
    },
    {
      id: 'scroll-spy',
      name: 'ScrollSpy',
      summary: 'Automatically updates navigation or list group components based on scroll position to indicate which link is currently active in the viewport.',
      icon: 'box-arrow-in-down',
      exampleSpecs: {
        prefix: 'cute-scroll-spy-',
      },
    },
    {
      id: 'splitter',
      name: 'Splitter',
      summary: 'Component that allows to segment the application screen into adjustable, standalone sections, either horizontally or vertically.',
      icon: 'columns',
      exampleSpecs: {
        prefix: 'cute-splitter-',
      },
    },
    {
      id: 'tree-table',
      name: 'TreeTable',
      summary: 'TreeTable is used to display hierarchical data in tabular format.',
      icon: 'list-nested',
      exampleSpecs: {
        prefix: 'cute-tree-table-',
      },
    },
    {
      id: 'tree-view',
      name: 'TreeView',
      summary: 'An advanced tree-view component that presents hierarchical content as an expandable tree.',
      icon: 'diagram-2-fill',
      exampleSpecs: {
        prefix: 'cute-treeview-',
      },
    },
    {
      id: 'content-viewer',
      name: 'Content viewer',
      summary: 'Powerful component that combines content viewers in various formats (html, xml, office, pdf, etc.). Markdown viewer is based on <a href="https://marked.js.org/">marked.js</a> open source library.',
      icon: 'exclude',
      exampleSpecs: {
        prefix: 'cute-content-viewer-',
      },
    },
    {
      id: 'watermark',
      name: 'Watermark',
      summary: 'A component that can generate a water mark background image.',
      icon: 'water',
      exampleSpecs: {
        prefix: 'cute-watermark-',
      },
    },
  ],
};

interface DocsData {
  pro: DocItem[];
  components: DocItem[];
  all: DocItem[];
  //examples: Record<string, LiveExample>;
}

@Injectable({providedIn: 'root'})
export class DocItems {
  private _cachedData: DocsData | null = null;

  async getItems(section: typeof PRO_WIDGETS|typeof BASE_WIDGETS): Promise<DocItem[]> {
    const data = await this.getData();
    if (section === BASE_WIDGETS) {
      return data.components;
    } else if (section === PRO_WIDGETS) {
      return data.pro;
    }
    return [];
  }

  async getItemById(id: string, section: typeof PRO_WIDGETS|typeof BASE_WIDGETS): Promise<DocItem | undefined> {
    const docs = (await this.getData()).all;
    const sectionLookup = section === PRO_WIDGETS ? PRO_WIDGETS : BASE_WIDGETS;
    return docs.find(doc => doc.id === id && doc.packageName === sectionLookup);
  }

  async getData(): Promise<DocsData> {
    if (!this._cachedData) {
      //const examples = (await import('@angular/components-examples')).EXAMPLE_COMPONENTS;
      //const exampleNames = Object.keys(examples);
      const baseItems = this._processDocs(BASE_WIDGETS, /*exampleNames*/ [], DOCS[BASE_WIDGETS]);
      const proItems = this._processDocs(PRO_WIDGETS, /*exampleNames*/ [], DOCS[PRO_WIDGETS]);

      this._cachedData = {components: baseItems, pro: proItems, all: [...baseItems, ...proItems]}; //, examples};
    }

    return this._cachedData;
  }

  getOverviewPath(doc: DocItem): string | undefined {
    if (doc.overviewPath) {
      return doc.overviewPath;
    }
    return `${rawPath}/${doc.projectName ?? doc.id}/src/${doc.id}.md`;
  }

  private _processDocs(packageName: string, exampleNames: string[], docs: DocItem[]): DocItem[] {
    for (const doc of docs) {
      doc.packageName = packageName;
      doc.hasStyling ??= packageName === BASE_WIDGETS;
      doc.examples = exampleNames.filter(
        key =>
          key.match(RegExp(`^${doc.exampleSpecs.prefix}`)) &&
          !doc.exampleSpecs.exclude?.some(excludeName => key.indexOf(excludeName) === 0),
      );
    }

    return docs.sort((a, b) => a.name.localeCompare(b.name, 'en'));
  }
}
