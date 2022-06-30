/** @module Src */

import {
  Application,
  JSX,
  DefaultTheme,
  PageEvent,
  Reflection,
  DefaultThemeRenderContext,
  Options,
} from "typedoc";

import { buildBreadcrumbs } from "./breadcrumb";
import { buildNav, navStyle } from "./nav";

/**
 * Global style
 */
const globalStyle = `#theme{
  padding: 5px;
}`;

/**
 * Airthium theme context
 */
export class AirthiumThemeContext extends DefaultThemeRenderContext {
  constructor(theme: DefaultTheme, options: Options) {
    super(theme, options);

    // Override breadcrumbs
    this.breadcrumb = (props: Reflection) => {
      return buildBreadcrumbs(props, { urlTo: this.urlTo });
    };

    // Override navigation
    this.navigation = (props: PageEvent<Reflection>) => {
      return buildNav(this, props);
    };
  }
}

/**
 * Airthium theme
 */
export class AirthiumTheme extends DefaultTheme {
  private _contextCache?: AirthiumThemeContext;
  override getRenderContext(): AirthiumThemeContext {
    this._contextCache ||= new AirthiumThemeContext(
      this,
      this.application.options
    );
    return this._contextCache;
  }
}

/**
 * Load
 * @param app Application
 */
export function load(app: Application) {
  // Favicon
  app.renderer.hooks.on("head.end", () => (
    <link
      rel="icon"
      href="https://avatars.githubusercontent.com/u/57901218?s=400&u=92ad61e7988bd5449a692d83349acc654286866c&v=4"
    />
  ));

  // CSS
  const style = globalStyle + navStyle;
  app.renderer.hooks.on("body.begin", () => (
    <style>
      <JSX.Raw html={style} />
    </style>
  ));

  app.renderer.defineTheme("airthium", AirthiumTheme);
}
