import React, {Component} from 'react'
import axios from 'axios'
import config from './config'
import {withRouter, Link} from 'react-router-dom'
import jsZip from 'jszip'
import {xml2js} from 'xml-js'
import ThreeHome from './ThreeHome'
import {getOptions} from './lib'

class Building extends Component {

  state = {
    floors: [],
    building: {},
    blocks: [],
    home: null,
    isPreview: false,
    floorName: ''
  }

  componentDidMount() {
    this.getData()
  }

  getData = () => {
    const {match: {params: {id}}} = this.props
    axios(`${config.API_URL}/v1/buildings/${id}/floors`, getOptions())
      .then(res => {
        console.log(res)
        const floors = res.data.data
        this.setState({floors})
        // axios.post(`${config.API_URL}/v1/blocks/filter`, {filter: {'floor_id__in': floors.map(floor => floor.id)}}, getOptions())
        //   .then(res => {
        //     this.setState({blocks: res.data.data})
        //   })
      })
      .catch(e => {
        console.log(e)
      })
  }

  handleFileChange = e => {
    this.setState({home: null, isPreview: false})
    const file = e.target.files[0]
    const new_zip = new jsZip()
    new_zip.loadAsync(file).then(zip => {
      console.log(zip, zip)
      console.log('new zip', new_zip)
      if (zip.files && zip.files['Home.xml']) {
        zip.files['Home.xml'].async('string').then(xml => {
          const {home} = xml2js(xml, {compact: true})
          console.log('xml', home)
          if (!home.doorOrWindow) home.doorOrWindow = []
          if (home.doorOrWindow._attributes) home.doorOrWindow = [home.doorOrWindow]
          if (!home.wall) home.wall = []
          if (home.wall._attributes) home.wall = [home.wall]
          if (!home.room) home.room = []
          if (home.room._attributes) home.room = [home.room]
          if (!home.pieceOfFurniture) home.pieceOfFurniture = []
          if (home.pieceOfFurniture._attributes) home.pieceOfFurniture = [home.pieceOfFurniture]
          const walls = {}
          home.wall.map(wall => {
            walls[wall._attributes.id] = wall._attributes
          })
          const rooms = home.room.map(room => {
            return {...room._attributes, points: room.point}
          })

          const doors = home.doorOrWindow.map(door => door._attributes)

          const cameras = home.pieceOfFurniture.filter(piece => piece._attributes.name === 'camera').map(camera => camera._attributes)


          this.setState({home: {rooms, walls, doors, cameras}})
        })
      } else {
        alert('Unsupported file format')
      }
    }).catch(e => {
      alert('Unsupported file format')
    })
  }


  _handleSave = () => {
    const {match: {params: {id}}} = this.props
    const {floorName} = this.state
    axios.post(`${config.API_URL}/v1/buildings/${id}/floors`, {record: {name: floorName}}, getOptions())
      .then(res => {
        console.log(res)
        const {data} = res
        const floor_id = data.data.id
        const {home} = this.state

        console.log('floor_id', floor_id)
        console.log('res.data', res.data)

        const walls = Object.keys(home.walls).map(key => {
          const wall = home.walls[key]
          const record = {floor_id}
          record.block_type = 'WALL'
          record.points = [
            {
              coordinates: [wall.xStart, wall.yStart],
              point_type: 'L'
            },
            {
              coordinates: [wall.xEnd, wall.yEnd],
              point_type: 'L'
            }
          ]
          record.metadata = wall
          return record
        })

        axios.post(`${config.API_URL}/v1/blocks`, {record: {blocks: walls}}, getOptions())
          .then(res => {
            const doors = home.doors.map(door => {
              const record = {floor_id}
              record.block_type = 'DOOR'
              record.points = [{
                coordinates: [door.x, door.y],
                point_type: 'L'
              }]
              record.metadata = door
              return record
            })
            axios.post(`${config.API_URL}/v1/blocks`, {record: {blocks: doors}}, getOptions())
              .then(res => {
                this.getData()
              })
              .catch(e => console.log(e))
          })
      })
  }

  _handleChange = e => {
    const {name, value} = e.target
    this.setState({[name]: value})
  }

  _handleFloorClick = (floor, e) => {
    e.preventDefault()
    this.setState({selectedFloor: floor})
  }

  _handleFloorRemove = (floor, e) => {
    e.preventDefault()
    const {match: {params: {id}}} = this.props
    axios.delete(`${config.API_URL}/v1/floors/${floor}`, getOptions())
      .then(res => {
        this.getData()
      })
      .catch(e => console.log(e))
  }

  viewFloor = () => {

  }

  render() {
    const {floors, home, isPreview, floorName, selectedFloor} = this.state
    return (
      <div style={{padding: 10}}>
        <h3>Floor for building</h3>
        <table>
          <thead>
          <tr>
            <th>Floor name</th>
            <th>Actions</th>
          </tr>
          </thead>
          <tbody>
          {floors.length && floors.map(floor => <tr key={floor.id}>
              <td><Link to={`/floor/${floor.id}`}>{floor.name}</Link></td>
              <td><a onClick={e => this._handleFloorRemove(floor.id, e)} href="/">remove</a></td>
            </tr>
          )}
          </tbody>
        </table>

        {!floors.length && <div>
          <hr/>
          There no floor to display</div>}

        {selectedFloor && this.viewFloor()}


        <h3>Add a floor</h3>
        <p><input name='floorName' placeholder='Floor name' value={floorName} onChange={this._handleChange}/></p>
        <p><input type='file' placeholder='import file' onChange={this.handleFileChange}/></p>
        <p>
          <button disabled={!home} onClick={e => this.setState({isPreview: true})}>Preview</button>
          <button  disabled={!home || !floorName} onClick={this._handleSave}>Save</button>
        </p>

        {home && isPreview && <ThreeHome data={home}/>}

      </div>
    )
  }
}

export default withRouter(Building)
