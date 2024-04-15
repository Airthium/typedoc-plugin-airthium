//@ts-nocheck

import { footer } from '../src/footer'

describe('src/footer', () => {
  let context
  beforeEach(() => {
    context = {
      options: {
        getValue: () => undefined
      }
    }
  })

  test('render', () => {
    const element = footer(context)
    expect(element).toBeDefined()
  })

  test('hide', () => {
    context.options.getValue = () => 'hide'
    const element = footer(context)
    expect(element).toEqual(<></>)
  })
})
