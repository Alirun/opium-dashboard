import React, { Component } from 'react'
import { Card, CardMedia, CardContent, Typography, Link, Grid } from '@material-ui/core'
import './styles.scss'

import apiStore from '../../Services/Api/Api.store'
import Loading from '../../Components/Loading'
import ChainLinkLogo from '../../Img/chainlinkLogo.png'

type Props = {}

type State = {
  loading: boolean
}

class Overview extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = {
      loading: true
    }
  }

  componentDidMount() {
    apiStore.setChainLinkOracle().then(() => {
      this.setState({
        loading: false
      })
    })
  }

  render() {
    const { myChainLinkOracle } = apiStore
    const { loading } = this.state

    if (loading) {
      return <Loading />
    }
    return (
      <div className='oraclesWrapper'>
        <Grid 
          item 
          xs={4}
          direction="column"
          alignItems="center"
          justify="center"
        >
          <Card className='oraclesCardWrapper'>
            <CardMedia
              className='oracleLogo'
              image={ChainLinkLogo}
              title="ChainLink"
            />
            <CardContent>
              <Typography gutterBottom variant="h5" component="h2">
                  1ETH = {myChainLinkOracle}DAI
              </Typography>
              <Typography variant="body2" color="textSecondary" component="p">
                  Source: 
                <Link target='_blank' href='https://feeds.chain.link/dai-eth' className='oracleLink'>Chainlink</Link>
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </div>
    )
  }
}

export default Overview
