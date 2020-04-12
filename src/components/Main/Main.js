import React from 'react'
import { Route, Switch } from 'react-router-dom'
import Home from '../Home/Home'
import Topic from '../Topic/Topic'
import User from '../User/User'
import Messages from '../Messages/Messages'
import CreateTopic from '../CreateTopic/CreateTopic'
import './main.scss'
const Main = (props) => <Switch>
  <Route exact path='/' component={Home} />
  <Route path='/topic/create' component={CreateTopic} />
  <Route path='/topic/:topicid' component={Topic} />
  <Route path='/user/:username' component={User} />
  <Route path='/my/:Messages' component={Messages} />

</Switch>
export default Main