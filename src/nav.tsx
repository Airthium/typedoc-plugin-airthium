import {
  DeclarationReflection,
  DefaultThemeRenderContext,
  JSX,
  PageEvent,
  ProjectReflection,
  Reflection,
  ReflectionKind,
} from "typedoc";

import { classNames, getDisplayName, wbr } from "./lib";

class Tree {
  id: string;
  module?: DeclarationReflection;
  children: Tree[];

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

export function navigation(
  context: DefaultThemeRenderContext,
  props: PageEvent<Reflection>
) {
  // Create the navigation for the current page
  // Recurse to children if the parent is some kind of module

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

  return (
    <nav class="tsd-navigation">
      {link(props.project)}
      <ul class="tsd-small-nested-navigation">
        {tree.children?.map((child) => (
          <li>{links(child)}</li>
        ))}
      </ul>
    </nav>
  );

  function links(child: Tree) {
    const mod = child.module!;
    const children = child.children;

    const nameClasses = classNames(
      { deprecated: mod.isDeprecated() },
      mod.isProject() ? void 0 : context.getReflectionClasses(mod)
    );

    if (!children.length) {
      return link(mod, nameClasses);
    }

    return (
      <details
        class={classNames({ "tsd-index-accordion": true }, nameClasses)}
        open={inPath(mod)}
        data-key={mod.getFullName()}
      >
        <summary class="tsd-accordion-summary">
          {context.icons.chevronDown()}
          {link(mod)}
        </summary>
        <div class="tsd-accordion-details">
          <ul class="tsd-nested-navigation">
            {children.map((c) => (
              <li>{links(c)}</li>
            ))}
          </ul>
        </div>
      </details>
    );
  }

  function link(
    child: DeclarationReflection | ProjectReflection,
    nameClasses?: string
  ) {
    return (
      <a
        href={context.urlTo(child)}
        class={classNames({ current: child === props.model }, nameClasses)}
      >
        {context.icons[child.kind]()}
        <span>{wbr(getDisplayName(child))}</span>
      </a>
    );
  }

  function inPath(mod: DeclarationReflection | ProjectReflection) {
    let iter: Reflection | undefined = props.model;
    do {
      if (iter == mod) return true;
      iter = iter.parent;
    } while (iter);
    return false;
  }
}
