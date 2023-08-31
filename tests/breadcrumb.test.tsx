//@ts-nocheck

import { breadcrumbs } from '../src/breadcrumb'

describe('src/breadcrumb', () => {
  let props
  let context
  beforeEach(() => {
    props = {
      name: 'moduleName',
      project: {
        getChildrenByKind: () => [
          { name: 'moduleName' },
          { name: 'moduleName.subModuleName' }
        ]
      }
    }

    context = { urlTo: () => 'url' }
  })

  test('render', () => {
    const element = breadcrumbs(props, context)
    expect(element).toBeDefined()
  })

  test('no name', () => {
    props.name = undefined
    const element = breadcrumbs(props, context)
    expect(element).toBeUndefined()
  })

  test('no breads', () => {
    props.project.getChildrenByKind = () => []
    const element = breadcrumbs(props, context)
    expect(element).toBeUndefined()
  })

  test('different name', () => {
    props.name = 'name'
    const element = breadcrumbs(props, context)
    expect(element).toBeUndefined()
  })

  test('no href', () => {
    context.urlTo = () => undefined
    const element = breadcrumbs(props, context)
    expect(element).toBeDefined()
  })
})
