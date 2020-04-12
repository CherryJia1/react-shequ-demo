import React, { Component } from 'react'
import axios from 'axios'
import { Skeleton } from 'antd';
import { Link } from 'react-router-dom'
import Box from '../Box/Box'
import './messages.scss'
class Messages extends Component {
  state = {
    messageInfo: null
  }
  componentDidMount() {
    const token = localStorage.getItem('token')
    axios.get(`https://www.vue-js.com/api/v1/messages?accesstoken=${token}`).then(res => {
      this.setState({
        messageInfo: res.data.data
      })
      if (res.data.data.hasnot_read_messages.length > 0) {
        axios.post(`https://www.vue-js.com/api/v1/message/mark_all`, { accesstoken: token }).then(res => {
        })
      }
    })



  }
  render() {
    const { messageInfo } = this.state
    return (<Box title='新消息' linkText='主页' linkAddress='/' >
      {messageInfo ? <div className='message'>
        <div></div>
        <div>
          <h4>过往消息</h4>
          <ul>
            {messageInfo.has_read_messages.map(item => <li key={item.id}><Link to={`user/${item.author.loginname}`}>{item.author.loginname}</Link>在话题<Link to={`/topic/${item.topic.id}#${item.reply.id}`}>{item.topic.title}</Link>中 {item.type === 'at' ? '@' : '回复'}了你</li>)}
          </ul>
        </div>
      </div> : <Skeleton />}
    </Box>)
  }
}
export default Messages