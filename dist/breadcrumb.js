"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildBreadcrumbs = void 0;
const typedoc_1 = require("typedoc");
/**
 * Find (key, valute) path
 * @param ob Object
 * @param key Key
 * @param value Value
 * @returns Path
 */
const findPath = (ob, key, value) => {
    const path = [];
    const keyExists = (obj) => {
        if (!obj || typeof obj !== "object")
            return false;
        else if (obj[key] === value)
            return true;
        else {
            for (const k in obj) {
                path.push(k);
                const result = keyExists(obj[k]);
                if (result)
                    return result;
                path.pop();
            }
        }
        return false;
    };
    keyExists(ob);
    return path;
};
/**
 * Build breadcrumbs list
 * @param breads Breadcrumbs
 * @param name Name
 * @returns Breadcrumbs
 */
const buildBreadCrumbsList = (breads, name) => {
    if (!breads)
        return;
    if (!name)
        return;
    const paths = findPath(breads, "completeName", name);
    if (!paths.length)
        return;
    let current = breads;
    const list = paths.map((path) => {
        current = current[path];
        return (typedoc_1.JSX.createElement("li", null, current.href ? (typedoc_1.JSX.createElement("a", { href: current.href }, current.name)) : (current.name)));
    });
    return typedoc_1.JSX.createElement("ul", { class: "tsd-breadcrumb" }, list);
};
/**
 * Build breadcrumbs
 * @param props Props
 * @param func { urlTo }
 * @returns Breadcrumbs
 */
const buildBreadcrumbs = (props, { urlTo }) => {
    const breads = {};
    // Get current name
    const currentName = props.name;
    // Get modules
    const modules = props.project.getChildrenByKind(typedoc_1.ReflectionKind.SomeModule);
    // Get modules informations
    modules.forEach((module) => {
        const name = module.name;
        const href = urlTo(module);
        const path = name.split(".");
        let init = breads;
        path.forEach((p, index) => {
            if (!init[p])
                init[p] = { name: p };
            if (index === path.length - 1)
                init[p] = { completeName: name, name: p, href };
            init = init[p];
        });
    });
    // Return
    return buildBreadCrumbsList(breads, currentName);
};
exports.buildBreadcrumbs = buildBreadcrumbs;
