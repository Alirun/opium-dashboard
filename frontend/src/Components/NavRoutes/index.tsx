import React, { Component } from 'react'
import { Link, CardMedia } from '@material-ui/core'

import { Links } from './navLinks'
import Logo from '../../Img/logo.jpeg'

import './styles.scss'

type Props = {
  activeTab: string,
  additionalClassName: string
}

type State = {
}

class NavRoutes extends Component<Props, State> {


  render () {
    const { activeTab, additionalClassName } = this.props 
    return (
      <div className='routesWrapper'>
        <CardMedia
          className='logo'
          image={Logo}
          title="Contemplative Reptile"
        />
      {Links.map(({ to, title }) => (
        <Link
          href={to}
          className={`navLink ${additionalClassName} ${activeTab === to && 'active'}`}
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
