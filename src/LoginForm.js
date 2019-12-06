import React, {Component} from 'react'
import axios from 'axios'
import config from './config'

class LoginForm extends Component {
  state = {
    email: 'admin@mstage.io',
    password: 'admin',
    error: false,
    isLoading: false
  }

  _handleChange = e => {
    const {name, value} = e.target
    this.setState({[name]: value})
  }

  _checkLogin = e => {
    e.preventDefault()
    const {email, password} = this.state
    axios.post(`${config.API_URL}/v1/auth/signin`, {email, password})
      .then(res => {
        console.log(res.data.access_token)
        localStorage.setItem('token', res.data.access_token)
        this.props.onLogin()
      }).catch(err => {
      this.setState({error: true})
    })
  }

  render() {
    const {error, email, password} = this.state
    return (
      <div className='login'>
        <form className='login-form' autoComplete='new-password'>
          <input type='email' name='email' value={email} onChange={this._handleChange} placeholder='Email'/><br/>
          <input type='password' name='password' value={password} onChange={this._handleChange} placeholder='password'/><br/>
          <button onClick={this._checkLogin}>Login</button>

          {error && <div>Wrong username or password</div>}
        </form>
      </div>
    )
  }
}


export default LoginForm
