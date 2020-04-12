import React, { Component } from 'react'
import './header.scss'
import axios from 'axios'
import logo from '../../img/vue.png'
import { Link, withRouter } from 'react-router-dom';
class Header extends Component {
  state = {
    userInfo: null,
    token: '',
    messageCount: 0
  }
  componentDidMount() {
    const token = localStorage.getItem('token')
    // const author_id = localStorage.getItem('author_id')
    if (token) {
      axios.post('https://www.vue-js.com/api/v1/accesstoken', { accesstoken: token }).then(res => {
        localStorage.setItem('token', token)
        localStorage.setItem('author_id', res.data.id)
        delete res.data.success
        this.setState({
          userInfo: res.data
        })
      }).catch(() => {
        alert('登录失败')
      })
    }
    this.getMessageCount()
  }
  componentDidUpdate(prevProps) {
    const token = localStorage.getItem('token')
    if (this.props.location.pathname !== prevProps.location.pathname && this.props.location.pathname !== '/my/messages' && token) {
      this.getMessageCount()
    }
  }
  getMessageCount = () => {
    const token = localStorage.getItem('token')
    axios.get(`https://www.vue-js.com/api/v1/message/count?accesstoken=${token}`).then(res => {
      // console.log(res.data.data)
      this.setState({
        messageCount: res.data.data
      })
    })
  }
  render() {
    const { userInfo, token, messageCount } = this.state
    return <header>
      <div className="header-inner">
        <Link to='/'><img style={{ marginTop: '10px' }} src={logo} alt="" /></Link>
        {
          userInfo ? <div><img src={userInfo.avatar_url} alt="" /><span style={{ color: '#fff', marginLeft: '10px', marginRight: '10px' }}>{userInfo.loginname}</span><button onClick={this.logout}>登出</button>
            <span>{messageCount ? messageCount : ''}<Link style={{ color: '#fff', width: '100px', fontSize: '18px', marginTop: '15px' }} to='/my/messages'>未读消息</Link> </span>
            {this.props.location.pathname === '/topic/create' ? '' :
              <button className='fbht'><Link to='/topic/create'>发布话题</Link></button>
            }</div> : <div style={{ marginTop: '10px' }}>
              <input onChange={(event) => this.setState({ token: event.target.value })} value={token} type="text" />
              <button onClick={this.login}>登录</button>
            </div>
        }
      </div>
    </header>
  }
  login = () => {
    const { token } = this.state
    if (token.trim()) {
      axios.post('https://www.vue-js.com/api/v1/accesstoken', { accesstoken: token }).then(res => {
        console.log(res.data);
        localStorage.setItem('token', token)
        localStorage.setItem('author_id', res.data.id)
        delete res.data.success
        this.setState({
          userInfo: res.data
        })
        this.props.history.push('/')
      }).catch(() => {
        alert('登录失败')
      })
    }
  }
  logout = () => {
    this.setState({
      userInfo: null
    })
    localStorage.clear()
    this.props.history.push('/')
  }
}
export default withRouter(Header)
