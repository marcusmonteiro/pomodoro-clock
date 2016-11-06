import React, { Component } from 'react'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'
import { CircularProgress, RaisedButton } from 'material-ui'
import { Grid, Row, Col } from 'react-bootstrap'
import { toMMSS, secondsToMinutes } from './utils'
import { SECONDS_IN_A_MINUTE } from './constants'

const INITIAL_SESSION_LENGTH = 25 * SECONDS_IN_A_MINUTE
const INITIAL_BREAK_LENGTH = 3 * SECONDS_IN_A_MINUTE

const styles = {
  pomodoroClock: {
    width: '42em'
  },
  timer: {
    paddingTop: '1em',
    progress: {
      paddingTop: '1em',
      paddingBottom: '1em',
      left: '3em'
    },
    buttons: {
      paddingTop: '2em'
    }
  }
}
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
    // To not speed up clock when Start is clicked multiple times
    if (this.state.ticking) {
      return
    }
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
      <Row id='sessionLengthManipulation'>
        <Col sm={2} md={2} xs={2}>
          Session length
        </Col>
        <Col sm={1} md={1} xs={1}>
          <button id='buttonPlusSessionLength'
            onClick={this.handleSessionManipulationButtonClick.bind(this, '+')}>+</button>
        </Col>
        <Col sm={1} md={1} xs={1}>
          {secondsToMinutes(this.state.sessionLength)}
        </Col>
        <Col sm={1} md={1} xs={1}>
          <button id='buttonMinusSessionLength'
            onClick={this.handleSessionManipulationButtonClick.bind(this, '-')}>-</button>
        </Col>
      </Row>
    )

    const breakLengthManipulation = (
      <Row id='breakLengthManipulation'>
        <Col sm={2} md={2} xs={2}>
          Break length
        </Col>
        <Col sm={1} md={1} xs={1}>
          <button id='buttonPlusBreakLength'
            onClick={this.handleBreakManipulationButtonClick.bind(this, '+')}>+</button>
        </Col>
        <Col sm={1} md={1} xs={1}>
          {secondsToMinutes(this.state.breakLength)}
        </Col>
        <Col sm={1} md={1} xs={1}>
          <button id='buttonMinusBreakLength'
            onClick={this.handleBreakManipulationButtonClick.bind(this, '-')}>-</button>
        </Col>
      </Row>
    )

    const timer = () => (
      <div style={styles.timer}>
        <Row>
          <Col smOffset={2} mdOffset={2} xsOffset={2}>
            {toMMSS(this.state.secondsInTimer)}
          </Col>
        </Row>
        <Row>
          <Col smOffset={1}>
            <CircularProgress
              style={styles.timer.progress}
              mode='determinate'
              max={this.state.sessionLength}
              min={0}
              value={this.state.secondsInTimer}
              size={150}
              />
          </Col>
        </Row>
        <Row>
          <div style={styles.timer.buttons}>
            <Col sm={2} md={2} xs={2} smOffset={1} mdOffset={1} xsOffset={1 }>
              <RaisedButton onClick={this.handleStartButtonClick}>Start</RaisedButton>
            </Col>
            <Col>
              <RaisedButton onClick={this.reset}>Reset</RaisedButton>
            </Col>
          </div>
        </Row>
      </div>
    )

    return (
      <MuiThemeProvider>
        <div style={styles.pomodoroClock}>
          <Grid>
            {sessionLengthManipulation}
            {breakLengthManipulation}
            {timer()}
          </Grid>
        </div>
      </MuiThemeProvider>
    )
  }
}
