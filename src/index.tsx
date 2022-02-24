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
        // Check
        if (!object) return;

        // Keys
        const keys = Object.keys(object);

        // Remove name & href
        const nameIndex = keys.indexOf("name");
        if (nameIndex !== -1) keys.splice(nameIndex, 1);
        const hrefIndex = keys.indexOf("href");
        if (hrefIndex !== -1) keys.splice(hrefIndex, 1);

        // Check
        if (!keys.length) return;

        // Return element
        return (
          <ul class="tsd-index list ">
            {Object.keys(object).map((key) => {
              if (key === "name" || key === "href") return;

              const item = object[key];
              const subItem = buildList(item);

              return (
                <li class="tsd-kind-module">
                  {subItem ? (
                    <>
                      <div class="with-collapsible tsd-kind-module">
                        <a href={item.href} class="tsd-kind-icon">
                          {item.name}
                        </a>
                        <button type="button" class="collapsible">
                          &#43;
                        </button>
                      </div>
                      <div class="content">{buildList(item)}</div>
                    </>
                  ) : (
                    <a href={item.href} class="tsd-kind-icon">
                      {item.name}
                    </a>
                  )}
                </li>
              );
            })}
          </ul>
        );
      };

      return <div class="nav">{buildList(nav)}</div>;
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
  app.renderer.hooks.on("body.begin", () => (
    <style>
      <JSX.Raw
        html={`
.nav {
  padding-left: 10px;
}

ul {
  padding-inline-start: 10px !important;
  list-style: disc;
}

.with-collapsible {
  display: flex;
  align-items: center;
}

.collapsible {
  background-color: #eee;
  color: #444;
  cursor: pointer;
  padding: 0 0.25em;
  margin-left: 0.5em;
  border: none;
  outline: none;
  font-size: 1.5em;
}

.active, .collapsible:hover {
  background-color: #ccc;
}

.content {
  display: none;
  overflow: hidden;
}
`}
      />
    </style>
  ));
  app.renderer.hooks.on("body.end", () => (
    <script>
      <JSX.Raw
        html={`
const collapsibles = document.getElementsByClassName("collapsible");
for (let i = 0; i < collapsibles.length; i++) {
  collapsibles[i].addEventListener("click", function() {
    this.classList.toggle("active");
    //const name = this.parentNode.firstChild.innerHTML
    const content = this.parentNode.parentNode.lastChild;
    if (content.style.display === "block") {
      //sessionStorage.setItem(name, false)
      content.style.display = "none";
    } else {
      //sessionStorage.setItem(name, true)
      content.style.display = "block";
    }
  });
}
`}
      />
    </script>
  ));

  app.renderer.defineTheme("airthium", AirthiumTheme);
}
