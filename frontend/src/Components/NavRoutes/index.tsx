import React, { Component } from 'react'
import { Link, CardMedia } from '@material-ui/core'

import { Links } from './navLinks'
import Logo from '../../Img/logo.jpeg'

import './styles.scss'

type State = {
}

class NavRoutes extends Component<State> {


  render () {
    return (
      <div className='routesWrapper'>
        <CardMedia
          className='logo'
          image={Logo}
          title="Contemplative Reptile"
        />
        {Links.map(({ to, title }, index) => (
          <Link
            href={to}
            className={`navLink ${window.location.pathname === to && 'active'}`}
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
