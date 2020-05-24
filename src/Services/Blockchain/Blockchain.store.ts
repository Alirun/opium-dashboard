import { computed } from 'mobx'

// Blockchain service
import blockchain, { ProviderName, ProviderType } from './Classes/Blockchain'
import { IERC20 } from './Classes/SmartContract'

// Utils
import { logger } from '../../Utils/logger'

// Constants
import { EIP712Message } from '../../Constants/Types/blockchain'

const log = logger('BlockchainStore')

const PERSISTENT_SESSION_LOCAL_STORAGE_KEY = 'persistentSession'

type PersistentSession = {
  providerName: ProviderName
  providerType: ProviderType
  address: string
}

export class BlockchainStore {
  @computed
  get currentNetworkName() {
    return blockchain.currentNetworkName
  }

  @computed
  get correctNetwork() {
    return blockchain.correctNetwork
  }

  @computed
  get address() {
    return blockchain.address
  }

  private _sessionLoadedCallback = () => {}
  private _sessionPreparationCallback = () => {}

  constructor() {
    blockchain.registerWeb3ModalOnConnectCallback(this._handleWeb3ConnectOnConnect)
  }

  /** GENERAL */
  public registerCallbacks = (sessionLoadedCallback: () => void, sessionPreparationCallback: () => Promise<void>, logoutCallback: () => void) => {
    this._sessionLoadedCallback = sessionLoadedCallback
    this._sessionPreparationCallback = sessionPreparationCallback

    blockchain.registerLogoutCallback(logoutCallback)
  }

  /** BLOCKCHAIN ACTIONS */
  /**
   * Calls `approve()` function and tracks transaction
   * @param tokenAddress address of token
   * @param spender Address of token spender to set
   * @param confirmationCallback Callback function, which would be called on first confirmation
   */
  public approveToken(tokenAddress: string, spender: string, confirmationCallback: () => void) {
    const token = new IERC20(tokenAddress)
    return token.approve(spender, confirmationCallback)
  }

  public signTypedMessage(message: EIP712Message) {
    return blockchain.signTypedData(message)
  }

  public subscribeNewBlockHeaders = blockchain.subscribeNewBlockHeaders

  /** WALLET */
  public login = async () => {
    log.debug('login()')
    try {
      await blockchain.toggleWeb3Modal()
    } catch (e) {
      log.error('Error while connecting', e)
    }
  }

  public logout = () => {
    log.debug('logout()')

    // Unsubscribe from receiving new blocks
    blockchain.unsubscribeNewBlockHeaders()

    // Clear persistent session
    this._clearPersistentSession()

    // Set Blockchain store state
    blockchain.clearWallet()
  }

  /** PERSISTENT SESSION */
  private _clearPersistentSession() {
    localStorage.removeItem(PERSISTENT_SESSION_LOCAL_STORAGE_KEY)

    // Remove WalletConnect session if exists
    localStorage.removeItem('walletconnect')
  }

  public savePersistentSession() {
    if (!blockchain.providerName || !blockchain.providerType) {
      return
    }

    const persistentSession: PersistentSession = {
      providerName: blockchain.providerName,
      providerType: blockchain.providerType,
      address: this.address
    }

    window.localStorage.setItem(PERSISTENT_SESSION_LOCAL_STORAGE_KEY, JSON.stringify(persistentSession))
  }

  private _loadAndCheckIfWasPersisted = () => {
    log.debug('_loadAndCheckIfWasPersisted()')
    const localStoragePersistentSession = window.localStorage.getItem(PERSISTENT_SESSION_LOCAL_STORAGE_KEY)

    if (!localStoragePersistentSession) {
      return false
    }

    const persistentSession: PersistentSession = JSON.parse(localStoragePersistentSession)
    
    // Check wrong persistentSession.address
    if (this.address !== persistentSession.address) {
      log.error('Address in persistent session is wrong')
      this.logout()
      return false
    }

    return true
  }

  private _handleWeb3ConnectOnConnect = async () => {
    log.debug('_handleWeb3ConnectOnConnect()')
    // Check if session was already persisted
    const wasPersisted = this._loadAndCheckIfWasPersisted()
    if (wasPersisted) {
      // Trigger session loaded callback
      this._sessionLoadedCallback()
      return
    }

    this._sessionPreparationCallback()
  }
}

export default new BlockchainStore()
