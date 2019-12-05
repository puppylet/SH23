import React from 'react';
import './App.css';
import LoginForm from './LoginForm'
import {BrowserRouter, Link} from "react-router-dom";
import Routes from './Routes'

class App extends React.Component {

  state = {
    isLogin: false
  }

  componentDidMount() {
    const token = localStorage.getItem('token')
    console.log(token)
    if(token) this.setState({isLogin: true})
  }


  onLogin = () => {
    this.setState({isLogin: true})
  }

  onLogout = e => {
    localStorage.removeItem('token')
    this.setState({isLogin: false})
  }

  render() {
    const {isLogin} = this.state
    return <div className="App">
      {!isLogin && <LoginForm onLogin={this.onLogin} />}
      {isLogin && <BrowserRouter>
        <div>
          <nav>
            <ul>
              <li>
                <Link to="/building-list">Building list</Link>
              </li>
              <li>
                <Link to="/" onClick={this.onLogout}>Log Out</Link>
              </li>
            </ul>
          </nav>
        </div>
        <Routes />
      </BrowserRouter>}
    </div>
  }

}

export default App;
