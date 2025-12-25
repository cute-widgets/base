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
import {
  AfterViewChecked,
  ChangeDetectionStrategy,
  Component,
  ErrorHandler, HostAttributeToken,
  inject,
  InjectionToken,
  Input,
  ViewEncapsulation,
  DOCUMENT, booleanAttribute, numberAttribute,
} from '@angular/core';
import {Subscription} from 'rxjs';
import {take} from 'rxjs/operators';
import {CuteBaseControl} from "@cute-widgets/base/abstract";
import {RelativeSize3, RichThemeColor, toColorCssClass} from "@cute-widgets/base/core";
import {CuteIconRegistry} from './icon-registry';

const BOOTSTRAP_ICONS_CLASS: string = "bi";
const FONTAWESOME_ICONS_CLASS: string = "fa"

/** Default options for `cute-icon`.  */
export interface CuteIconDefaultOptions {
  /** Default color of the icon. */
  color?: RichThemeColor;
  /** Font set that the icon is a part of. */
  fontSet?: string;
}

/** Injection token to be used to override the default options for `cute-icon`. */
export const CUTE_ICON_DEFAULT_OPTIONS = new InjectionToken<CuteIconDefaultOptions>(
  'CUTE_ICON_DEFAULT_OPTIONS',
);

/**
 * Injection token used to provide the current location to `CuteIcon`.
 * Used to handle server-side rendering and to stub out during unit tests.
 */
export const CUTE_ICON_LOCATION = new InjectionToken<CuteIconLocation>('cute-icon-location', {
  providedIn: 'root',
  factory: CUTE_ICON_LOCATION_FACTORY,
});

/**
 * Stubbed out location for `CuteIcon`.
 */
export interface CuteIconLocation {
  getPathname: () => string;
}

/** @docs-private */
export function CUTE_ICON_LOCATION_FACTORY(): CuteIconLocation {
  const _document = inject(DOCUMENT);
  const _location = _document ? _document.location : null;

  return {
    // Note that this needs to be a function, rather than a property, because Angular
    // will only resolve it once, but we want the current path on each call.
    getPathname: () => (_location ? _location.pathname + _location.search : ''),
  };
}

/** SVG attributes that accept a FuncIRI (e.g. `url(<something>)`). */
const funcIriAttributes = [
  'clip-path',
  'color-profile',
  'src',
  'cursor',
  'fill',
  'filter',
  'marker',
  'marker-start',
  'marker-mid',
  'marker-end',
  'mask',
  'stroke',
];

/** Selector that can be used to find all elements that are using a `FuncIRI`. */
const funcIriAttributeSelector = funcIriAttributes.map(attr => `[${attr}]`).join(', ');

