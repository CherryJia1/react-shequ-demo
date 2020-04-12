import React from 'react'
import './box.scss'
import { Link } from 'react-router-dom'

const Box = (props) => <div className='box'>
  <div className="box-header">
    {props.linkText ? <span> <Link style={{ marginRight: '5px', marginLeft: '5px', color: '#369214', fontSize: '14px' }} to={props.linkAddress}>{props.linkText}</Link><span>/</span> {props.title1} </span> : ''}<span style={{ marginRight: '5px', marginLeft: '5px', fontSize: '14px' }}>{props.title}</span>
  </div>
  <div className="box-content">
    {props.children}
  </div>
</div>
export default Box