//@ts-nocheck

import { AirthiumTheme, AirthiumThemeContext, load } from '../src'

jest.mock('../src/breadcrumb', () => ({
  breadcrumbs: jest.fn
}))

jest.mock('../src/nav', () => ({
  navigation: jest.fn
}))

jest.mock('../src/footer', () => ({
  footer: jest.fn
}))

describe('src/index', () => {
  const app = {
    renderer: {
      hooks: {
        on: (_type, callback) => callback()
      },
      defineTheme: jest.fn
    }
  }
  const renderer = { getComponent: jest.fn, application: {} }

  test('load', () => {
    load(app)
  })

  test('AirthiumThemeContext', () => {
    const context = new AirthiumThemeContext()
    context.breadcrumb()
    context.navigation()
    context.footer()
  })

  test('AirthiumTheme', () => {
    const theme = new AirthiumTheme(renderer)
    theme.getRenderContext()
  })
})
