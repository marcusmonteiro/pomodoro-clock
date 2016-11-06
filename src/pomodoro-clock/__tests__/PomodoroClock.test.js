/* eslint-env jest */

import React from 'react'
import chai from 'chai'
import chaiEnzyme from 'chai-enzyme'
import { shallow, mount } from 'enzyme'
import PomodoroClock, { toMMSS, secondsToMinutes } from '..'

chai.use(chaiEnzyme())

jest.useFakeTimers()

describe('secondsToMinutes', () => {
  it('converts a number of seconds to a number of minutes', () => {
    expect(secondsToMinutes(0)).toBe(0)
    expect(secondsToMinutes(1)).toBe(0)
    expect(secondsToMinutes(60)).toBe(1)
    expect(secondsToMinutes(61)).toBe(1)
    expect(secondsToMinutes(120)).toBe(2)
    expect(() => {
      secondsToMinutes()
    }).toThrow()
    function foo () {
      return
    }
    const invalidArguments = [-1, '', ' ', '1', {}, foo, {foo: 1}, [], [0], null, undefined]
    invalidArguments.forEach((arg) => {
      expect(() => {
        secondsToMinutes(arg)
      }).toThrow()
    })
  })
})

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

let wrapper
let sessionLength
let breakLength
let startButton
let resetButton
beforeEach(() => {
  wrapper = mount(<PomodoroClock />)
  sessionLength = wrapper.state().sessionLength
  breakLength = wrapper.state().breakLength
  startButton = wrapper.findWhere((node) => {
    return node.text() === 'Start'
  })
  resetButton = wrapper.findWhere((node) => {
    return node.text() === 'Reset'
  })
})

describe('<PomodoroClock />', () => {
  it('should initially display 25 minutes as a MM:SS formatted string', () => {
    wrapper = shallow(<PomodoroClock />)
    chai.expect(wrapper).to.contain.text('25:00')
  })

  it(`should alternate between 'session' and 'break' phases`, () => {
    chai.expect(wrapper).to.contain.text(toMMSS(sessionLength))

    startButton.simulate('click')

    jest.runTimersToTime(1000 * sessionLength)
    chai.expect(wrapper).to.contain.text(toMMSS(0))
    jest.runTimersToTime(1000)
    chai.expect(wrapper).to.contain.text(toMMSS(breakLength - 1))

    jest.runTimersToTime(1000 * breakLength)
    chai.expect(wrapper).to.contain.text(toMMSS(sessionLength - 1))
  })

  it(`should start a timer when the 'start' button is clicked and reset the timer
      when the 'reset' button is clicked`, () => {
    chai.expect(wrapper).to.contain.text(toMMSS(sessionLength))

    startButton.simulate('click')
    jest.runTimersToTime(1000)
    chai.expect(wrapper).to.contain.text(toMMSS(sessionLength - 1))
    jest.runTimersToTime(1000)
    chai.expect(wrapper).to.contain.text(toMMSS(sessionLength - 2))

    resetButton.simulate('click')
    chai.expect(wrapper).to.contain.text(toMMSS(sessionLength))
    jest.runTimersToTime(1000)
    chai.expect(wrapper).to.contain.text(toMMSS(sessionLength))

    startButton.simulate('click')
    jest.runTimersToTime(1000)
    chai.expect(wrapper).to.contain.text(toMMSS(sessionLength - 1))
    jest.runTimersToTime(1000)
    chai.expect(wrapper).to.contain.text(toMMSS(sessionLength - 2))
    jest.runTimersToTime(1000 * (sessionLength - 2))
    chai.expect(wrapper).to.contain.text(toMMSS(0))
    jest.runTimersToTime(1000)
    chai.expect(wrapper).to.contain.text(toMMSS(breakLength - 1))
  })

  it('should allow the user to manipulate the session length', () => {
    const sessionLengthManipulation = wrapper.find('#sessionLengthManipulation')
    const initialSessionLength = wrapper.state().sessionLength

    chai.expect(sessionLengthManipulation).to.contain.text('Session length')

    const sessionLengthMinutes = secondsToMinutes(sessionLength)
    chai.expect(sessionLengthManipulation).to.contain.text(sessionLengthMinutes)
    const buttonPlusSessionLength = sessionLengthManipulation.find('#buttonPlusSessionLength')
    buttonPlusSessionLength.simulate('click')
    expect(wrapper.state().sessionLength).toBe(initialSessionLength + 60)
    chai.expect(sessionLengthManipulation).to.contain.text(sessionLengthMinutes + 1)

    const buttonMinusSessionLength = sessionLengthManipulation.find('#buttonMinusSessionLength')
    buttonMinusSessionLength.simulate('click')
    expect(wrapper.state().sessionLength).toBe(initialSessionLength)
    chai.expect(sessionLengthManipulation).to.contain.text(sessionLengthMinutes)

    // Can't set zero session length
    wrapper.setState({ sessionLength: 60 })
    buttonMinusSessionLength.simulate('click')
    expect(wrapper.state().sessionLength).toBe(60)
    chai.expect(sessionLengthManipulation).to.contain.text(1)
  })

  it('should allow the user to manipulate the break length', () => {
    const breakLengthManipulation = wrapper.find('#breakLengthManipulation')
    const initialBreakLength = wrapper.state().breakLength

    chai.expect(breakLengthManipulation).to.contain.text('Break length')

    const breakLengthMinutes = secondsToMinutes(breakLength)
    chai.expect(breakLengthManipulation).to.contain.text(breakLengthMinutes)
    const buttonPlusBreakLength = breakLengthManipulation.find('#buttonPlusBreakLength')
    buttonPlusBreakLength.simulate('click')
    expect(wrapper.state().breakLength).toBe(initialBreakLength + 60)
    chai.expect(breakLengthManipulation).to.contain.text(breakLengthMinutes + 1)

    const buttonMinusBreakLength = breakLengthManipulation.find('#buttonMinusBreakLength')
    buttonMinusBreakLength.simulate('click')
    expect(wrapper.state().breakLength).toBe(initialBreakLength)
    chai.expect(breakLengthManipulation).to.contain.text(breakLengthMinutes)

    // Can't set zero break length
    wrapper.setState({ breakLength: 60 })
    buttonMinusBreakLength.simulate('click')
    expect(wrapper.state().breakLength).toBe(60)
    chai.expect(breakLengthManipulation).to.contain.text(1)
  })
})
