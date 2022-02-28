import {
  DeclarationReflection,
  JSX,
  PageEvent,
  Reflection,
  ReflectionKind,
} from "typedoc";

export interface NavItem {
  name?: string;
  completeName?: string;
  href?: string;
  [key: string]: string | NavItem | undefined;
}

/**
 * Build list
 * @param object Object
 * @returns JSX
 */
const buildList = (object: NavItem): JSX.Element | undefined => {
  // Check
  if (!object) return;

  // Keys
  const keys = Object.keys(object);

  // Remove completeName, name & href
  const completeNameIndex = keys.indexOf("completeName");
  if (completeNameIndex !== -1) keys.splice(completeNameIndex, 1);
  const nameIndex = keys.indexOf("name");
  if (nameIndex !== -1) keys.splice(nameIndex, 1);
  const hrefIndex = keys.indexOf("href");
  if (hrefIndex !== -1) keys.splice(hrefIndex, 1);

  // Check
  if (!keys.length) return;

  // Return element
  return (
    <ul class="tsd-index list ">
      {keys.map((key) => {
        const item = object[key] as NavItem;
        const completeName = item.completeName;
        const name = item.name;
        const href = item.href;

        const subItem = buildList(item);

        return (
          <li class="tsd-kind-module">
            {subItem ? (
              <>
                <div class="with-collapsible tsd-kind-module">
                  <span style="display: none;">{completeName}</span>
                  <a href={href} class="tsd-kind-icon">
                    {name}
                  </a>
                  <button type="button" class="collapsible" />
                </div>
                <div class="content">{buildList(item)}</div>
              </>
            ) : (
              <a href={href} class="tsd-kind-icon">
                {name}
              </a>
            )}
          </li>
        );
      })}
    </ul>
  );
};

/**
 * Build nav
 * @param props Props
 * @param func { urlTo }
 * @returns Nav
 */
export const buildNav = (
  props: PageEvent<Reflection>,
  { urlTo }: { urlTo: (module: DeclarationReflection) => string | undefined }
): JSX.Element => {
  const nav: NavItem = {};

  // Get modules
  const modules = props.model.project.getChildrenByKind(
    ReflectionKind.SomeModule
  );

  // Get modules informations
  modules.forEach((module) => {
    const name = module.name;
    const href = urlTo(module);

    const path = name.split(".");

    let init = nav;
    path.forEach((p, index) => {
      if (!init[p]) init[p] = { name: p };

      if (index === path.length - 1)
        init[p] = { completeName: name, name: p, href };

      init = init[p] as NavItem;
    });
  });

  // Return
  return <div class="nav">{buildList(nav)}</div>;
};

export const navScript = `const getCompleteName = (collapsible) => {
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

export const navStyle = `
  .nav {
    padding-left: 10px;
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
