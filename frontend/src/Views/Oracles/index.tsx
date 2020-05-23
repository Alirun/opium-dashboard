import React, { Component } from 'react'
import NavRoutes from '../../Components/NavRoutes'

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
    this.setState({
      loading: false
    })
  }

  render () {
    return (
      <div className='overviewWrapper'>
        <NavRoutes activeTab='/oracles' additionalClassName='overviewRoutes' />
        <div className='overviewBody'></div>
      </div>
    )
  }
}

export default Overview
