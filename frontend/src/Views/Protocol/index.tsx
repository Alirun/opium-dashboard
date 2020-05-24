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
  Link } from '@material-ui/core'
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

class Overview extends Component<Props, State> {
  constructor (props: Props) {
    super(props)
    this.state = {
      loading: true
    }
  }
  
  componentDidMount () {
    apiStore.setPositions().then(() => {
      this.setState({
        loading: false
      })
    })
  }

  render () {
    const { loading } = this.state

    if ( loading ) {
      return <Loading />
    }

    return (
      <div className='protocolWrapper'>
        <div className='myPositionsWrapper'>
          <div>My Positions</div>
          {!authStore.loggedIn ? <div>PLease login</div> :
            <TableContainer className='positionsTableContainer' component={Paper}>
              <Table aria-label="simple table">
                <TableHead>
                  <TableRow>
                    <TableCell>TokenID</TableCell>
                    <TableCell align="right">Position</TableCell>
                    <TableCell align="right">Amount</TableCell>
                    <TableCell align="right">Explore</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {apiStore.myPositions?.map((el, index) => (
                    <TableRow key={index}>
                      <TableCell component="th" scope="row">
                        {el.tokenId.id}
                      </TableCell>
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
