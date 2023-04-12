import {
  DeclarationReflection,
  JSX,
  ProjectReflection,
  Reflection,
} from "typedoc";

/**
 * Get display name
 * @param refl Reflection
 * @returns Display name
 */
export const getDisplayName = (refl: Reflection): string => {
  let version = "";
  if (
    (refl instanceof DeclarationReflection ||
      refl instanceof ProjectReflection) &&
    refl.packageVersion
  ) {
    version = ` - v${refl.packageVersion}`;
  }

  return `${refl.name.split(".").pop()}${version}`;
};

/**
 * Wbr
 * @param str String
 * @returns Wbr
 */
export const wbr = (str: string): (string | JSX.Element)[] => {
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

/**
 * Class names
 * @param names Names
 * @param extraCss Extra CSS
 * @returns Class names
 */
export const classNames = (
  names: Record<string, boolean | null | undefined>,
  extraCss?: string
): string | undefined => {
  const css = Object.keys(names)
    .filter((key) => names[key])
    .concat(extraCss || "")
    .join(" ")
    .trim()
    .replace(/\s+/g, " ");
  return css.length ? css : undefined;
};
