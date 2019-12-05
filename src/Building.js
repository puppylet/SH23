import React, {Component} from 'react'
import axios from 'axios'
import config from './config'
import {withRouter} from 'react-router-dom'
import jsZip from 'jszip'
import {xml2js} from 'xml-js'
import Home from './Home'

class Building extends Component {

  state = {
    floors: [],
    building: {},
    home: null,
    isPreview: false
  }

  componentDidMount () {
    const token = localStorage.getItem('token')
    const {match: {params: {id}}} = this.props
    axios(`${config.API_URL}/v1/buildings/${id}/floors`, {headers: {Authorization: `Bearer ${token}`}})
    .then(res => {
      console.log(res)
      this.setState({floors: res.data.data})
    })
    .catch(e => {
      console.log(e)
    })
  }

  handleFileChange = e => {
    this.setState({home: null, isPreview: false})
    const file = e.target.files[0]
    const new_zip = new jsZip();
    new_zip.loadAsync(file).then(zip => {
      console.log(zip, zip)
      console.log('new zip', new_zip)
      if (zip.files && zip.files['Home.xml']) {
        zip.files['Home.xml'].async("string").then( xml => {
          const home = xml2js(xml, {compact: true})
          console.log('xml', home)
          this.setState({home})
        })
      } else {
        alert('Unsupported file format')
      }
    }).catch(e => {
      alert('Unsupported file format')
    })
  }


  render () {
    const {floors, home, isPreview} = this.state
    return (
      <div style={{padding: 10}}>
        <h3>Floor for building</h3>

        {floors.map(floor => {
          return false
        })}


        {!floors.length && <div>
          <hr />
          There no floor to display</div>}


        <h3>Add a floor</h3>
        <p><input name='floor_name' placeholder='Floor name'/></p>
        <p><input type='file' placeholder='import file' onChange={this.handleFileChange}/></p>
        <p><button disabled={!home} onClick={e => this.setState({isPreview: true})}>Preview</button> <button>Save</button></p>

        {home && isPreview && <Home data={home}/>}

      </div>
    )
  }
}

export default withRouter(Building)
