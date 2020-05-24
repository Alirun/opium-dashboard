import React from 'react'
import Loader from 'react-loading'

const loadingProps = {
  className: 'loading',
  color: '#197cd8',
  height: '4rem',
  width: '6rem'
}

const Loading = () => (
  <Loader type='bubbles' {...loadingProps}/>
)

export default Loading
