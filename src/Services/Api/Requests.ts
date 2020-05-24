// ApiService
import fetchResource from './fetchResource'
import config from '../../Constants/Config'
// Constants
import { EIP712Message } from '../../Constants/Types/blockchain'
import axios from 'axios'

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


// theGraph

enum PositionType {
  SHORT = 'SHORT',
  LONG = 'LONG'
}

type TokenId = {
  id: string
  type: PositionType
  ticker: { id: string } | null
}
export type MyPosition = {
  amount: string
  tokenId: TokenId
}


export const getPositions = async (address: string) => {
  const query = `
    { 
      user(id: "${address}") {
        positions {
          tokenId {
            id
            type
            ticker {
              id
            }
          }
          amount
        }
      }
    }
    `

  const res = await axios.post(config.api.theGraphOpiumEndpoint, {query})
  if ( res.data.data.user ) {
    return res.data.data.user.positions
  }
  return
}

export const getChainLinkOracle = async () => {
  const query = `
  {
    updatedAnswers(
      where: { contract: "0x037e8f2125bf532f3e228991e051c8a7253b642c"}
      orderBy: roundId,
      orderDirection: desc
    ) {
      current
    }
  }
  `
  const res = await axios.post(config.api.theGraphChainLinkEndpoint, {query})
  return res.data.data.updatedAnswers[0].current
}
