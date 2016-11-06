/* eslint-env jest */

import React from 'react'
import chai from 'chai'
import chaiEnzyme from 'chai-enzyme'
import { shallow, mount } from 'enzyme'
import PomodoroClock, { toMMSS } from '..'

chai.use(chaiEnzyme())

jest.useFakeTimers()

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

describe('<PomodoroClock />', () => {
  it('should initially display 25 minutes as a MM:SS formatted string', () => {
    const wrapper = shallow(<PomodoroClock />)
    chai.expect(wrapper).to.contain.text('25:00')
  })

  it(`should start a timer when the 'start' button is clicked and reset the timer
      when the 'reset' button is clicked`, () => {
    const wrapper = mount(<PomodoroClock />)
    chai.expect(wrapper).to.contain.text('25:00')

    const startButton = wrapper.find('button').first()
    startButton.simulate('click')
    jest.runTimersToTime(1000)
    chai.expect(wrapper).to.contain.text('24:59')
    jest.runTimersToTime(1000)
    chai.expect(wrapper).to.contain.text('24:58')

    const resetButton = wrapper.find('button').last()
    resetButton.simulate('click')
    chai.expect(wrapper).to.contain.text('25:00')
    jest.runTimersToTime(1000)
    chai.expect(wrapper).to.contain.text('25:00')

    startButton.simulate('click')
    jest.runAllTimers()
    chai.expect(wrapper).to.contain.text('0:00')
    jest.runTimersToTime(1000)
    chai.expect(wrapper).to.contain.text('0:00')
  })
})
