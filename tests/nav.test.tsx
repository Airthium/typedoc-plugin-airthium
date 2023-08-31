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
    props = {
      project: { kind: 'kind' },
      model: {
        project: {
          getChildrenByKind: () => [
            {
              name: 'moduleName',
              isDeprecated: () => false,
              isProject: () => true,
              getFullName: () => 'moduleName'
            },
            {
              name: 'moduleName.subModuleName',
              isDeprecated: () => false,
              isProject: () => false,
              getFullName: () => 'subModuleName'
            }
          ]
        }
      }
    }
  })

  test('render', () => {
    const element = navigation(context, props)
    expect(element).toBeDefined()
  })
})
