import React, {Component} from 'react'
import axios from 'axios'
import config from './config'
import {Link} from 'react-router-dom'

class BuildingList extends Component {

  state = {
    buildings: []
  }

  componentDidMount() {
    const token = localStorage.getItem('token')
    axios(`${config.API_URL}/v1/buildings`, {headers: {Authorization:`Bearer ${token}`}})
      .then(res => {
        console.log(res)
        this.setState({buildings: res.data.data})
      })
      .catch(e => {
        console.log(e)
      })
  }

  render() {
    const {buildings} = this.state
    return (
      <div>
        <ul>
          {buildings.map(building => <li key={building.id}>
              <Link to={`/building/${building.id}`}>{building.name}</Link>
            </li>
          )}
        </ul>

      </div>
    )
  }
}

export default BuildingList
