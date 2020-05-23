import Web3Modal, { getProviderInfo } from 'web3modal'
import { observable, computed, action } from 'mobx'

// @ts-ignore
import WalletConnectProvider from '@walletconnect/web3-provider'
import Fortmatic from 'fortmatic'
import Web3 from 'web3'
import { Subscription } from 'web3-core-subscriptions'
import { BlockHeader } from 'web3-eth'

import config from '../../../Constants/Config'

import { logger } from '../../../Utils/logger'

const log = logger('Blockchain')

export enum ProviderName {
  MetaMask = 'MetaMask',
  WalletConnect = 'WalletConnect',
  Trust = 'Trust',
  Fortmatic = 'Fortmatic',
  Cipher = 'Cipher', // Crashes
  Coinbase = 'Coinbase', // Doesn't support
  Dapper = 'Dapper', // Doesn't support
  Web3 = 'Web3', // [e.g. Opera] Error
  Unknown = 'Unknown'
}

export enum ProviderType {
  injected = 'injected',
  qrcode = 'qrcode',
  web = 'web',
  unknown = 'unknown'
}

const NETWORK_NAMES: {[networkId: number]: string} = {
  1: 'Mainnet',
  3: 'Ropsten',
  4: 'Rinkeby',
  5: 'Goerli',
  42: 'Kovan',
}

export class Blockchain {
  // Web3
  protected _web3: Web3 | null = null
  protected _provider: any | null = null
  protected _web3ws: Web3
  protected _subscription: Subscription<BlockHeader> | null = null
  @observable protected _networkId = 0
  public providerName: ProviderName | null = null
  public providerType: ProviderType | null = null
  
  // Web3Modal
  protected _web3Modal: Web3Modal

  private _periodicalCheckIntervalId: number = 0

  // Wallet
  @observable public web3Connected: boolean = false
  @observable public address: string = ''

  private _logoutCallback = () => {}

  @computed 
  get correctNetwork() {
    return this._networkId === config.blockchain.networkId
  }

  @computed
  get currentNetworkName() {
    const networkName = NETWORK_NAMES[this._networkId]
    return networkName || 'Unknown network'
  }

  @computed
  get requiredNetworkName() {
    return NETWORK_NAMES[config.blockchain.networkId]
  }

  constructor() {
    this._web3Modal = new Web3Modal({
      cacheProvider: true,
      network: config.blockchain.networkName,
      providerOptions: {
        walletconnect: {
          package: WalletConnectProvider,
          options: {
            infuraId: config.blockchain.infuraId
          }
        },
        fortmatic: {
          package: Fortmatic,
          options: {
            key: config.wallet.fortmatic.key
          }
        }
      }
    })

    this._web3ws = new Web3(
      new Web3.providers.WebsocketProvider(
        config.blockchain.providers.infura.ws
      )
    )
    // subscribe to close
    this._web3Modal.on('close', () => {
      log.debug('Web3Modal Modal Closed') // modal has closed
    })
  }

  // Web3Modal
  toggleWeb3Modal() {
    log.debug('toggleWeb3Modal()')
    return this._web3Modal.toggleModal()
  }

  async registerWeb3ModalOnConnectCallback(callback: () => void) {
    log.debug('registerWeb3ModalOnConnectCallback()')
    // Register onConnect callback
    this._web3Modal.on('connect', async (provider: any) => {
      log.debug('web3Modal.on(connect)')
      await this._initWeb3Modal(provider)
      callback()
    })

    // Check if there is cached provider and try to connect to it
    if (this._web3Modal.cachedProvider) {
      await this._web3Modal.connect()
    }
  }

  public registerLogoutCallback(callback: () => void) {
    log.debug('registerLogoutCallback()')
    this._logoutCallback = callback
  }

  // General
  getWeb3() {
    return this._web3
  }

  // Wallet
  async signTypedData(data: any): Promise<string> {
    log.debug('signTypedData()')
    if (!this._provider) {
      throw new Error('Provider is not initialized')
    }

    if (!this._web3) {
      throw new Error('Web3 is not initialized')
    }


    let signature: string

    const accounts = await this._web3.eth.getAccounts()
    const signer = accounts[0]

    switch (this.providerName) {
      case ProviderName.MetaMask:
      case ProviderName.Fortmatic:
        signature = await this._signTypedDataV3(data, signer)
        break
      case ProviderName.Cipher:
      case ProviderName.WalletConnect:
        signature = await this._signTypedDataReversed(data, signer)
        break
      default:
        signature = await this._signTypedData(data, signer)
    }

    return signature
  }

