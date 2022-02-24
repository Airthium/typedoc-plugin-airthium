"use strict";
/** @module Src */
Object.defineProperty(exports, "__esModule", { value: true });
exports.load = exports.AirthiumTheme = exports.NavigationOverrideThemeContext = void 0;
const typedoc_1 = require("typedoc");
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
            const buildList = (object) => {
                if (!object)
                    return;
                return (typedoc_1.JSX.createElement("ul", { class: "tsd-index list" }, Object.keys(object).map((key) => {
                    if (key === "name" || key === "href")
                        return;
                    const item = object[key];
                    return (typedoc_1.JSX.createElement("li", { class: "tsd-kind-module" },
                        typedoc_1.JSX.createElement("a", { href: item.href, class: "tsd-kind-icon" }, item.name),
                        buildList(item)));
                })));
            };
            return buildList(nav);
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
    app.renderer.defineTheme("airthium", AirthiumTheme);
}
exports.load = load;
