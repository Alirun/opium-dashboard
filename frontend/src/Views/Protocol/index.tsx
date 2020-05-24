import React, { Component } from 'react'
import { Button, Box, Typography, Card, CardContent } from '@material-ui/core'
//@tsignor 
import { LineChart } from 'react-charts-d3';
import './styles.scss'

type Props = {}

type State = {
  loading: boolean
}
const data = [
  { key: 'Group 1', values: [ { x: 'A', y: 23 }, { x: 'B', y: 8 } ] },
  { key: 'Group 2', values: [ { x: 'A', y: 15 }, { x: 'B', y: 37 } ] },
];
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
        <div className='overviewBody'>
          <div className='protocolHeader'>
            Margin Locked
          </div>
          <Card className='protocolTotalLocked'>
            Total: 3800 USD
          </Card>
          <div className='protocolGraphWrap'>
            <LineChart className='protocolChart' data={data} />
            <Card className='protocolroot'>
              <CardContent>
                <Typography className='protocoltitle' color="textSecondary" gutterBottom>
                  DAI
                </Typography>
                <Typography variant="body2" component="p">
                  Total: total
                </Typography>
                <Typography variant="body2" component="p">
                  USD: total
                </Typography>
              </CardContent>
            </Card>
            <Card className='protocolroot'>
              <CardContent>
                <Typography className='protocoltitle' color="textSecondary" gutterBottom>
                  DAI
                </Typography>
                <Typography variant="body2" component="p">
                  Total: total
                </Typography>
                <Typography variant="body2" component="p">
                  USD: total
                </Typography>
              </CardContent>
            </Card>
            <Card className='protocolroot'>
              <CardContent>
                <Typography className='protocoltitle' color="textSecondary" gutterBottom>
                  DAI
                </Typography>
                <Typography variant="body2" component="p">
                  Total: total
                </Typography>
                <Typography variant="body2" component="p">
                  USD: total
                </Typography>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    )
  }
}

export default Overview
