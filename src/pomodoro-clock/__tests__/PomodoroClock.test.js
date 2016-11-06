/* eslint-env jest */

// import React from 'react'
// import { shallow } from 'enzyme'
import { toMMSS } from '..'

describe('toMMSS', () => {
  it('convert a number of seconds to a MM:SS string', () => {
    expect(toMMSS(0)).toBe('0:00')
    expect(toMMSS(1)).toBe('0:01')
    expect(toMMSS(60)).toBe('1:00')
    expect(toMMSS(61)).toBe('1:01')
    expect(toMMSS(120)).toBe('2:00')
    expect(toMMSS(121)).toBe('2:01')
    expect(toMMSS(600)).toBe('10:00')
    expect(toMMSS(6000)).toBe('100:00')
    expect(() => {
      toMMSS()
    }).toThrow()
    function foo () {
      return
    }
    const invalidArguments = [-1, '', ' ', '1', {}, foo, {foo: 1}, [], [0], null, undefined]
    invalidArguments.forEach((arg) => {
      expect(() => {
        toMMSS(arg)
      }).toThrow()
    })
  })
})
