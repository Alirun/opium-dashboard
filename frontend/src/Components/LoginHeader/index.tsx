import React from 'react'
import { observer } from 'mobx-react'
import { toJS } from 'mobx'
import { Button, Box } from '@material-ui/core'
import './styles.scss'

// Services
import authStore from '../../Services/Auth/Auth.store'
import apiStore from '../../Services/Api/Api.store'

type Props = {
  additionalClassName: string
}

const LoginHeader: React.FC<Props> = (props) => {
  console.log()
  return (
    <div className={`loginWrapper ${props.additionalClassName}`}>
      {authStore.loggedIn ? 
        <Box className={'loggedInContentWrapper'}>
          <Box className='accountInfoWrapper'>
            <div className={'balance'}>Balance: {apiStore.balance && toJS(apiStore.balance.eth)} Eth</div>
            <div className={'wallet'}>Wallet: {authStore.address && authStore.address}</div>
          </Box>
          <Button variant='contained' color='secondary' onClick={authStore.logout} className={'logoutButton'}>Logout</Button>
        </Box> : 
        <Button variant='contained' color='primary' onClick={authStore.login} className={'loginButton'}>Login</Button>
      }
    </div>
  )
}

export default observer(LoginHeader)
