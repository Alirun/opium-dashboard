import loadable from 'react-loadable'
import Loading from './Components/Loading'

export default [
  {
    path: '/',
    exact: true,
    component: loadable({
      loader: () => import('./Views/Overview'),
      loading: Loading
    })
  },
]
