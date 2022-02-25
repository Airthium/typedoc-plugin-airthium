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

const style = `.nav {
  padding-left: 10px;
}

.nav ul {
  padding-inline-start: 10px !important;
  margin: 5px 0 10px 0;
  list-style: disc;
}

.nav ul li {
  line-height: 28px;
}

.nav .tsd-kind-icon:before {
  margin: 0 3px 5px 0 !important;
}

.with-collapsible {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.collapsible {
  background-color: #4da6ff;
  color: #fff;
  cursor: pointer;
  padding: 0 0.25em;
  margin-left: 0.5em;
  border: none;
  outline: none;
  font-size: 1.5em;
}

.collapsible::after {
  content: "\\0002B";
}

.collapsible.active::after {
  content: "\\02212";
}

.active, .collapsible:hover {
  background-color: #0672de;
}

.content {
  display: none;
  overflow: hidden;
}
`;

const script = `const getName = (collapsible) => {
  return collapsible.previousSibling.innerHTML;
};

const getContent = (collapsible) => {
  return collapsible.parentNode.nextSibling;
};

const setItem = (name, value) => {
  if (typeof sessionStorage !== "undefined") {
    sessionStorage.setItem(name, value);
  }
};

const getItem = (name) => {
  if (typeof sessionStorage !== "undefined") {
    return sessionStorage.getItem(name);
  } else {
    return false;
  }
};

const collapsibles = document.getElementsByClassName("collapsible");
for (const collapsible of collapsibles) {
  // Active
  {
    const name = getName(collapsible);
    const active = getItem(name);
    if (active === "true") {
      collapsible.classList.add("active");
      const content = getContent(collapsible);
      content.style.display = "block";
    }
  }

  // Click event
  collapsible.addEventListener("click", function () {
    this.classList.toggle("active");
    const name = getName(this);
    const content = getContent(this);
    if (content.style.display === "block") {
      setItem(name, false);
      content.style.display = "none";
    } else {
      setItem(name, true);
      content.style.display = "block";
    }
  });
}
`;

/**
 * Build list
 * @param object Object
 * @returns JSX
 */
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
        const name = item.name;
        const href = item.href;

        const subItem = buildList(item);

        return (
          <li class="tsd-kind-module">
            {subItem ? (
              <>
                <div class="with-collapsible tsd-kind-module">
                  <a href={href} class="tsd-kind-icon">
                    {name}
                  </a>
                  <button type="button" class="collapsible" />
                </div>
                <div class="content">{buildList(item)}</div>
              </>
            ) : (
              <a href={href} class="tsd-kind-icon">
                {name}
              </a>
            )}
          </li>
        );
      })}
    </ul>
  );
};

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
          if (!init[p]) init[p] = { name: p };

          if (index === path.length - 1) init[p] = { name: p, href };

          init = init[p];
        });
      });

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
      <JSX.Raw html={style} />
    </style>
  ));
  app.renderer.hooks.on("body.end", () => (
    <script>
      <JSX.Raw html={script} />
    </script>
  ));

  app.renderer.defineTheme("airthium", AirthiumTheme);
}
