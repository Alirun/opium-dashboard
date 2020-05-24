import { observable } from 'mobx'
import Web3 from 'web3'

// Utils
import blockchainStore from '../Blockchain/Blockchain.store'
// import { logger } from '../../Utils/logger'

// ApiService
import {
  meta, MetaConfigResponse,
  auth,
  wallet, WalletBalanceResponse,
  MyPosition, getPositions,
  getChainLinkOracle
} from './Requests'



// const log = logger('ApiStore')

export class ApiStore {
  @observable public meta: MetaConfigResponse | null = null
  @observable public balance: WalletBalanceResponse | null = null

  @observable public accessToken: string = ''
  @observable public ttl: number = Number.MAX_SAFE_INTEGER
  
  @observable public myPositions: MyPosition[] | null = null
  @observable public myChainLinkOracle: string | null = null

  public async init() {
    this.meta = await meta.get()
  }

  /** FETCHES */
  public async loadBalance() {
    this.balance = await wallet.get(this.accessToken)
  }

  public fetchLoginData() {
    return auth.get()
  }

  /** HELPERS */
  public formAccessToken = (ttl: number, address: string, signature: string) => {
    // Form access token and set
    return btoa(JSON.stringify({
      ttl,
      address,
      signature: `0x${signature}`
    }))
  }

  public setAccessTokenData = (accessToken: string, ttl: number) => {
    this.accessToken = accessToken
    this.ttl = ttl
  }

  public clearAccessTokenData() {
    this.accessToken = ''
    this.ttl = Number.MAX_SAFE_INTEGER
  }

  public isAccessTokenExpired() {
    return this.ttl < ~~(Date.now() / 1000)
  }

  public async setPositions() {
    this.myPositions = await getPositions(blockchainStore.address)
  }

  public async setChainLinkOracle() {
    this.myChainLinkOracle = (1/Number(Web3.utils.fromWei(await getChainLinkOracle(), 'ether'))).toFixed(2)
  }
}

export default new ApiStore()
