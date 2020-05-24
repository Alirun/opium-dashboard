import React, { Component } from 'react'
import apiStore from '../../Services/Api/Api.store'

import './styles.scss'

type Props = {}

type State = {
  loading: boolean
}

class Overview extends Component<Props, State> {
  constructor (props: Props) {
    super(props)
    this.state = {
      loading: true
    }
  }
  
  componentDidMount () {
    apiStore.setChainLinkOracle().then(() => {
      this.setState({
        loading: false
      })
    })
  }

  render () {
    const { myChainLinkOracle } = apiStore
    return (
      <div className='overviewWrapper'>
        <div className='overviewBody'></div>
        <div>{myChainLinkOracle}</div>
        <div>sth</div>
      </div>
    )
  }
}

export default Overview
