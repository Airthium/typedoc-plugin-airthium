/** @module Src */

import {
  Application,
  JSX,
  DefaultTheme,
  PageEvent,
  Reflection,
  DefaultThemeRenderContext,
  Options,
  ReflectionKind,
} from "typedoc";

/**
 * The theme context is where all of the partials live for rendering a theme,
 * in addition to some helper functions.
 */
export class NavigationOverrideThemeContext extends DefaultThemeRenderContext {
  constructor(theme: DefaultTheme, options: Options) {
    super(theme, options);

    // Overridden methods must have `this` bound if they intend to use it.
    // <JSX.Raw /> may be used to inject HTML directly.
    this.navigation = (props: PageEvent<Reflection>) => {
      const nav: any = {};

      const modules = props.model.project.getChildrenByKind(
        ReflectionKind.SomeModule
      );

      modules.forEach((module) => {
        const name = module.name;
        const href = this.urlTo(module);

        const path = name.split(".");

        let init = nav;
        path.forEach((p, index) => {
          if (!init[p]) init[p] = {};

          if (index === path.length - 1) init[p] = { name: path.pop(), href };

          init = init[p];
        });
      });

      const buildList = (object: any): any => {
        if (!object) return;

        return (
          <ul class="tsd-index list">
            {Object.keys(object).map((key) => {
              if (key === "name" || key === "href") return;

              const item = object[key];

              return (
                <li class="tsd-kind-module">
                  <a href={item.href} class="tsd-kind-icon">
                    {item.name}
                  </a>
                  {buildList(item)}
                </li>
              );
            })}
          </ul>
        );
      };

      return buildList(nav);
    };
  }
}

/**
 * Airthium theme
 */
export class AirthiumTheme extends DefaultTheme {
  private _contextCache?: NavigationOverrideThemeContext;
  override getRenderContext(): NavigationOverrideThemeContext {
    this._contextCache ||= new NavigationOverrideThemeContext(
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
  app.renderer.defineTheme("airthium", AirthiumTheme);
}
