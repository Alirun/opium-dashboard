import { observable, action, computed } from 'mobx'

// Utils
import { logger } from '../../Utils/logger'

// Services
import blockchainStore from '../Blockchain/Blockchain.store'
import apiStore from '../Api/Api.store'

const log = logger('AuthStore')

const LOGIN_ATTEMPTED_LOCAL_STORAGE_KEY = 'loginAttempted'
const CREDENTIALS_LOCAL_STORAGE_KEY = 'credentials'

type Credentials = {
  accessToken: string
  ttl: number
}

export class AuthStore {
  @observable public isAuthPending = false
  @observable public loggedIn = false

  @computed
  get address() {
    return blockchainStore.address
  }

  constructor() {
    blockchainStore.registerCallbacks(this._sessionLoadedCallback, this._sessionPreparationCallback, this.logout)
  }

  public login = () => {
    log.debug('login()')
    blockchainStore.login()
  }

  public logout = () => {
    log.debug('logout()')
    blockchainStore.logout()
    apiStore.clearAccessTokenData()
    this._clearCredentials()
    this.loggedIn = false
  }

  private _sessionLoadedCallback = () => {
    log.debug('_sessionLoadedCallback()')
    const credentials = this._getCredentials()

    if (!credentials) {
      this.logout()
      blockchainStore.login()
      return
    }

    // Set access token data
    apiStore.setAccessTokenData(credentials.accessToken, credentials.ttl)
    // Finalize log in
    this._finalizeLogIn()
  }

  private _getLoginAttempted = () => {
    return localStorage.getItem(LOGIN_ATTEMPTED_LOCAL_STORAGE_KEY) === 'true'
  }

  private _setLoginAttempted = (loginAttempted: boolean) => {
    return localStorage.setItem(LOGIN_ATTEMPTED_LOCAL_STORAGE_KEY, `${loginAttempted}`)
  }

  private _getCredentials = (): Credentials | null => {
    const localStorageCredentials = localStorage.getItem(CREDENTIALS_LOCAL_STORAGE_KEY)

    if (!localStorageCredentials) {
      return null
    }

    return JSON.parse(localStorageCredentials)
  }

  private _setCredentials = (credentials: Credentials) => {
    return localStorage.setItem(CREDENTIALS_LOCAL_STORAGE_KEY, JSON.stringify(credentials))
  }

  private _clearCredentials = () => {
    return localStorage.removeItem(CREDENTIALS_LOCAL_STORAGE_KEY)
  }

  @action
  private _sessionPreparationCallback = async () => {
    log.debug('_sessionPreparationCallback()')
    // Check if session was not persisted yet, but login was already required
    // Especially WalletConnect case, when user neither signer nor rejected login message
    // In that case log out and trigger login again
    if (this._getLoginAttempted()) {
      this._setLoginAttempted(false)
      this.logout()
      blockchainStore.login()
      return
    }

    // Access token formation
    const loginData = await apiStore.fetchLoginData()

    // Flag login attempting
    this._setLoginAttempted(true)

    // 10 minutes timeout
    const SIGNATURE_TIMEOUT = 10 * 60 * 1000

    try {
      // Trigger auth pending flag
      this.isAuthPending = true

      // Signature promise wrapper for Timeout rejection
      const signaturePromise = new Promise((resolve: (signature: string) => void, reject) => {
        let isRejected = false

        // Request signature and bind 
        blockchainStore
          .signTypedMessage(loginData.data)
          .then(resolve)
          .catch((e) => {
            if (!isRejected) {
              reject(e)
            }
          })

        // Set timeout on signature request
        setTimeout(() => {
          isRejected = true
          reject(new Error('Signature request timeout'))
        }, SIGNATURE_TIMEOUT)
      })

      // Wait till signature received
      const signature = await signaturePromise

      // Trigger ApiStore to set ttl, address, signature and create accessToken
      const accessToken = apiStore.formAccessToken(loginData.ttl, blockchainStore.address, signature)
      apiStore.setAccessTokenData(accessToken, loginData.ttl)
      this._setCredentials({
        accessToken, ttl: loginData.ttl
      })

      this._finalizeLogIn()

      // Save persistent session if possible
      blockchainStore.savePersistentSession()
    } catch (e) {
      log.error('Persistent session was not found and error occurred while logging in', e.message)
      this.logout()
    }

    // Clear login attempt flag
    this._setLoginAttempted(false)

    // Trigger auth pending flag
    this.isAuthPending = false
  }

  private _finalizeLogIn = () => {
    log.debug('_finalizeLogIn()')
    // Subscribe to new blocks
    blockchainStore.subscribeNewBlockHeaders(() => {
      // Check if accessTokenExpired
      if (apiStore.isAccessTokenExpired()) {
        log.error('Access token is expired')
        return this.logout()
      }
      apiStore.loadBalance()
    })
    // Immediately call balance loading
    apiStore.loadBalance()

    this.loggedIn = true
  }
}

export default new AuthStore()
