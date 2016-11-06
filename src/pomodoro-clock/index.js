import React, { Component } from 'react'

const SECONDS_IN_A_MINUTE = 60

function throwErrorIfNotPositiveNumber (arg, argName) {
  if (arg == null) {
    throw Error('number of ' + argName + ' must be defined')
  }
  if (!(typeof (arg) === 'number')) {
    throw Error('number of ' + argName + ' must be a number')
  }
  if (arg < 0) {
    throw Error('number of ' + argName + ' must be greater than zero: ' + arg)
  }
}

export function toMMSS (seconds) {
  throwErrorIfNotPositiveNumber(seconds, 'seconds')
  const _minutes = secondsToMinutes(seconds)
  let _seconds = seconds - (_minutes * SECONDS_IN_A_MINUTE)

  if (_seconds < 10) {
    _seconds = '0' + _seconds
  }
  return _minutes + ':' + _seconds
}

export function secondsToMinutes (seconds) {
  throwErrorIfNotPositiveNumber(seconds, 'seconds')
  return Math.floor(seconds / SECONDS_IN_A_MINUTE)
}

const INITIAL_SESSION_LENGTH = 25 * SECONDS_IN_A_MINUTE
const INITIAL_BREAK_LENGTH = 3 * SECONDS_IN_A_MINUTE

export default class PomodoroClock extends Component {
  constructor (props) {
    super(props)
    this.state = {
      secondsInTimer: INITIAL_SESSION_LENGTH,
      sessionLength: INITIAL_SESSION_LENGTH,
      breakLength: INITIAL_BREAK_LENGTH,
      currentPhase: 'session',
      ticking: false
    }
    this.handleStartButtonClick = this.handleStartButtonClick.bind(this)
    this.reset = this.reset.bind(this)
  }

  handleStartButtonClick (e) {
    this.setState({
      ticking: true
    })
    this.tick()
  }

  tick () {
    setTimeout(() => {
      if (!this.state.ticking) {
        return
      }
      if (this.state.secondsInTimer <= 0) {
        this.phaseSwitch()
      }
      this.setState({
        secondsInTimer: this.state.secondsInTimer - 1
      })
      this.tick()
    }, 1000)
  }

  phaseSwitch () {
    switch (this.state.currentPhase) {
      case 'session':
        this.setState({
          currentPhase: 'break',
          secondsInTimer: this.state.breakLength
        })
        break
      case 'break':
        this.setState({
          currentPhase: 'session',
          secondsInTimer: this.state.sessionLength
        })
        break
      default:
        throw Error('Unexpected phase: ' + this.state.currentPhase)
    }
  }

  reset () {
    this.setState({
      secondsInTimer: this.state.sessionLength,
      ticking: false,
      currentPhase: 'session'
    })
  }

  handleSessionManipulationButtonClick (e) {
    switch (e) {
      case '+':
        this.setState({
          sessionLength: this.state.sessionLength + SECONDS_IN_A_MINUTE
        })
        break
      case '-':
        if (this.state.sessionLength > SECONDS_IN_A_MINUTE) {
          this.setState({
            sessionLength: this.state.sessionLength - SECONDS_IN_A_MINUTE
          })
        }
        break
      default:
        throw Error('Unexpected value: ' + e)
    }
  }

  handleBreakManipulationButtonClick (e) {
    switch (e) {
      case '+':
        this.setState({
          breakLength: this.state.breakLength + SECONDS_IN_A_MINUTE
        })
        break
      case '-':
        if (this.state.breakLength > SECONDS_IN_A_MINUTE) {
          this.setState({
            breakLength: this.state.breakLength - SECONDS_IN_A_MINUTE
          })
        }
        break
      default:
        throw Error('Unexpected value: ' + e)
    }
  }

  render () {
    const sessionLengthManipulation = (
      <div id='sessionLengthManipulation'>
        Session length:
        {secondsToMinutes(this.state.sessionLength)}
        <button id='buttonPlusSessionLength'
          onClick={this.handleSessionManipulationButtonClick.bind(this, '+')}>+</button>
        <button id='buttonMinusSessionLength'
          onClick={this.handleSessionManipulationButtonClick.bind(this, '-')}>-</button>
      </div>
    )

    const breakLengthManipulation = (
      <div id='breakLengthManipulation'>
        Break length:
        {secondsToMinutes(this.state.breakLength)}
        <button id='buttonPlusBreakLength'
          onClick={this.handleBreakManipulationButtonClick.bind(this, '+')}>+</button>
        <button id='buttonMinusBreakLength'
          onClick={this.handleBreakManipulationButtonClick.bind(this, '-')}>-</button>
      </div>
    )

    return (
      <div>
        {sessionLengthManipulation}
        {breakLengthManipulation}
        {toMMSS(this.state.secondsInTimer)}
        <button onClick={this.handleStartButtonClick}>Start</button>
        <button onClick={this.reset}>Reset</button>
      </div>
    )
  }
}