  private _signTypedData(data: any, signer: string): Promise<string> {
    log.debug('_signTypedData()')
    return new Promise(async (resolve, reject) => {
      await this._provider.send(
        {
          method: 'eth_signTypedData',
          params: [signer, JSON.stringify(data)],
        },
        (error: any, result: any) => {
          if (error || result.error) {
            return reject(error || result.error)
          }
          const signature = result.result.substring(2)
          resolve(signature)
        }
      )
    })
  }

  private _signTypedDataReversed(data: any, signer: string): Promise<string> {
    log.debug('_signTypedDataReversed()')
    return new Promise(async (resolve, reject) => {
      await this._provider.send(
        {
          method: 'eth_signTypedData',
          params: [JSON.stringify(data), signer]
        },
        (error: any, result: any) => {
          if (error || result.error) {
            return reject(error || result.error)
          }
          const signature = result.result.substring(2)
          resolve(signature)
        }
      )
    })
  }

  private _signTypedDataV3(data: any, signer: string): Promise<string> {
    log.debug('_signTypedDataV3()')
    return new Promise(async (resolve, reject) => {
      await this._provider.send(
        {
          method: 'eth_signTypedData_v3',
          params: [signer, JSON.stringify(data)],
        },
        (error: any, result: any) => {
          if (error || result.error) {
            return reject(error || result.error)
          }
          const signature = result.result.substring(2)
          resolve(signature)
        }
      )
    })
  }

  @action
  public clearWallet() {
    log.debug('clearWallet()')
    // Clear wallet related vars
    this.web3Connected = false
    this.address = ''

    // Stop periodical checks
    clearInterval(this._periodicalCheckIntervalId)

    // Clear cached provider
    this._web3Modal.clearCachedProvider()

    switch (this.providerName) {
      case ProviderName.WalletConnect:
        // TODO: when implemented this._provider.wc.close
        break
    }
  }
  
  public subscribeNewBlockHeaders = (_callback: () => void) => {
    log.debug('subscribeNewBlockHeaders()')
    if (this._subscription) {
      log.error('Already subscribed')
      return
    }

    const subscription = this._web3ws.eth.subscribe(
      'newBlockHeaders',
      (error, blockHeader) => {
        if (error) {
          log.error(error)
        }
      }
    )
    
    this._subscription = subscription
    subscription.on('data', _callback)
    subscription.on('error', error => log.error('Error while fetching block', error.message))
  }

  public unsubscribeNewBlockHeaders() {
    log.debug('unsubscribeNewBlockHeaders()')
    if (!this._subscription) {
      log.error('Not subscribed yet')
      return
    }

    this._subscription.unsubscribe()
    this._subscription = null
  }
  
  // Web3
  private async _initWeb3Modal(provider: any) {
    log.debug('_initWeb3Modal()')
    const providerInfo = getProviderInfo(provider)
    this.providerName = Object.keys(ProviderName).indexOf(providerInfo.name) !== -1 ? providerInfo.name as ProviderName : ProviderName.Unknown
    this.providerType = Object.keys(ProviderType).indexOf(providerInfo.type) !== -1 ? providerInfo.type as ProviderType : ProviderType.unknown

    log.debug('Provider name and type', providerInfo.name, providerInfo.type)

    await this._initWeb3(provider)
  }

  @action
  private async _initWeb3(provider: any) {
    log.debug('_initWeb3()')
    const web3 = new Web3(provider)

    // Init wallet
    const accounts = await web3.eth.getAccounts()
    if (accounts.length) {
      this.web3Connected = true
      this.address = accounts[0].toLowerCase()
    }

    // Run periodical checks for address and network change
    this._periodicalCheckIntervalId = setInterval(async () => {
      const accounts = await web3.eth.getAccounts()
      // Already logged in and changed account || Just logged in
      if (
        this.web3Connected &&
        accounts.length &&
        this.address.length &&
        accounts[0].toLowerCase() !== this.address
      ) {
        log.debug('Address changed')
        this._logoutCallback()
      }

      const networkId = await web3.eth.net.getId()
      // Already logged in and changed network || Just logged in
      if (
        this.web3Connected &&
        this._networkId !== networkId
      ) {
        log.debug('Network changed')
        this._networkId = networkId
      }
    }, config.blockchain.injectedWalletChangesRefreshTime) as unknown as number

    this._web3 = web3
    this._provider = provider

    // Wallet specific settings
    switch (this.providerName) {
      case ProviderName.MetaMask:
        this._provider.autoRefreshOnNetworkChange = false
        this._provider.on('networkChanged', async () => {
          this._networkId = await web3.eth.net.getId()
        })
        break
      case ProviderName.WalletConnect:
        this._provider.on('networkChanged', async () => {
          this._networkId = await web3.eth.net.getId()
        })
        break
    }

    this._networkId = await this._web3.eth.net.getId()
  }
}

export default new Blockchain()
