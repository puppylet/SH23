import React, {Component} from 'react'
import axios from 'axios'
import config from './config'
import {withRouter} from 'react-router-dom'

class Building extends Component {

  state = {
    floors: [],
    building: {}
  }

  componentDidMount() {
    const token = localStorage.getItem('token')
    const {match: {params: {id}}} = this.props
    axios(`${config.API_URL}/v1/buildings/${id}/floors`, {headers: {Authorization:`Bearer ${token}`}})
      .then(res => {
        console.log(res)
        this.setState({floors: res.data.data})
      })
      .catch(e => {
        console.log(e)
      })
  }


  render() {
    const {floors} = this.state
    return (
      <div>
        <h3>Floor for building</h3>

        {floors.map(floor => {

        })}



        {!floors.length && <div><hr/> There no floor to display</div>}


      </div>
    )
  }
}

export default withRouter(Building)
