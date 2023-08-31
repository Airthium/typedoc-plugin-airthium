//@ts-nocheck

import { ProjectReflection } from 'typedoc'
import { classNames, getDisplayName, wbr } from '../src/lib'

describe('src/lib', () => {
  test('getDisplayName', () => {
    let displayName = getDisplayName({ name: 'displayName' })
    expect(displayName).toBe('displayName')

    const refl = new ProjectReflection('displayName')
    refl.packageVersion = '1.0.0'
    displayName = getDisplayName(refl)
    expect(displayName).toBe('displayName - v1.0.0')
  })

  test('wbr', () => {
    let res = wbr('test')
    expect(res).toEqual(['test'])

    res = wbr('test1_test2')
    expect(res).toEqual(['test1_', <wbr />, 'test2'])
  })

  test('className', () => {
    let name = classNames({ name1: 'name1' })
    expect(name).toBe('name1')

    name = classNames({ name1: 'name1' }, 'extra')
    expect(name).toBe('name1 extra')

    name = classNames({})
    expect(name).toBeUndefined()
  })
})
