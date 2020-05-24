import React, { Component } from 'react'
import { observer } from 'mobx-react'
import {
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Paper,
  Link,
  Typography,
  Card,
  CardContent
} from '@material-ui/core'

import { AreaChart } from 'react-charts-d3'

import './styles.scss'

// Services
import authStore from '../../Services/Auth/Auth.store'
import apiStore from '../../Services/Api/Api.store'

// Components 
import Loading from '../../Components/Loading'

type Props = {}

type State = {
  loading: boolean
}
const data = [
  { key: 'Group 1', values: [{ x: 'A', y: 23 }, { x: 'B', y: 8 }] },
  { key: 'Group 2', values: [{ x: 'A', y: 15 }, { x: 'B', y: 37 }] },
]

class Overview extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = {
      loading: true
    }
  }

  componentDidMount() {
    apiStore.setPositions().then(() => {
      this.setState({
        loading: false
      })
    })
  }

  render() {
    const { loading } = this.state

    if (loading) {
      return <Loading />
    }

    return (
      <div className='protocolWrapper'>
        <div className='protocolHeader'>
          Margin Locked
        </div>
        <Card className='protocolMarginTotalLocked'>
          Total: 3800 USD
        </Card>
        <div className='protocolGraphWrap'>
          <AreaChart className='protocolChart' data={data} />
          <Card className='protocolRoot'>
            <CardContent>
              <Typography className='protocolTitle' color="textSecondary" gutterBottom>
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
          <Card className='protocolRoot'>
            <CardContent>
              <Typography className='protocolTitle' color="textSecondary" gutterBottom>
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
          <Card className='protocolRoot'>
            <CardContent>
              <Typography className='protocolTitle' color="textSecondary" gutterBottom>
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
        <div className='protocolHeader'>
          Positions
        </div>
        <Card className='protocolTotalLocked'>
          <Typography variant="body2" component="p">
            Tickers: total
          </Typography>
          <Typography variant="body2" component="p">
            Long positions: total
          </Typography>
          <Typography variant="body2" component="p">
            Short positions: total
          </Typography>
          <Typography variant="body2" component="p">
            Users: total
          </Typography>
        </Card>
        <div className='myPositionsWrapper'>
          <div className='protocolHeader'>My Positions</div>
          {!authStore.loggedIn ? <div className='myPositionLogin'>PLease login</div> :
            <TableContainer className='positionsTableContainer' component={Paper}>
              <Table aria-label="simple table">
                <TableHead>
                  <TableRow>
                    <TableCell>TokenID</TableCell>
                    <TableCell align="center">Position</TableCell>
                    <TableCell align="center">Amount</TableCell>
                    <TableCell align="center">Explore</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {apiStore.myPositions?.map((el, index) => (
                    <TableRow key={index}>
                      <TableCell align="left">{el.tokenId.id}</TableCell>
                      <TableCell align="center">{el.tokenId.type}</TableCell>
                      <TableCell align="center">{el.amount}</TableCell>
                      <TableCell align="center"><Link target="_blank" href={`https://trade.opium.exchange/derivatives/${el.tokenId.ticker?.id}`}>Explore</Link></TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          }
        </div>
      </div>
    )
  }
}

export default observer(Overview)
