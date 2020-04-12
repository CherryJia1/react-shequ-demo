import React, { Component } from 'react'
import { Link } from 'react-router-dom';
import axios from 'axios'
import { Alert } from 'antd';
import Box from '../Box/Box'
import './createTopic.scss'
class CreateTopic extends Component {
  state = {
    tab: '',
    title: '',
    content: ''
  }
  render() {
    const { tab, title, content } = this.state

    return <Box title='发布话题' linkText='主页' linkAddress='/' >
      <div className='create-topic'>
        <span>选择板块:</span>
        <select value={tab} onChange={event => this.selectChange(event, 'tab')}>
          <option value="">请选择</option>
          <option value="share">分享</option>
          <option value="ask">问答</option>
          <option value="job">招聘</option>
        </select>
        {tab === 'job' ? <span>为避免被管理员删帖，发帖时请好好阅读 <Link to='/topic/541ed2d05e28155f24676a12'>《招聘帖规范》</Link></span> : ''}
        <br />
        <input onChange={event => this.selectChange(event, 'title')} value={title} type="text" placeholder='标题字数 10 字以上' />
        <br />
        <textarea value={content} onChange={event => this.selectChange(event, 'content')}></textarea>
        <button onClick={this.submit}>提交</button>
      </div>
    </Box>
  }
  selectChange = (event, propty) => {
    this.setState({
      [propty]: event.target.value
    })
  }
  submit = () => {
    const { tab, title, content } = this.state
    const token = localStorage.getItem('token')
    const onClose = () => {
      console.log('I was closed.');
    };
    if (tab && title.length >= 10 && content) {
      axios.post(`https://www.vue-js.com/api/v1/topics`, { tab, title, content, accesstoken: token }).then(res => {
        this.props.history.push(`/topic/${res.data.topic_id}`)
      })
    } else {
      return (
        <Alert
          message="Warning Text Warning Text Warning TextW arning Text Warning Text Warning TextWarning Text"
          type="warning"
          closable
          onClose={onClose}
        />
      )
    }
  }

}
export default CreateTopic