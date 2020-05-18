import React from 'react'
import { observer } from 'mobx-react'

// Services
import authStore from '../../Services/Auth/Auth.store'

const WalletController: React.FC<{}> = () => {
  return (
    <div>
      { !authStore.loggedIn ?
        <button onClick={authStore.login}>Connect Wallet</button> :
        (
          <div>
            {authStore.address}<br />
            <button onClick={authStore.logout}>Disconnect Wallet</button>
          </div>
        )
      }
    </div>
  )
}

export default observer(WalletController)
