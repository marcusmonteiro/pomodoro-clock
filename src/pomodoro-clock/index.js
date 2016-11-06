import React, { Component } from 'react'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'
import { CircularProgress, RaisedButton, FontIcon } from 'material-ui'
import { Grid, Row, Col } from 'react-bootstrap'
import { toMMSS, secondsToMinutes } from './utils'
import { SECONDS_IN_A_MINUTE } from './constants'

const INITIAL_SESSION_LENGTH = 25 * SECONDS_IN_A_MINUTE
const INITIAL_BREAK_LENGTH = 3 * SECONDS_IN_A_MINUTE

const styles = {
  pomodoroClock: {
    width: 730
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
    this.set = this.set.bind(this)
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

  set () {
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

    function timer (phase, that) {
      let iconBesideTimer
      let progressColor
      let max

      switch (phase) {
        case 'session':
          iconBesideTimer = <FontIcon className='fa fa-book' />
          max = that.state.sessionLength
          break
        case 'break':
          iconBesideTimer = <FontIcon className='fa fa-soccer-ball-o' />
          progressColor = '#4CAF50'
          max = that.state.breakLength
          break
        default:
          throw Error('invalid phase: ' + phase)
      }

      return (
        <div style={styles.timer}>
          <Row>
            <Col smOffset={2} mdOffset={2} xsOffset={2}>
              {iconBesideTimer}
              <span />
              {toMMSS(that.state.secondsInTimer)}
            </Col>
          </Row>
          <Row>
            <Col smOffset={1}>
              <CircularProgress
                style={styles.timer.progress}
                mode='determinate'
                max={max}
                min={0}
                value={that.state.secondsInTimer}
                size={150}
                color={progressColor}
                />
            </Col>
          </Row>
          <Row>
            <div style={styles.timer.buttons}>
              <Col sm={2} md={2} xs={2} smOffset={1} mdOffset={1} xsOffset={1}>
                <RaisedButton
                  onClick={that.handleStartButtonClick}
                  label='Start'
                  primary
                  icon={<FontIcon className='fa fa-play' />}
                  />
              </Col>
              <Col>
                <RaisedButton
                  onClick={that.set}
                  label='Set'
                  secondary
                  icon={<FontIcon className='fa fa-stop' />}
                  />
              </Col>
            </div>
          </Row>
        </div>
      )
    }

    return (
      <MuiThemeProvider>
        <div style={styles.pomodoroClock}>
          <Grid>
            {sessionLengthManipulation}
            {breakLengthManipulation}
            {timer(this.state.currentPhase, this)}
          </Grid>
        </div>
      </MuiThemeProvider>
    )
  }
}
