import React, { Component } from 'react'
import { NavLink, Link } from 'react-router-dom';
import { Pagination, Skeleton } from 'antd';
import './home.scss'
import axios from 'axios'
class Home extends Component {
  state = {
    topics: [],
    currentPage: 1
  }
  componentDidMount() {
    const type = this.fromLocationGetType()
    const currentPage = this.fromLocationGetPage()
    this.setState({
      currentPage
    })
    this.getTopics(type, currentPage)
  }
  componentDidUpdate(prevProps) {
    const { search } = this.props.location
    const oldsearch = prevProps.location.search
    if (search !== oldsearch) {
      const type = this.fromLocationGetType()
      if (!search.includes('page')) {
        this.setState({
          currentPage: 1
        })
        this.getTopics(type, 1)
      } else {
        this.getTopics(type, this.fromLocationGetPage())
      }
    }
  }
  getTopics = (type = 'all', page = '1', limit = 20) => {
    axios.get(`https://www.vue-js.com/api/v1/topics?tab=${type}&limit=${limit}&page=${page}`).then(res => {
      console.log(res.data.data)
      this.setState({
        topics: res.data.data
      })
    })
  }
  changePage = (page) => {
    const type = this.fromLocationGetType()
    this.props.history.push(`?tab=${type}&page=${page}`)
    this.setState({
      currentPage: page
    })
  }
  fromLocationGetType = () => {
    const { search } = this.props.location
    return search === '' ? 'all' : search.includes('all') ? 'all' : search.includes('share') ? 'share' : search.includes('weex') ? 'weex' : search.includes('good') ? 'good' : search.includes('job') ? 'job' : 'ask'
  }
  fromLocationGetPage = () => {
    const { search } = this.props.location
    return search.includes('page') ? Number(search.match(/[0-9]{1,2}/)[0]) : 1
  }
  getButtonText = topic => topic.top ? '置顶' : '精华'
  render() {
    const { search } = this.props.location
    const { topics, currentPage } = this.state
    const paginationArr = [
      { tab: 'all', allNumber: 1015 },
      { tab: 'good', allNumber: 15 },
      { tab: 'share', allNumber: 350 },
      { tab: 'weex', allNumber: 3 },
      { tab: 'job', allNumber: 39 },
      { tab: 'ask', allNumber: 623 }
    ]
    const paginationTotal = paginationArr.find(item => search === '' ? item.tab === 'all' : search.indexOf(item.tab) > -1).allNumber
    return <div className='home'>
      <div className="nav">
        <ul>
          <li><NavLink isActive={() => search.includes('all') || search === ''} to='/?tab=all'>全部</NavLink></li>
          <li><NavLink isActive={() => search.includes('good')} to='/?tab=good'>精华</NavLink></li>
          <li><NavLink isActive={() => search.includes('weex')} to='/?tab=weex'>weex</NavLink></li>
          <li><NavLink isActive={() => search.includes('share')} to='/?tab=share'>分享</NavLink></li>
          <li><NavLink isActive={() => search.includes('ask')} to='/?tab=ask'>问答</NavLink></li>
          <li><NavLink isActive={() => search.includes('job')} to='/?tab=job'>招聘</NavLink></li>
        </ul>
      </div>
      <div className='topic-list'>
        {
          topics.length ? <div>
            <ul>
              {
                topics.map(item => <li key={item.id}> <Link to={`/user/${item.author.loginname}`}><img src={item.author.avatar_url} alt="" /><span style={{ color: '#9e78c0', fontSize: '14px' }}>{item.reply_count}</span>/<span style={{ color: '#b4b4b4', fontSize: '12px' }}>{item.visit_count}</span></Link> <span className="zd">{this.getButtonText(item)}</span><Link to={`/topic/${item.id}`}>{item.title}</Link></li>)
              }
            </ul>
            <Pagination onChange={this.changePage} current={currentPage} total={paginationTotal} defaultPageSize={20} />
          </div> : <Skeleton />
        }

      </div>
    </div>
  }
}
export default Home