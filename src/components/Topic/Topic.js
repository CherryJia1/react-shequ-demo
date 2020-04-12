import React, { Component } from 'react'
import axios from 'axios'
import './topic.scss'
import { Skeleton, message, } from 'antd';
import { LikeOutlined, MessageOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';
import E from 'wangeditor'

class Topic extends Component {
  state = {
    topic: null,
    comment: '',
    textareaComment: ''
  }
  componentDidMount() {
    const { topicid } = this.props.match.params
    const token = localStorage.getItem('token')
    axios.get(`https://www.vue-js.com/api/v1/topic/${topicid}`).then(res => {
      const topic = res.data.data
      topic.replies.forEach(item => {
        item.showTextarea = false
      });
      this.setState({
        topic: topic
      })
      if (token) {
        this.myEditor = new E(this.editor)
        this.myEditor.customConfig.onchange = html => {
          this.setComment(html)
        }
        this.myEditor.create()
      }
    })
  }
  setComment = newComment => {
    this.setState({
      comment: newComment
    })
  }
  up = reply_id => {
    const token = localStorage.getItem('token')
    if (token) {
      axios.post(`https://www.vue-js.com/api/v1/reply/${reply_id}/ups`, { accesstoken: token }).then(res => {
        const author_id = localStorage.getItem('author_id')
        const topic = { ...this.state.topic }
        const currenReply = topic.replies.find(item => item.id === reply_id)
        if (res.data.action === 'up') {
          currenReply.ups.push(author_id)
        } else {
          currenReply.ups = currenReply.ups.filter(item => item !== author_id)
        }
        this.setState({
          topic: topic
        })
      })
    } else {
      message.info('请登录');
    }
  }
  addComment = () => {
    const { topic, comment } = this.state
    console.log(comment)
    if (comment.trim()) {
      const token = localStorage.getItem('token')
      const topic_id = topic.id
      axios.post(`https://www.vue-js.com/api/v1/topic/${topic_id}/replies`, { accesstoken: token, content: comment }).then(res => {
        const { topicid } = this.props.match.params
        this.setState({
          comment: ''
        })
        this.myEditor.txt.html('')
        axios.get(`https://www.vue-js.com/api/v1/topic/${topicid}`).then(res => {
          // const topic = res.data.data

          this.setState({
            topic: res.data.data
          })
        })
      })
    } else {
      message.info('请输入')
    }
  }
  textareaChange = evevt => {
    this.setState({
      comment: evevt.target.value
    })

  }

  reply = ({ id, author }) => {
    const { topic } = this.state
    const newTopic = { ...topic }
    newTopic.replies.forEach(item => {
      if (item.id === id) {
        item.showTextarea = !item.showTextarea
      } else {
        item.showTextarea = false
      }
    })
    this.setState({
      topic: newTopic,
      textareaComment: `@${author.loginname} `
    })

  }
  replyReply = id => {
    const { textareaComment, topic } = this.state
    const topic_id = topic.id
    if (textareaComment.trim()) {
      const token = localStorage.getItem('token')
      axios.post(`https://www.vue-js.com/api/v1/topic/${topic_id}/replies`, { accesstoken: token, content: textareaComment, reply_id: id }).then(res => {
        axios.get(`https://www.vue-js.com/api/v1/topic/${topic_id}`).then(res => {
          const topic = res.data.data
          topic.replies.forEach(item => {
            item.showTextarea = false
          })
          this.setState({
            topic: res.data.data,
            textareaComment: ''
          })
        })
      })
    }
  }
  render() {
    const { topic, textareaComment } = this.state
    const token = localStorage.getItem('token')
    const author_id = localStorage.getItem('author_id')
    return topic ? <div className='topic'>

      < div className="topic-header">
        <div className="header-top">
          <span className='topic-zd' >置顶</span>
          <h2 className='topic-h2'>{topic.title}</h2><br />
        </div>
        <div>
          <span className='fa'>· 发布于 {topic.create_at}</span>
          <span className='fa'>· 作者 <Link to={`/user/${topic.author.loginname}`}>{topic.author.loginname}</Link></span>
        </div>
        <div className='topic-content' dangerouslySetInnerHTML={{ __html: topic.content }}></div>

      </div>
      <div className="comment-box">
        <ul>
          {topic.replies.map(item => <li id={item.id} key={item.id}><div style={{ display: 'flex', justifyContent: 'space-between' }}>

            <div>
              <Link to={`/user/${item.author.loginname}`}><img style={{ width: '40px', height: '40px' }} src={item.author.avatar_url} alt="" /></Link>
              <div style={{ float: 'left' }}>
                <Link to={`/user/${item.author.loginname}`}><span>{item.author.loginname}</span></Link>
                <div dangerouslySetInnerHTML={{ __html: item.content }}></div>
              </div>
            </div>
            <div><button onClick={() => this.up(item.id)} style={{ color: item.ups.includes(author_id) ? 'red' : '#000', }}><LikeOutlined /></button><span style={{ marginRight: '15px' }}>{item.ups.length}</span>{token ? <button onClick={() => this.reply(item)}><MessageOutlined /> <label htmlFor={item.id}></label></button> : ''}</div>
          </div>
            {/* {topic.replies.map(item => <li key={item.id}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <div>
                <Link to={`/user/${item.author.loginname}`}><img src={item.author.avatar_url} alt="" /></Link>
                <div style={{ width: '500px' }}>
                  <Link to={`/user/${item.author.loginname}`}>
                    <span>{item.author.loginname}</span>
                  </Link>
                  <div dangerouslySetInnerHTML={{ __html: item.content }}>
                  </div>
                </div>
                <div style={{ display: 'flex', float: 'right' }}><span onClick={() => this.up(item.id)} style={{ color: item.ups.includes(author_id) ? 'red' : '#000' }}><LikeOutlined /></span><span>{item.ups.length}</span>{token ? <button onClick={() => this.reply(item)}> <label htmlFor={item.id}>回复</label> </button> : ''}</div>
              </div>
            </div> */}

            {
              item.showTextarea ? <div> <textarea id={item.id} onChange={(event) => this.setState({
                textareaComment: event.target.value
              })} value={textareaComment} ></textarea><button onClick={() => this.replyReply(item.id)}>回复</button></div> : ''
            }
          </li>)}
        </ul>
        {token ? <div><h3 style={{ backgroundColor: '#f6f6f6', padding: '10px' }}>添加回复</h3>
          <div ref={editor => this.editor = editor} id='editor'></div>
          <button onClick={this.addComment}>回复</button></div> : ''}
      </div>
    </div > : <Skeleton />
  }
}
export default Topic