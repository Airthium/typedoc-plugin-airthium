"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.navStyle = exports.navScript = exports.buildNav = void 0;
const typedoc_1 = require("typedoc");
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
    // Remove completeName, name & href
    const completeNameIndex = keys.indexOf("completeName");
    if (completeNameIndex !== -1)
        keys.splice(completeNameIndex, 1);
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
    return (typedoc_1.JSX.createElement("ul", { class: "tsd-index list " }, keys.map((key) => {
        const item = object[key];
        const completeName = item.completeName;
        const name = item.name;
        const href = item.href;
        const subItem = buildList(item);
        if (subItem)
            return (typedoc_1.JSX.createElement("li", { class: "tsd-kind-module" },
                typedoc_1.JSX.createElement(typedoc_1.JSX.Fragment, null,
                    typedoc_1.JSX.createElement("div", { class: "with-collapsible tsd-kind-module" },
                        typedoc_1.JSX.createElement("span", { style: "display: none;" }, completeName),
                        typedoc_1.JSX.createElement("a", { href: href, class: "tsd-kind-icon" }, name),
                        typedoc_1.JSX.createElement("button", { type: "button", class: "collapsible" })),
                    typedoc_1.JSX.createElement("div", { class: "content" }, buildList(item)))));
        else
            return (typedoc_1.JSX.createElement("li", { class: "tsd-kind-module" },
                typedoc_1.JSX.createElement("a", { href: href, class: "tsd-kind-icon" }, name)));
    })));
};
/**
 * Build nav
 * @param props Props
 * @param func { urlTo }
 * @returns Nav
 */
const buildNav = (props, { urlTo }) => {
    const nav = {};
    // Get modules
    const modules = props.model.project.getChildrenByKind(typedoc_1.ReflectionKind.SomeModule);
    // Get modules informations
    modules.forEach((module) => {
        const name = module.name;
        const href = urlTo(module);
        const paths = name.split(".");
        let init = nav;
        paths.forEach((path, index) => {
            if (!init[path])
                init[path] = {
                    completeName: paths.slice(0, index + 1).join("."),
                    name: path,
                };
            if (index === paths.length - 1)
                init[path] = { completeName: name, name: path, href };
            init = init[path];
        });
    });
    // Return
    return typedoc_1.JSX.createElement("div", { class: "nav" }, buildList(nav));
};
exports.buildNav = buildNav;
exports.navScript = `const getCompleteName = (collapsible) => {
    return collapsible.previousSibling.previousSibling.innerHTML;
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
      const completeName = getCompleteName(collapsible);
      const active = getItem(completeName);
      if (active === "true") {
        collapsible.classList.add("active");
        const content = getContent(collapsible);
        content.style.display = "block";
      }
    }
  
    // Click event
    collapsible.addEventListener("click", function () {
      this.classList.toggle("active");
      const completeName = getCompleteName(this);
      const content = getContent(this);
      if (content.style.display === "block") {
        setItem(completeName, false);
        content.style.display = "none";
      } else {
        setItem(completeName, true);
        content.style.display = "block";
      }
    });
  }
  `;
exports.navStyle = `
  .nav {
    padding-left: 10px;
  }

  .nav a:not([href]):hover {
    text-decoration: none;
  }
  
  .nav ul {
    padding-inline-start: 10px !important;
    margin: 0px 0 5px 0;
    list-style: disc;
  }
  
  .nav ul li {
    line-height: 30px;
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
  }`;
