//@ts-nocheck

import { load } from '../src'

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

  test('load', () => {
    load(app)
  })
})
