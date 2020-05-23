import loadable from 'react-loadable'
import Loading from './Components/Loading'

export default [
  {
    path: '/',
    exact: true,
    component: loadable({
      loader: () => import('./Views/Protocol'),
      loading: Loading
    })
  },
  {
    path: '/oracles',
    exact: true,
    component: loadable({
      loader: () => import('./Views/Oracles'),
      loading: Loading
    })
  },
  {
    path: '/synthetics',
    exact: true,
    component: loadable({
      loader: () => import('./Views/Synthetics'),
      loading: Loading
    })
  },
]
