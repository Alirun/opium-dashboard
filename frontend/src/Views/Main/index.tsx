import React, { Component } from 'react'
import Loading from 'react-loading'

// Components
import WalletController from '../../Components/WalletController/'

// Services
import apiStore from '../../Services/Api/Api.store'

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
  
  async componentDidMount () {
    await apiStore.init()
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

        <WalletController />
      </div>
    )
  }
}

export default Main
