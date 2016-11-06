import React, { Component } from 'react'

export function toMMSS (seconds) {
  if (seconds == null) {
    throw Error('number of seconds must be defined')
  }
  if (!(typeof (seconds) === 'number')) {
    throw Error('number of seconds must be a number')
  }
  if (seconds < 0) {
    throw Error('number of seconds must be greater than zero: ' + seconds)
  }
  const _minutes = Math.floor(seconds / 60)
  let _seconds = seconds - (_minutes * 60)

  if (_seconds < 10) {
    _seconds = '0' + _seconds
  }
  return _minutes + ':' + _seconds
}

const INITIAL_SESSION_LENGTH = 25 * 60
const INITIAL_BREAK_LENGTH = 3 * 60
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

  render () {
    return (
      <div>
        {toMMSS(this.state.secondsInTimer)}
        <button onClick={this.handleStartButtonClick}>Start</button>
        <button onClick={this.reset}>Reset</button>
      </div>
    )
  }
}
