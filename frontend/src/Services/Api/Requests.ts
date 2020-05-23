// ApiService
import fetchResource from './fetchResource'

// Constants
import { EIP712Message } from '../../Constants/Types/blockchain'

// Meta
export type SupportedToken = {
  title: string
  address: string
  decimals: number
}

export type MetaConfigResponse = {
  networkId: number
  supportedTokens: SupportedToken[]
  opiumContracts: {
    TokenSpender: string
  }
}

export const meta = {
  get: (): Promise<MetaConfigResponse> =>
    fetchResource('meta/config'),
}

// Wallet
type BalanceToken = {
  title: string
  address: string
  decimals: number
  total: string
  allowance: string
}

export type WalletBalanceResponse = {
  eth: string
  tokens: BalanceToken[]
}

export const wallet = {
  get: (accessToken: string): Promise<WalletBalanceResponse> =>
    fetchResource('wallet/balance', {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    }),
}

// Auth
type AuthLoginDataResponse = {
  ttl: number
  data: EIP712Message
}

export const auth = {
  get: (): Promise<AuthLoginDataResponse> =>
    fetchResource('auth/loginData'),
}
