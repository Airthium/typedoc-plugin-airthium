import {
  DeclarationReflection,
  JSX,
  Reflection,
  ReflectionKind,
} from "typedoc";

/**
 * Bread item
 */
export interface BreadItem {
  name?: string;
  completeName?: string;
  href?: string;
  [key: string]: string | BreadItem | undefined;
}

/**
 * Find (key, valute) path
 * @param ob Object
 * @param key Key
 * @param value Value
 * @returns Path
 */
const findPath = (ob: BreadItem, key: string, value: string): string[] => {
  const path: string[] = [];

  const keyExists = (obj: BreadItem): boolean => {
    if (!obj || typeof obj !== "object") return false;
    else if (obj[key] === value) return true;
    else {
      for (const k in obj) {
        path.push(k);
        const result = keyExists(obj[k] as BreadItem);
        if (result) return result;
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
const buildBreadCrumbsList = (
  breads: BreadItem,
  name: string
): JSX.Element | undefined => {
  if (!breads) return;
  if (!name) return;

  const paths = findPath(breads, "completeName", name);

  if (!paths.length) return;

  let current = breads;
  const list = paths.map((path: string) => {
    current = current[path] as BreadItem;
    return (
      <li
        //@ts-ignore
        key={current.href}
      >
        {current.href ? (
          <a href={current.href}>{current.name}</a>
        ) : (
          current.name
        )}
      </li>
    );
  });

  return <ul class="tsd-breadcrumb">{list}</ul>;
};

/**
 * Build breadcrumbs
 * @param props Props
 * @param func { urlTo }
 * @returns Breadcrumbs
 */
export const breadcrumbs = (
  props: Reflection,
  { urlTo }: { urlTo: (module: DeclarationReflection) => string | undefined }
): JSX.Element | undefined => {
  const breads: BreadItem = {};

  // Get current name
  const currentName = props.name;

  // Get modules
  const modules = props.project.getChildrenByKind(ReflectionKind.SomeModule);

  // Get modules informations
  modules.forEach((module) => {
    const name = module.name;
    const href = urlTo(module);

    const path = name.split(".");

    let init = breads;
    path.forEach((p, index) => {
      if (!init[p]) init[p] = { name: p };

      if (index === path.length - 1)
        init[p] = { completeName: name, name: p, href };

      init = init[p] as BreadItem;
    });
  });

  // Return
  return buildBreadCrumbsList(breads, currentName);
};
