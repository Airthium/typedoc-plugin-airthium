import { DefaultThemeRenderContext, JSX } from 'typedoc'
import { JsxElement } from 'typedoc/dist/lib/utils/jsx.elements'

/**
 * Footer
 * @param context Context
 * @returns Footer
 */
export const footer = (context: DefaultThemeRenderContext): JsxElement => {
  const hideGenerator = context.options.getValue('hideGenerator')
  if (!hideGenerator)
    return (
      <div class="container tsd-generator">
        <p>
          {'Generated using '}
          <a href="https://typedoc.org/" target="_blank">
            TypeDoc
          </a>
          {' and '}
          <a
            href="https://github.com/Airthium/typedoc-plugin-airthium"
            target="_blank"
          >
            TypeDoc Airthium Plugin
          </a>
        </p>
      </div>
    )
  return <></>
}
