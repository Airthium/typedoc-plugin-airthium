"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildNav = exports.navStyle = void 0;
const typedoc_1 = require("typedoc");
const icon_1 = require("./icon");
const classNames = (names, extraCss) => {
    const css = Object.keys(names)
        .filter((key) => names[key])
        .concat(extraCss || "")
        .join(" ")
        .trim()
        .replace(/\s+/g, " ");
    return css.length ? css : undefined;
};
const wbr = (str) => {
    const ret = [];
    const re = /[\s\S]*?(?:[^_-][_-](?=[^_-])|[^A-Z](?=[A-Z][^A-Z]))/g;
    let match;
    let i = 0;
    while ((match = re.exec(str))) {
        ret.push(match[0], typedoc_1.JSX.createElement("wbr", null));
        i += match[0].length;
    }
    ret.push(str.slice(i));
    return ret;
};
exports.navStyle = `.padding-left-25 {
  padding-left: 25px !important;
}`;
class Tree {
    constructor(id, module) {
        this.getChild = (id) => {
            let node;
            this.children.some((n) => {
                if (n.id === id) {
                    node = n;
                    return true;
                }
            });
            return node;
        };
        this.id = id;
        this.module = module;
        this.children = [];
    }
}
const buildNav = (context, props) => {
    return (typedoc_1.JSX.createElement(typedoc_1.JSX.Fragment, null,
        settings(),
        primaryNavigation(context, props),
        secondaryNavigation(context, props)));
};
exports.buildNav = buildNav;
const settings = () => (typedoc_1.JSX.createElement("div", { class: "tsd-navigation settings" },
    typedoc_1.JSX.createElement("details", { class: "tsd-index-accordion", open: false },
        typedoc_1.JSX.createElement("summary", { class: "tsd-accordion-summary" },
            typedoc_1.JSX.createElement("h3", null,
                icon_1.icons.chevronDown(),
                " Settings")),
        typedoc_1.JSX.createElement("div", { class: "tsd-accordion-details" },
            typedoc_1.JSX.createElement("div", { class: "tsd-theme-toggle" },
                typedoc_1.JSX.createElement("h4", { class: "uppercase" }, "Theme"),
                typedoc_1.JSX.createElement("select", { id: "theme" },
                    typedoc_1.JSX.createElement("option", { value: "os" }, "OS"),
                    typedoc_1.JSX.createElement("option", { value: "light" }, "Light"),
                    typedoc_1.JSX.createElement("option", { value: "dark" }, "Dark")))))));
const primaryNavigation = (context, props) => {
    // Create the navigation for the current page
    const modules = props.model.project.getChildrenByKind(typedoc_1.ReflectionKind.SomeModule);
    const tree = new Tree("root");
    modules.forEach((module) => {
        const names = module.name.split(".");
        names.reduce((prev, name) => {
            let node = prev.getChild(name);
            if (!node) {
                node = new Tree(name, module);
                prev.children.push(node);
            }
            return node;
        }, tree);
    });
    const selected = props.model.isProject();
    const current = selected || modules.some((mod) => inPath(mod, props.model));
    return (typedoc_1.JSX.createElement("nav", { class: "tsd-navigation primary" },
        typedoc_1.JSX.createElement("ul", null,
            typedoc_1.JSX.createElement("li", { class: classNames({ current, selected }) },
                typedoc_1.JSX.createElement("a", { href: context.urlTo(props.model.project) }, props.project.name),
                typedoc_1.JSX.createElement("ul", null, tree.children.map((child) => link(child)))))));
    function link(mod) {
        if (!mod.module)
            return;
        const current = inPath(mod.module, props.model);
        const selected = mod.module.name === props.model.name;
        let childNav;
        const childModules = mod.children;
        if (childModules === null || childModules === void 0 ? void 0 : childModules.length)
            return (typedoc_1.JSX.createElement("li", { class: classNames({ current, selected, deprecated: mod.module.isDeprecated() }, mod.module.cssClasses) },
                typedoc_1.JSX.createElement("details", { class: "tsd-index-accordion", open: false },
                    typedoc_1.JSX.createElement("summary", { class: "tsd-accordion-summary" },
                        typedoc_1.JSX.createElement("a", { href: context.urlTo(mod.module) },
                            icon_1.icons.chevronDown(),
                            " ",
                            mod.id)),
                    typedoc_1.JSX.createElement("div", { class: "tsd-accordion-details" },
                        typedoc_1.JSX.createElement("ul", null,
                            typedoc_1.JSX.createElement("li", { class: classNames({
                                    current,
                                    selected,
                                    deprecated: mod.module.isDeprecated(),
                                }, mod.module.cssClasses) },
                                typedoc_1.JSX.createElement("a", { class: "padding-left-25", href: context.urlTo(mod.module) }, "Index"),
                                childNav),
                            childModules.map(link))),
                    childNav)));
        return (typedoc_1.JSX.createElement("li", { class: classNames({ current, selected, deprecated: mod.module.isDeprecated() }, mod.module.cssClasses) },
            typedoc_1.JSX.createElement("a", { class: "padding-left-25", href: context.urlTo(mod.module) }, mod.id),
            childNav));
    }
};
const secondaryNavigation = (context, props) => {
    var _a;
    // Multiple entry points, and on main project page.
    if (props.model.isProject() &&
        props.model.getChildrenByKind(typedoc_1.ReflectionKind.Module).length) {
        return;
    }
    const effectivePageParent = (props.model instanceof typedoc_1.ContainerReflection &&
        ((_a = props.model.children) === null || _a === void 0 ? void 0 : _a.length)) ||
        props.model.isProject()
        ? props.model
        : props.model.parent;
    const children = effectivePageParent.children || [];
    const pageNavigation = children
        .filter((child) => !child.kindOf(typedoc_1.ReflectionKind.SomeModule))
        .map((child) => {
        return (typedoc_1.JSX.createElement("li", { class: classNames({
                deprecated: child.isDeprecated(),
                current: props.model === child,
            }, child.cssClasses) },
            typedoc_1.JSX.createElement("a", { href: context.urlTo(child), class: "tsd-index-link" },
                icon_1.icons[child.kind](),
                wbr(child.name))));
    });
    if (effectivePageParent.kindOf(typedoc_1.ReflectionKind.SomeModule | typedoc_1.ReflectionKind.Project)) {
        return (typedoc_1.JSX.createElement("nav", { class: "tsd-navigation secondary menu-sticky" }, !!pageNavigation.length && typedoc_1.JSX.createElement("ul", null, pageNavigation)));
    }
    return (typedoc_1.JSX.createElement("nav", { class: "tsd-navigation secondary menu-sticky" },
        typedoc_1.JSX.createElement("ul", null,
            typedoc_1.JSX.createElement("li", { class: classNames({
                    deprecated: effectivePageParent.isDeprecated(),
                    current: effectivePageParent === props.model,
                }, effectivePageParent.cssClasses) },
                typedoc_1.JSX.createElement("a", { href: context.urlTo(effectivePageParent), class: "tsd-index-link" },
                    icon_1.icons[effectivePageParent.kind](),
                    typedoc_1.JSX.createElement("span", null, wbr(effectivePageParent.name))),
                !!pageNavigation.length && typedoc_1.JSX.createElement("ul", null, pageNavigation)))));
};
function inPath(thisPage, toCheck) {
    while (toCheck) {
        if (toCheck.isProject())
            return false;
        if (thisPage === toCheck)
            return true;
        toCheck = toCheck.parent;
    }
    return false;
}
