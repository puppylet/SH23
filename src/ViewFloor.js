import React, {Component} from 'react'
import {withRouter} from 'react-router-dom'
import axios from 'axios'
import config from './config'
import {getOptions} from './lib'
import Home from './Home'

class ViewFloor extends Component {

  state = {
    blocks: null
  }

  componentDidMount() {
    this.getData()
  }

  getData = () => {
    const {match: {params: {id}}} = this.props
    axios.post(`${config.API_URL}/v1/blocks/filter`, {filter: {'floor_id__in': [id]}}, getOptions())
      .then(res => {
        this.setState({blocks: res.data.data})
      })
      .catch(e => {
        console.log(e)
      })
  }

  renderFloor = () => {
    const {blocks} = this.state
    const doors = blocks.filter(block => block.block_type === 'DOOR').map(floor => {
      return {_attributes: floor.metadata}
    })
    const walls = blocks.filter(block => block.block_type === 'WALL').map(floor => {
      return {_attributes: floor.metadata}
    })

    const data = {
      home: {
        doorOrWindow: doors,
        wall: walls
      }
    }

    console.log('data', data)
    return <Home data={data}/>
  }


  render() {
    const {blocks} = this.state
    return <div>{blocks && this.renderFloor()}</div>
  }
}

export default withRouter(ViewFloor)
