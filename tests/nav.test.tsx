import { navigation } from '../src/nav'

jest.mock('../src/lib', () => ({
  classNames: () => 'classNames',
  getDisplayName: () => 'displayName',
  wbr: () => ['name1']
}))

describe('src/nav', () => {
  let context
  let props

  beforeEach(() => {
    context = {
      urlTo: () => 'url',
      getReflectionClasses: () => 'extra',
      icons: { kind: () => {}, chevronDown: () => {}, undefined: () => {} }
    }

    const module = {
      name: 'moduleName',
      isDeprecated: () => false,
      isProject: () => true,
      getFullName: () => 'moduleName'
    }
    const subModule = {
      name: 'moduleName.subModuleName',
      isDeprecated: () => false,
      isProject: () => false,
      getFullName: () => 'subModuleName'
    }
    props = {
      project: { kind: 'kind' },
      model: {
        project: {
          getChildrenByKind: () => [module, subModule]
        }
      }
    }
  })

  test('render', () => {
    const element = navigation(context, props)
    expect(element).toBeDefined()
  })
})
