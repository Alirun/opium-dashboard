import { observable } from 'mobx'

// Utils
// import { logger } from '../../Utils/logger'

// ApiService
import {
  meta, MetaConfigResponse,
  auth,
  wallet, WalletBalanceResponse,
  MyPosition, getPositions
} from './Requests'

// const log = logger('ApiStore')

export class ApiStore {
  @observable public meta: MetaConfigResponse | null = null
  @observable public balance: WalletBalanceResponse | null = null

  @observable public accessToken: string = ''
  @observable public ttl: number = Number.MAX_SAFE_INTEGER

  @observable public myPositions: MyPosition[] | null = null

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
    this.myPositions = await getPositions()
  }
}

export default new ApiStore()
