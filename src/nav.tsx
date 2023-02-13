import {
  ContainerReflection,
  DeclarationReflection,
  DefaultThemeRenderContext,
  JSX,
  PageEvent,
  Reflection,
  ReflectionKind,
} from "typedoc";
import { icons } from "./icon";

const classNames = (
  names: Record<string, boolean | null | undefined>,
  extraCss?: string
) => {
  const css = Object.keys(names)
    .filter((key) => names[key])
    .concat(extraCss || "")
    .join(" ")
    .trim()
    .replace(/\s+/g, " ");
  return css.length ? css : undefined;
};

const wbr = (str: string): (string | JSX.Element)[] => {
  const ret: (string | JSX.Element)[] = [];
  const re = /[\s\S]*?(?:[^_-][_-](?=[^_-])|[^A-Z](?=[A-Z][^A-Z]))/g;
  let match: RegExpExecArray | null;
  let i = 0;
  while ((match = re.exec(str))) {
    ret.push(match[0], <wbr />);
    i += match[0].length;
  }
  ret.push(str.slice(i));

  return ret;
};

export const navStyle = `.padding-left-25 {
  padding-left: 25px !important;
}
.text-ellipsis {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.chevron > svg {
  margin-bottom: -0.25rem;
}`;

class Tree {
  id: string;
  module?: DeclarationReflection;
  children: any[];

  constructor(id: string, module?: DeclarationReflection) {
    this.id = id;
    this.module = module;
    this.children = [];
  }

  getChild = (id: string): Tree | undefined => {
    let node;
    this.children.some((n) => {
      if (n.id === id) {
        node = n;
        return true;
      }
    });
    return node;
  };
}

export const buildNav = (
  context: DefaultThemeRenderContext,
  props: PageEvent<Reflection>
) => {
  return (
    <>
      {settings()}
      {primaryNavigation(context, props)}
      {secondaryNavigation(context, props)}
    </>
  );
};

const settings = () => (
  <div class="tsd-navigation settings">
    <details class="tsd-index-accordion" open={false}>
      <summary class="tsd-accordion-summary">
        <h3 class="chevron">{icons.chevronDown()} Settings</h3>
      </summary>
      <div class="tsd-accordion-details">
        <div class="tsd-theme-toggle">
          <h4 class="uppercase">Theme</h4>
          <select id="theme">
            <option value="os">OS</option>
            <option value="light">Light</option>
            <option value="dark">Dark</option>
          </select>
        </div>
      </div>
    </details>
  </div>
);

const primaryNavigation = (
  context: DefaultThemeRenderContext,
  props: PageEvent<Reflection>
) => {
  // Create the navigation for the current page

  const modules = props.model.project.getChildrenByKind(
    ReflectionKind.SomeModule
  );
  const tree = new Tree("root");
  modules.forEach((module) => {
    const names = module.name.split(".");
    names.reduce((prev: Tree, name: string) => {
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

  return (
    <nav class="tsd-navigation primary">
      <ul>
        <li class={classNames({ current, selected })}>
          <a href={context.urlTo(props.model.project)}>{props.project.name}</a>
          <ul>{tree.children.map((child) => link(child))}</ul>
        </li>
      </ul>
    </nav>
  );

  function link(mod: Tree) {
    if (!mod.module) return;

    const current = inPath(mod.module, props.model);
    const selected = mod.module.name === props.model.name;
    let childNav: JSX.Element | undefined;
    const childModules = mod.children;
    if (childModules?.length)
      return (
        <li
          class={classNames(
            { current, selected, deprecated: mod.module.isDeprecated() },
            mod.module.cssClasses
          )}
        >
          <details class="tsd-index-accordion" open={false}>
            <summary class="tsd-accordion-summary">
              <a class="chevron text-ellipsis" href={context.urlTo(mod.module)}>
                {icons.chevronDown()} {mod.id}
              </a>
            </summary>
            <div class="tsd-accordion-details">
              <ul>
                <li
                  class={classNames(
                    {
                      current,
                      selected,
                      deprecated: mod.module.isDeprecated(),
                    },
                    mod.module.cssClasses
                  )}
                >
                  <a
                    class="padding-left-25 text-ellipsis"
                    href={context.urlTo(mod.module)}
                  >
                    Index
                  </a>
                  {childNav}
                </li>
                {childModules.map(link)}
              </ul>
            </div>
            {childNav}
          </details>
        </li>
      );

    return (
      <li
        class={classNames(
          { current, selected, deprecated: mod.module.isDeprecated() },
          mod.module.cssClasses
        )}
      >
        <a
          class="padding-left-25 text-ellipsis"
          href={context.urlTo(mod.module)}
        >
          {mod.id}
        </a>
        {childNav}
      </li>
    );
  }
};

const secondaryNavigation = (
  context: DefaultThemeRenderContext,
  props: PageEvent<Reflection>
) => {
  // Multiple entry points, and on main project page.
  if (
    props.model.isProject() &&
    props.model.getChildrenByKind(ReflectionKind.Module).length
  ) {
    return;
  }

  const effectivePageParent =
    (props.model instanceof ContainerReflection &&
      props.model.children?.length) ||
    props.model.isProject()
      ? props.model
      : props.model.parent!;

  const children = (effectivePageParent as ContainerReflection).children || [];

  const pageNavigation = children
    .filter((child) => !child.kindOf(ReflectionKind.SomeModule))
    .map((child) => {
      return (
        <li
          class={classNames(
            {
              deprecated: child.isDeprecated(),
              current: props.model === child,
            },
            child.cssClasses
          )}
        >
          <a href={context.urlTo(child)} class="tsd-index-link">
            {icons[child.kind]()}
            {wbr(child.name)}
          </a>
        </li>
      );
    });

  if (
    effectivePageParent.kindOf(
      ReflectionKind.SomeModule || ReflectionKind.Project
    )
  ) {
    return (
      <nav class="tsd-navigation secondary">
        {!!pageNavigation.length && <ul>{pageNavigation}</ul>}
      </nav>
    );
  }

  return (
    <nav class="tsd-navigation secondary">
      <ul>
        <li
          class={classNames(
            {
              deprecated: effectivePageParent.isDeprecated(),
              current: effectivePageParent === props.model,
            },
            effectivePageParent.cssClasses
          )}
        >
          <a href={context.urlTo(effectivePageParent)} class="tsd-index-link">
            {icons[effectivePageParent.kind]()}
            <span>{wbr(effectivePageParent.name)}</span>
          </a>
          {!!pageNavigation.length && <ul>{pageNavigation}</ul>}
        </li>
      </ul>
    </nav>
  );
};

function inPath(
  thisPage: Reflection,
  toCheck: Reflection | undefined
): boolean {
  while (toCheck) {
    if (toCheck.isProject()) return false;

    if (thisPage === toCheck) return true;

    toCheck = toCheck.parent;
  }
  return false;
}
