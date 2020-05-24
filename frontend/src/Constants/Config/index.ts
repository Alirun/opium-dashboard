import { levelFromName } from 'browser-bunyan'

// App Env
const environment = process.env.NODE_ENV || 'development'
const namespace = process.env.REACT_APP_NAMESPACE || 'development'

// Api Env
const apiVersion = process.env.REACT_APP_API_VERSION || 'v1'
const apiBase = process.env.REACT_APP_API_ENDPOINT || 'api-stage-trade.theart.exchange'
const https = process.env.REACT_APP_SSL_ENABLED === 'false' ? 'http' : 'https'
const wss = process.env.REACT_APP_SSL_ENABLED === 'false' ? 'ws' : 'wss'
const theGraphApi = process.env.REACT_APP_THEGRAPH_ENDPOINT || 'api.thegraph.com/subgraphs/name/opiumprotocol/opium-network'

const endpoint = `${https}://${apiBase}/${apiVersion}`
const theGraphEndpoint = `${https}://${theGraphApi}`

const isProduction = namespace === 'production'

// Blockchain Helpers
const NETWORK_IDS = {
  MAIN: 1,
  RINKEBY: 4
}

const NETWORK_NAMES = {
  MAIN: 'mainnet',
  RINKEBY: 'rinkeby'
}

const networkId = isProduction ? NETWORK_IDS.MAIN : NETWORK_IDS.RINKEBY
const networkName = isProduction ? NETWORK_NAMES.MAIN : NETWORK_NAMES.RINKEBY

// Blockchain Env
const infuraId = process.env.REACT_APP_INFURA_ID || '057f2988b6c7402c9544cc1ec70d873d'

// Logger
const logger = {
  level: isProduction ? levelFromName.fatal : levelFromName.trace,
}

const providers = {
  infura: {
    ws: networkId === NETWORK_IDS.MAIN? `wss://mainnet.infura.io/ws/v3/${infuraId}` : `wss://rinkeby.infura.io/ws/v3/${infuraId}`
  }
}

export default {
  app: {
    environment,
    namespace,

    isProduction
  },

  logger,

  products: {
    toFixedBackend: 3,
    toFixedFrontend: 1
  },

  api: {
    apiVersion,
    apiBase,
    https,
    wss,

    endpoint,
    theGraphEndpoint,
  },

  blockchain: {
    networkId,
    networkName,
    infuraId,
    providers,
    injectedWalletChangesRefreshTime: 1000
  },

  wallet: {
    fortmatic: {
      key: isProduction ? '' : ''
    },
    portis: {
      id: '6e0b2b0c-b666-428c-a26a-a000ba40b8b3'
    }
  }
}
