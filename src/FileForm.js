import React, {Component} from 'react'
import {xml2js} from 'xml-js'
import Home from './Home'
import {data} from './homeData'
import jsZip from 'jszip'

// import data from './arlingtonData'

class FileForm extends Component {

  state = {
    home: null, homeKey: Math.random()
  }

  handleFileChange = e => {
    this.setState({home: null, homeKey: Math.random()})
    const file = e.target.files[0]
    if (!file) return

    const new_zip = new jsZip()
    new_zip.loadAsync(file)
      .then(zip => {
        if (zip.files && zip.files['Home.xml']) {
          zip.files['Home.xml'].async('string').then(xml => {
            const home = xml2js(xml, {compact: true})
            console.log('home', home)
            this.setState({home, homeKey: Math.random()})
          })
        } else {
          alert('Unsupported file type.')
        }

      })
      .catch(e => alert(e))
  }


  componentDidMount() {
    const home = xml2js(data, {compact: true})
    this.setState({home})
  }


  render() {
    const {home} = this.state
    return (
      <div>
        <input className='file-input' type='file' onChange={this.handleFileChange}/>
        {home && <Home data={home}/>}
      </div>
    )
  }
}

export default FileForm