/** Regex that can be used to extract the id out of a FuncIRI. */
const funcIriPattern = /^url\(['"]?#(.*?)['"]?\)$/;

/**
 * Component to display an icon. It can be used in the following ways:
 *
 * - Specify the svgIcon input to load an SVG icon from a URL previously registered with the
 *   addSvgIcon, addSvgIconInNamespace, addSvgIconSet, or addSvgIconSetInNamespace methods of
 *   CuteIconRegistry. If the svgIcon value contains a colon, it is assumed to be in the format
 *   "[namespace]:[name]", if not, the value will be the name of an icon in the default namespace.
 *   Examples:
 *     `<cute-icon svgIcon="left-arrow"></cute-icon>
 *     <cute-icon svgIcon="animals:cat"></cute-icon>`
 *
 * - Use a font ligature as an icon by putting the ligature text in the `fontIcon` attribute or the
 *   content of the `<cute-icon>` component. If you register a custom font class, remember to also
 *   include the special class `cute-ligature-font`. It is recommended to use the attribute alternative
 *   to prevent the ligature text from being selectable and to appear in search engine results.
 *   By default, the `bootstrap-icons` font family is used as described at
 *   https://icons.getbootstrap.com#install. You can specify an
 *   alternate font by setting the fontSet input to either the CSS class to apply to use the
 *   desired font, or to an alias previously registered with CuteIconRegistry.registerFontClassAlias.
 *   Examples:
 *     `<cute-icon fontIcon="home"></cute-icon>
 *     <cute-icon>home</cute-icon>
 *     <cute-icon fontSet="myfont" fontIcon="sun"></cute-icon>
 *     <cute-icon fontSet="myfont">sun</cute-icon>`
 *     <cute-icon fontIcon="myFont:sun"></cute-icon>
 *
 * - Specify a font glyph to be included via CSS rules by setting the fontSet input to specify the
 *   font, and the fontIcon input to specify the icon. Typically, the fontIcon will specify a
 *   CSS class which causes the glyph to be displayed via a :before selector, as in
 *   https://fortawesome.github.io/Font-Awesome/examples/
 *   Example:
 *     `<cute-icon fontSet="fa-solid" fontIcon="fa-user"></cute-icon>`
 */
@Component({
  selector: 'cute-icon',
  exportAs: 'cuteIcon',
  template: '<ng-content></ng-content>',
  styleUrls: ['./icon.scss'],
  inputs: ['color'],
  host: {
    'role': 'img',
    'class': 'cute-icon notranslate',
    '[class.cute-icon-inline]': 'inline',
    '[class.feature-icon]': 'featureIcon != null',
    '[class.feature-icon-middle]': 'featureIcon==="middle" || featureIcon===""',
    '[class.feature-icon-sm]': 'featureIcon==="small"',
    '[class.feature-icon-lg]': 'featureIcon==="large"',
    '[class]': 'color ? toColorCssClass(color) : ""',
    '[style.transform]': 'rotation ? "rotate("+rotation+"deg)" : null',
    '[attr.data-cute-icon-type]': '_usingFontIcon() ? "font" : "svg"',
    '[attr.data-cute-icon-name]': '_svgName || _fontIconPrefixed',
    '[attr.data-cute-icon-namespace]': '_svgNamespace || fontSet',
    '[attr.fontIcon]': '_usingFontIcon() ? _fontIconPrefixed : null',
    '[attr.translate]': '"no"',
    //ngSkipHydration: '',
  },
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
})
export class CuteIcon extends CuteBaseControl implements AfterViewChecked {
  private _iconRegistry = inject(CuteIconRegistry);
  private _location = inject<CuteIconLocation>(CUTE_ICON_LOCATION);
  private readonly _errorHandler = inject(ErrorHandler);

  protected _textContentChanged: boolean = false;

  /**
   * Whether the icon should be inlined, automatically sizing the icon to match the font size of
   * the element the icon is contained in.
   */
  @Input({transform: booleanAttribute})
  get inline(): boolean { return this._inline; }
  set inline(inline: boolean) { this._inline = inline; }
  private _inline: boolean = false;

  /** Name of the icon in the SVG icon set. */
  @Input()
  get svgIcon(): string | undefined { return this._svgIcon; }
  set svgIcon(value: string | undefined) {
    if (value !== this._svgIcon) {
      if (value) {
        this._updateSvgIcon(value);
      } else if (this._svgIcon) {
        this._clearSvgElement();
      }
      this._svgIcon = value;
    }
  }
  private _svgIcon: string | undefined;

  /** Font set that the icon is a part of. */
  @Input()
  get fontSet(): string | undefined { return this._fontSet; }
  set fontSet(value: string | undefined) {
    const newValue = this._cleanupFontValue(value);

    if (newValue !== this._fontSet) {
      this._fontSet = newValue;
      this._updateFontIconClasses();
    }
  }
  private _fontSet: string | undefined;

  /** Name of an icon within a font set. */
  @Input()
  get fontIcon(): string | undefined { return this._fontIcon; }
  set fontIcon(value: string | undefined) {
    let newValue = this._cleanupFontValue(value);

    if (newValue !== this._fontIcon) {
      // fontIcon={fontSet}:{iconName} --> fontSet={fontSet} fontIcon={iconName}
      const parts = this._splitIconName(newValue!);
      if (parts[0]) {
        this._fontSet = parts[0];
        newValue = parts[1];
      }

      this._fontIcon = newValue;
      this._updateFontIconClasses();
    }
  }
  private _fontIcon: string | undefined;

  /** Should the font icon name be automatically prefixed if it is not explicitly specified for not `cute-ligature-font` fonts. */
  @Input({transform: booleanAttribute})
  autoPrefix: boolean = true;

  /** Angle of rotation in degrees. */
  @Input({transform: numberAttribute})
  rotation: number = 0;

  //++ CWT
  /** Whether to display an icon as a rounded square feature icon. */
  @Input() featureIcon: RelativeSize3| "" | undefined;

  private _previousFontSetClass: string[] = [];
  private _previousFontIconClass: string | undefined;
  protected _fontIconPrefixed: string | undefined;

  _svgName: string | null = null;
  _svgNamespace: string | null = null;

  /** Keeps track of the current page path. */
  private _previousPath?: string;

  /** Keeps track of the elements and attributes that we've prefixed with the current path. */
  private _elementsWithExternalReferences?: Map<Element, {name: string; value: string}[]>;

  /** Subscription to the current in-progress SVG icon request. */
  private _currentIconFetch = Subscription.EMPTY;

  constructor(...args: unknown[]);
  constructor() {
    super();

    const ariaHidden = inject(new HostAttributeToken('aria-hidden'), {optional: true});
    const defaults = inject<CuteIconDefaultOptions>(CUTE_ICON_DEFAULT_OPTIONS, {optional: true});

    if (defaults) {
      this.color = defaults.color;

      if (defaults.fontSet) {
        this.fontSet = defaults.fontSet;
      }
    }

    // If the user has not explicitly set aria-hidden, mark the icon as hidden, as this is
    // the right thing to do for the majority of icon use-cases.
    if (!ariaHidden) {
      this.setAttribute('aria-hidden', 'true');
    }

  }

  protected generateId(): string {
    return "";
  }

  /**
   * Splits an svgIcon binding value into its icon set and icon name components.
   * Returns a 2-element array of [(icon set), (icon name)].
   * The separator for the two fields is ':'. If there is no separator, an empty
   * string is returned for the icon set and the entire value is returned for
   * the icon name. If the argument is falsy, returns an array of two empty strings.
   * Throws an error if the name contains two or more ':' separators.
   * Examples:
   *   `'social:cake' -> ['social', 'cake']
   *   'penguin' -> ['', 'penguin']
   *   null -> ['', '']
   *   'a:b:c' -> (throws Error)`
   */
  private _splitIconName(iconName: string): [string, string] {
    if (!iconName) {
      return ['', ''];
    }
    const parts = iconName.split(':');
    switch (parts.length) {
      case 1:   return ['', parts[0]]; // Use default namespace.
      case 2:   return <[string, string]>parts;
      default:
        throw Error(`Invalid icon name: "${iconName}"`); // TODO: add an ngDevMode check
    }
  }

  override ngOnInit() {
    super.ngOnInit();

    // Update font classes because ngOnChanges won't be called if none of the inputs are present,
    // e.g. <cute-icon>arrow</cute-icon> In this case, we need to add a CSS class for the default font.
    this._updateFontIconClasses();
  }

  ngAfterViewChecked() {
    const cachedElements = this._elementsWithExternalReferences;

    if (cachedElements && cachedElements.size) {
      const newPath = this._location.getPathname();

      // We need to check whether the URL has changed on each change detection since
      // the browser doesn't have an API that will let us react on link clicks, and
      // we can't depend on the Angular router. The references need to be updated,
      // because while most browsers don't care whether the URL is correct after
      // the first render, Safari will break if the user navigates to a different
      // page and the SVG isn't re-rendered.
      if (newPath !== this._previousPath) {
        this._previousPath = newPath;
        this._prependPathToReferences(newPath);
      }
    }
  }

  override ngOnDestroy() {
    super.ngOnDestroy();

    this._currentIconFetch.unsubscribe();

    if (this._elementsWithExternalReferences) {
      this._elementsWithExternalReferences.clear();
    }
  }

  protected _usingFontIcon(): boolean {
    return !this.svgIcon;
  }

  private _setSvgElement(svg: SVGElement) {
    this._clearSvgElement();

    // Note: we do this fix here, rather than the icon registry, because the
    // references have to point to the URL at the time that the icon was created.
    const path = this._location.getPathname();
    this._previousPath = path;
    this._cacheChildrenWithExternalReferences(svg);
    this._prependPathToReferences(path);
    this._elementRef.nativeElement.appendChild(svg);
  }

  private _clearSvgElement() {
    const layoutElement: HTMLElement = this._elementRef.nativeElement;
    let childCount = layoutElement.childNodes.length;

    if (this._elementsWithExternalReferences) {
      this._elementsWithExternalReferences.clear();
    }

    // Remove existing non-element child nodes and SVGs, and add the new SVG element. Note that
    // we can't use innerHTML, because IE will throw if the element has a data binding.
    while (childCount--) {
      const child = layoutElement.childNodes[childCount];

      // 1 corresponds to Node.ELEMENT_NODE. We remove all non-element nodes to get rid
      // of any loose text nodes, as well as any SVG elements to remove any old icons.
      if (child.nodeType !== 1 || child.nodeName.toLowerCase() === 'svg') {
        child.remove();
      }
    }
  }

  private _updateFontIconClasses() {
    if (!this._usingFontIcon()) {
      return;
    }

    const elem: HTMLElement = this._elementRef.nativeElement;
    const fontSetClasses = (
      this.fontSet
        ? this._iconRegistry.classNameForFontAlias(this.fontSet).split(/ +/)
        : this._iconRegistry.getDefaultFontSetClass()
    ).filter(className => className.length > 0);

    //++ CWT: For fonts like Bootstrap-icons, Fontawesome-icons etc.

    this._textContentChanged = false;
    if (!fontSetClasses.includes("cute-ligature-font") && !this.fontIcon && elem.textContent) {
      this._fontIcon = elem.textContent.trim();
      elem.textContent = "";
      this._textContentChanged = true;
    }

    this._fontIconPrefixed = this.fontIcon;

    if (this._fontIconPrefixed && this.autoPrefix && !fontSetClasses.includes("cute-ligature-font")) {
      if (fontSetClasses.includes(BOOTSTRAP_ICONS_CLASS)) {
        if (!this._fontIconPrefixed.startsWith(BOOTSTRAP_ICONS_CLASS+"-")) {
          this._fontIconPrefixed = BOOTSTRAP_ICONS_CLASS+"-"+this._fontIconPrefixed;
        }
      } else if (fontSetClasses.find((v)=> v===FONTAWESOME_ICONS_CLASS || v.startsWith(FONTAWESOME_ICONS_CLASS+"-"))) {
        if (!this._fontIconPrefixed.startsWith(FONTAWESOME_ICONS_CLASS+"-")) {
          this._fontIconPrefixed = FONTAWESOME_ICONS_CLASS+"-"+this._fontIconPrefixed;
        }
      }
    }
    //--

    this._previousFontSetClass.forEach(className => elem.classList.remove(className));
    fontSetClasses.forEach(className => elem.classList.add(className));
    this._previousFontSetClass = fontSetClasses;

    if (
      this._fontIconPrefixed !== this._previousFontIconClass &&
      !fontSetClasses.includes('cute-ligature-font')
    ) {
      if (this._previousFontIconClass) {
        elem.classList.remove(this._previousFontIconClass);
      }
      if (this._fontIconPrefixed) {
        elem.classList.add(this._fontIconPrefixed);
      }
      this._previousFontIconClass = this._fontIconPrefixed;
    }
  }

  /**
   * Cleans up a value to be used as a fontIcon or fontSet.
   * Since the value ends up being assigned as a CSS class, we
   * have to trim the value and omit space-separated values.
   */
  private _cleanupFontValue(value: string | undefined) {
    return typeof value === 'string' ? value.trim().split(' ')[0] : value;
  }

  /**
   * Prepends the current path to all elements that have an attribute pointing to a `FuncIRI`
   * reference. This is required because WebKit browsers require references to be prefixed with
   * the current path if the page has a `base` tag.
   */
  private _prependPathToReferences(path: string) {
    const elements = this._elementsWithExternalReferences;

    if (elements) {
      elements.forEach((attrs, element) => {
        attrs.forEach(attr => {
          element.setAttribute(attr.name, `url('${path}#${attr.value}')`);
        });
      });
    }
  }

  /**
   * Caches the children of an SVG element that have `url()`
   * references that we need to prefix with the current path.
   */
  private _cacheChildrenWithExternalReferences(element: SVGElement) {
    const elementsWithFuncIri = element.querySelectorAll(funcIriAttributeSelector);
    const elements = (this._elementsWithExternalReferences =
      this._elementsWithExternalReferences || new Map());

    for (let i = 0; i < elementsWithFuncIri.length; i++) {
      funcIriAttributes.forEach(attr => {
        const elementWithReference = elementsWithFuncIri[i];
        const value = elementWithReference.getAttribute(attr);
        const match = value ? value.match(funcIriPattern) : null;

        if (match) {
          let attributes = elements.get(elementWithReference);

          if (!attributes) {
            attributes = [];
            elements.set(elementWithReference, attributes);
          }

          attributes!.push({name: attr, value: match[1]});
        }
      });
    }
  }

  /** Sets a new SVG icon with a particular name. */
  private _updateSvgIcon(rawName: string | undefined) {
    this._svgNamespace = null;
    this._svgName = null;
    this._currentIconFetch.unsubscribe();

    if (rawName) {
      const [namespace, iconName] = this._splitIconName(rawName);

      if (namespace) {
        this._svgNamespace = namespace;
      }

      if (iconName) {
        this._svgName = iconName;
      }

      this._currentIconFetch = this._iconRegistry
        .getNamedSvgIcon(iconName, namespace)
        .pipe(take(1))
        .subscribe({
          next: (svg => this._setSvgElement(svg)),
          error: (err: Error) => {
            const errorMessage = `Error retrieving icon ${namespace}:${iconName}! ${err.message}`;
            this._errorHandler.handleError(new Error(errorMessage));
          },
        });
    }
  }

  protected readonly toColorCssClass = toColorCssClass;
}
