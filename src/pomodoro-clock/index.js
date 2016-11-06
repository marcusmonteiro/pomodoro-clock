import React, { Component } from 'react'

export function toMMSS (seconds) {
  if (seconds == null) {
    throw Error('number of seconds must be defined')
  }
  if (!(typeof (seconds) === 'number')) {
    throw Error('number of seconds must be a number')
  }
  if (seconds < 0) {
    throw Error('number of seconds must be greater than zero')
  }
  const _minutes = Math.floor(seconds / 60)
  let _seconds = seconds - (_minutes * 60)

  if (_seconds < 10) {
    _seconds = '0' + _seconds
  }
  return _minutes + ':' + _seconds
}

const INITIAL_NUMBER_SECONDS = 1500
export default class PomodoroClock extends Component {
  constructor (props) {
    super(props)
    this.state = {
      secondsInTimer: INITIAL_NUMBER_SECONDS,
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
        return
      }
      this.setState({
        secondsInTimer: this.state.secondsInTimer - 1
      })
      this.tick()
    }, 1000)
  }

  reset () {
    this.setState({
      secondsInTimer: INITIAL_NUMBER_SECONDS,
      ticking: false
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
