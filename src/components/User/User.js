import React, { Component } from 'react'
import axios from 'axios'
import { Skeleton } from 'antd';
import { GithubOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom'
import './user.scss'
import Box from '../Box/Box';
class User extends Component {
  state = {
    userInfo: ''
  }
  componentDidMount() {
    const username = this.props.match.params.username
    this.getInfo(username)
  }
  componentDidUpdate(prevProps) {
    if (this.props.location.pathname !== prevProps.location.pathname) {
      const username = this.props.match.params.username
      this.getInfo(username)
    }
  }
  getInfo = username => {
    axios.get(`https://www.vue-js.com/api/v1/user/${username}`).then(res => {
      // console.log(res.data.data)
      this.setState({
        userInfo: res.data.data
      })
    })
  }
  render() {
    const { userInfo } = this.state
    return <Box linkText='主页' linkAddress='/' >
      <div className='user'>
        {
          userInfo ?
            <div>
              <div className='zhuye' style={{ display: 'flex', flexDirection: 'column' }}>
                <img style={{ width: '40px', float: 'left' }} src={userInfo.avatar_url} alt="" />
                <span style={{ display: 'block', float: 'left' }} >{userInfo.loginname}</span>
                <span style={{ color: '#333', fontSize: '14px', marginTop: '10px' }}>积分{userInfo.score}</span>
                {userInfo.githubUsername ? <span style={{ color: '#778087', fontSize: '14px', marginTop: '10px' }}><GithubOutlined /> {userInfo.githubUsername}</span> : ''}
                {userInfo.collect_topics.length ? <span>{userInfo.collect_topics.length} 话题收藏</span> : ''}
                <span style={{ color: '#ababab', fontSize: '14px', marginTop: '10px' }}>创建于{userInfo.create_at}</span>
              </div>
              <div className='chuang'>
                <h4 >最近创建的话题</h4>
                {userInfo.recent_topics.length ? <ul>
                  {
                    userInfo.recent_topics.map(item => <li key={item.id}> <Link to={`/user/${item.author.loginname}`}><img src={item.author.avatar_url} alt="" /></Link> <Link to={`/topic/${item.id}`}>{item.title}</Link></li>)
                  }
                </ul> : '无话题'}
              </div>
              <div className='chuang'>
                <h4>最近参与的话题</h4>
                {userInfo.recent_replies.length ? <ul>
                  {
                    userInfo.recent_replies.map(item => <li key={item.id}> <Link to={`/user/${item.author.loginname}`}><img src={item.author.avatar_url} alt="" /></Link> <Link to={`/topic/${item.id}`}>{item.title}</Link></li>)
                  }
                </ul> : '无话题'}
              </div>
            </div> : <Skeleton />
        }
      </div>
    </Box>
  }
}
export default User