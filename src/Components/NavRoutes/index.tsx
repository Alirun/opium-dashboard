import React, { Component } from 'react'
import { Link } from '@material-ui/core'

import { Links } from './navLinks'
import Logo from '../../Img/logo.png'

import './styles.scss'

type State = {
}

class NavRoutes extends Component<State> {
  render () {
    return (
      <div className='routesWrapper'>
        <Link href='#/'>
          <img
            className='logo'
            src={Logo}
            alt=''
          />
        </Link>
        {Links.map(({ to, title }, index) => (
          <Link
            href={to}
            className={`navLink ${window.location.hash === to && 'active'}`}
            key={title}
            underline='none'
          >
            {title}
          </Link>
        ))}
      </div>
    )
  }
}

export default NavRoutes
