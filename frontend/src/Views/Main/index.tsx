import React, { Component } from 'react'
import Loading from 'react-loading'

import './styles.scss'

type MainProps = {}

type MainState = {
  loading: boolean
}

class Main extends Component<MainProps, MainState> {
  constructor (props: MainProps) {
    super(props)
    this.state = {
      loading: true
    }
  }
  
  componentDidMount () {
    this.setState({
      loading: false
    })
  }

  render () {
    const { loading } = this.state
    const loadingProps ={
      className: 'loading',
      color: '#197cd8',
      height: '4rem',
      width: '6rem'
    }
    if (loading) {
      return <Loading type="bubbles" {...loadingProps}/>
    }

    return (
      <div className='Main'>
        Hello world!
      </div>
    )
  }
}

export default Main
