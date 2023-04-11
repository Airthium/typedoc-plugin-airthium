/** @module Src */

import {
  Application,
  JSX,
  DefaultTheme,
  PageEvent,
  Reflection,
  DefaultThemeRenderContext,
} from "typedoc";

import { buildBreadcrumbs } from "./breadcrumb";
import { buildNav, navStyle } from "./nav";
import { buildFooter } from "./footer";

/**
 * Global style
 */
const globalStyle = `#theme{
  padding: 5px;
}
.tsd-panel-group {
  max-width:99%
}
#tsd-search .field label {
  display: flex;
  justify-content: center;
  align-items: center;
}
.container.container-main {
  padding: 0 4rem;
}
.container.container-main > div:first-child {
  flex: 1 0 75%;
  overflow: auto;
}`;

/**
 * Airthium theme context
 */
export class AirthiumThemeContext extends DefaultThemeRenderContext {
  // Override breadcrumbs
  override breadcrumb = (props: Reflection) => {
    return buildBreadcrumbs(props, { urlTo: this.urlTo });
  };

  // Override navigation
  override navigation = (props: PageEvent<Reflection>): JSX.Element => {
    return buildNav(this, props);
  };

  // Override footer
  override footer = (): JSX.Element | undefined => {
    return buildFooter(this);
  };
}

/**
 * Airthium theme
 */
export class AirthiumTheme extends DefaultTheme {
  private _contextCache?: AirthiumThemeContext;
  override getRenderContext(
    pageEvent: PageEvent<Reflection>
  ): AirthiumThemeContext {
    this._contextCache ||= new AirthiumThemeContext(
      this,
      pageEvent,
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
