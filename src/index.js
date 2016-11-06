import React from 'react'
import ReactDOM from 'react-dom'
import injectTapEventPlugin from 'react-tap-event-plugin'
import App from './App'

import 'sanitize.css/sanitize.css'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap/dist/css/bootstrap-theme.css'
import 'font-awesome/css/font-awesome.css'
import './index.css'

injectTapEventPlugin()

ReactDOM.render(
  <App />,
  document.getElementById('root')
)
