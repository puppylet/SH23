import React, {Component} from 'react'
import {Switch, Route} from "react-router-dom";
import FileForm from './FileForm'
import BuildingList from './BuildingList'
import Building from './Building'
class Routes extends Component {
  render() {
    return <Switch>
      <Route path="/load-model">
        <FileForm />
      </Route>
      <Route path="/building-list">
        <BuildingList />
      </Route>
      <Route path="/building/:id">
        <Building />
      </Route>
    </Switch>
  }
}

export default Routes
