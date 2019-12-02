import React, {Component} from 'react'
import {xml2js} from 'xml-js'
import Home from './Home'
import {data} from './homeData'

class FileForm extends Component {

  state = {
    home: null
  }

  handleFileChange = e => {
    const file = e.target.files[0]
    let reader = new FileReader()
    reader.onloadend = e => {
      // console.log('file', file)
      // console.log('e', e.target.result)
      const text = e.target.result
      const xml = '<home' + text.split('<home')[1].split('</home>')[0] + '</home>'
      console.log(xml)
      const home = xml2js(xml, {compact: true})
      this.setState({home})
    }
    reader.readAsText(file)
  }


  componentDidMount () {
    const home = xml2js(data, {compact: true})
    this.setState({home})
  }


  render() {
    const {home} = this.state
    if (home) return <Home data={home} />
    return (
      <div>
        <input type='file' onChange={this.handleFileChange}/>
      </div>
    )
  }
}

export default FileForm
