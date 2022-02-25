"use strict";
/** @module Src */
Object.defineProperty(exports, "__esModule", { value: true });
exports.load = exports.AirthiumTheme = exports.NavigationOverrideThemeContext = void 0;
const typedoc_1 = require("typedoc");
const style = `.nav {
  padding-left: 10px;
}

.nav ul {
  padding-inline-start: 10px !important;
  margin: 5px 0 10px 0;
  list-style: disc;
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
const buildList = (object) => {
    // Check
    if (!object)
        return;
    // Keys
    const keys = Object.keys(object);
    // Remove name & href
    const nameIndex = keys.indexOf("name");
    if (nameIndex !== -1)
        keys.splice(nameIndex, 1);
    const hrefIndex = keys.indexOf("href");
    if (hrefIndex !== -1)
        keys.splice(hrefIndex, 1);
    // Check
    if (!keys.length)
        return;
    // Return element
    return (typedoc_1.JSX.createElement("ul", { class: "tsd-index list " }, Object.keys(object).map((key) => {
        if (key === "name" || key === "href")
            return;
        const item = object[key];
        const name = item.name;
        const href = item.href;
        const subItem = buildList(item);
        return (typedoc_1.JSX.createElement("li", { class: "tsd-kind-module" }, subItem ? (typedoc_1.JSX.createElement(typedoc_1.JSX.Fragment, null,
            typedoc_1.JSX.createElement("div", { class: "with-collapsible tsd-kind-module" },
                typedoc_1.JSX.createElement("a", { href: href, class: "tsd-kind-icon" }, name),
                typedoc_1.JSX.createElement("button", { type: "button", class: "collapsible" })),
            typedoc_1.JSX.createElement("div", { class: "content" }, buildList(item)))) : (typedoc_1.JSX.createElement("a", { href: href, class: "tsd-kind-icon" }, name))));
    })));
};
/**
 * The theme context is where all of the partials live for rendering a theme,
 * in addition to some helper functions.
 */
class NavigationOverrideThemeContext extends typedoc_1.DefaultThemeRenderContext {
    constructor(theme, options) {
        super(theme, options);
        // Overridden methods must have `this` bound if they intend to use it.
        // <JSX.Raw /> may be used to inject HTML directly.
        this.navigation = (props) => {
            const nav = {};
            const modules = props.model.project.getChildrenByKind(typedoc_1.ReflectionKind.SomeModule);
            modules.forEach((module) => {
                const name = module.name;
                const href = this.urlTo(module);
                const path = name.split(".");
                let init = nav;
                path.forEach((p, index) => {
                    if (!init[p])
                        init[p] = {};
                    if (index === path.length - 1)
                        init[p] = { name: path.pop(), href };
                    init = init[p];
                });
            });
            return typedoc_1.JSX.createElement("div", { class: "nav" }, buildList(nav));
        };
    }
}
exports.NavigationOverrideThemeContext = NavigationOverrideThemeContext;
/**
 * Airthium theme
 */
class AirthiumTheme extends typedoc_1.DefaultTheme {
    getRenderContext() {
        this._contextCache || (this._contextCache = new NavigationOverrideThemeContext(this, this.application.options));
        return this._contextCache;
    }
}
exports.AirthiumTheme = AirthiumTheme;
/**
 * Load
 * @param app Application
 */
function load(app) {
    app.renderer.hooks.on("body.begin", () => (typedoc_1.JSX.createElement("style", null,
        typedoc_1.JSX.createElement(typedoc_1.JSX.Raw, { html: style }))));
    app.renderer.hooks.on("body.end", () => (typedoc_1.JSX.createElement("script", null,
        typedoc_1.JSX.createElement(typedoc_1.JSX.Raw, { html: script }))));
    app.renderer.defineTheme("airthium", AirthiumTheme);
}
exports.load = load;
