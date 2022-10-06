"use strict";
/** @module Src */
Object.defineProperty(exports, "__esModule", { value: true });
exports.load = exports.AirthiumTheme = exports.AirthiumThemeContext = void 0;
const typedoc_1 = require("typedoc");
const breadcrumb_1 = require("./breadcrumb");
const nav_1 = require("./nav");
/**
 * Global style
 */
const globalStyle = `#theme{
  padding: 5px;
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
class AirthiumThemeContext extends typedoc_1.DefaultThemeRenderContext {
    constructor(theme, options) {
        super(theme, options);
        // Override breadcrumbs
        this.breadcrumb = (props) => {
            return (0, breadcrumb_1.buildBreadcrumbs)(props, { urlTo: this.urlTo });
        };
        // Override navigation
        this.navigation = (props) => {
            return (0, nav_1.buildNav)(this, props);
        };
    }
}
exports.AirthiumThemeContext = AirthiumThemeContext;
/**
 * Airthium theme
 */
class AirthiumTheme extends typedoc_1.DefaultTheme {
    getRenderContext() {
        this._contextCache || (this._contextCache = new AirthiumThemeContext(this, this.application.options));
        return this._contextCache;
    }
}
exports.AirthiumTheme = AirthiumTheme;
/**
 * Load
 * @param app Application
 */
function load(app) {
    // Favicon
    app.renderer.hooks.on("head.end", () => (typedoc_1.JSX.createElement("link", { rel: "icon", href: "https://avatars.githubusercontent.com/u/57901218?s=400&u=92ad61e7988bd5449a692d83349acc654286866c&v=4" })));
    // CSS
    const style = globalStyle + nav_1.navStyle;
    app.renderer.hooks.on("body.begin", () => (typedoc_1.JSX.createElement("style", null,
        typedoc_1.JSX.createElement(typedoc_1.JSX.Raw, { html: style }))));
    app.renderer.defineTheme("airthium", AirthiumTheme);
}
exports.load = load;
