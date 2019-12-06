import React, {Component} from 'react'
import axios from 'axios'
import config from './config'
import {Link} from 'react-router-dom'
import {getOptions} from './lib'

class BuildingList extends Component {

  state = {
    buildings: [],
    buildingName: ''
  }

  _handleChange = e => {
    const {name, value} = e.target
    this.setState({[name]: value})
  }

  componentDidMount() {
    this.getData()
  }

  getData = () => {
    axios(`${config.API_URL}/v1/buildings`, getOptions())
      .then(res => {
        console.log(res)
        this.setState({buildings: res.data.data})
      })
      .catch(e => {
        console.log(e)
      })
  }

  _handleClick = e => {
    const token = localStorage.getItem('token')
    const {buildingName} = this.state
    axios.post(`${config.API_URL}/v1/buildings`, {record: {name: buildingName}}, getOptions())
      .then(res => {
        this.getData()
        this.setState({buildingName: ''})
      })
      .catch(e => console.log(e))
  }



  _handleRemove = (id, e) => {
    e.preventDefault()
    axios.delete(`${config.API_URL}/v1/buildings/${id}`, getOptions())
      .then(res => {
        this.getData()
      }).catch(err => console.log(e))
  }


  render() {
    const {buildings, buildingName} = this.state
    return (
      <div>
        <ul>
          {buildings.map(building => <li key={building.id}>
              <Link to={`/building/${building.id}`}>{building.name}</Link> &nbsp;
              <a onClick={e => this._handleRemove(building.id, e)} href="/hahah">Remove</a>
            </li>
          )}
        </ul>

        <p><input type="text" value={buildingName} placeholder='Add a building' name='buildingName'
                  onChange={this._handleChange}/></p>
        <p>
          <button onClick={this._handleClick}>Save</button>
        </p>
      </div>
    )
  }
}

export default BuildingList
