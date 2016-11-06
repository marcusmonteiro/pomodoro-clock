import { SECONDS_IN_A_MINUTE } from './constants'

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
