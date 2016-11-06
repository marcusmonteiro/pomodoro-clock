export function toMMSS (seconds) {
  if (seconds == null) {
    throw Error('number of seconds must be defined')
  }
  if (!(typeof(seconds) === 'number')) {
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
