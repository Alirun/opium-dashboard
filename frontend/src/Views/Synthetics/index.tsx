import React, { Component } from 'react'

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
      <div className='syntheticsWrapper'>
        <div className='comingSoon'>Coming soon</div>
      </div>
    )
  }
}

export default Overview
