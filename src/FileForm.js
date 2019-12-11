import React, {Component} from 'react'
import {xml2js} from 'xml-js'
import Home from './Home'
import {data} from './homeData'
// import data from './arlingtonData'

class FileForm extends Component {

  state = {
    home: null, homeKey: Math.random()
  }

  handleFileChange = e => {
    this.setState({home: null, homeKey: Math.random()})
    const file = e.target.files[0]
    if (!file) return
    let reader = new FileReader()
    reader.onloadend = e => {
      // console.log('file', file)
      // console.log('e', e.target.result)
      const text = e.target.result
      const xml = '<home' + text.split('<home')[1].split('</home>')[0] + '</home>'.replace(/[^\x00-\x7F]+/, '')
      console.log(xml)
      const home = xml2js(xml, {compact: true})
      console.log('home', home)
      this.setState({home, homeKey: Math.random()})
    }
    reader.readAsText(file)
  }


  componentDidMount () {
    const home = xml2js(data, {compact: true})
    this.setState({home})
  }


  render() {
    const {home} = this.state
    return (
      <div>
        <input className='file-input' type='file' onChange={this.handleFileChange}/>
        {home && <Home data={home} />}
      </div>
    )
  }
}

export default FileForm
