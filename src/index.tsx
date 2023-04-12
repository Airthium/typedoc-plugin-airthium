/** @module Src */

import {
  Application,
  JSX,
  DefaultTheme,
  PageEvent,
  Reflection,
  DefaultThemeRenderContext,
} from "typedoc";

import { breadcrumbs } from "./breadcrumb";
import { navigation } from "./nav";
import { footer } from "./footer";

/**
 * Global style
 */
const globalStyle = `#theme{
  padding: 5px;
}
.tsd-accordion-summary h3 {
  display: flex;
  align-items: center;
}
.col-content h1 {
  line-break: anywhere
}
`;

/**
 * Airthium theme context
 */
export class AirthiumThemeContext extends DefaultThemeRenderContext {
  // Override breadcrumbs
  override breadcrumb = (props: Reflection) => {
    return breadcrumbs(props, { urlTo: this.urlTo });
  };

  // // Override navigation
  override navigation = (props: PageEvent<Reflection>): JSX.Element => {
    return navigation(this, props);
  };

  // Override footer
  override footer = (): JSX.Element | undefined => {
    return footer(this);
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
export const load = (app: Application): void => {
  // Favicon
  app.renderer.hooks.on("head.end", () => (
    <link
      rel="icon"
      href="https://avatars.githubusercontent.com/u/57901218?s=400&u=92ad61e7988bd5449a692d83349acc654286866c&v=4"
    />
  ));

  // CSS
  const style = globalStyle;
  app.renderer.hooks.on("body.begin", () => (
    <style>
      <JSX.Raw html={style} />
    </style>
  ));

  app.renderer.defineTheme("airthium", AirthiumTheme);
};
