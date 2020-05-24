import Web3 from 'web3'
import { Contract } from 'web3-eth-contract'
import { AbiItem } from 'web3-utils'

import IERC20_ABI from '../../../Constants/ABI/IERC20.json'

import blockchain from './Blockchain'

import { logger } from '../../../Utils/logger'

const MAX_UINT256 = '0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff'

export default class SmartContract {
  protected _web3: Web3
  protected _contract: Contract
  protected _log: any

  constructor(jsonInterface: AbiItem[], address: string) {
    const web3 = blockchain.getWeb3()
    if (web3 === null) {
      throw new Error('Web3 is not initialized')
    }

    this._web3 = web3
    this._contract = new web3.eth.Contract(jsonInterface, address)
    this._log = logger(`Contract (${address})`)
  }
}

export class IERC20 extends SmartContract {
  constructor(address: string) {
    super(IERC20_ABI as AbiItem[], address)
  }

  public approve(spender: string, confirmationCallback: () => void) {
    return new Promise((resolve, reject) => {
      const tx = this._contract.methods.approve(spender, MAX_UINT256).send({ from: blockchain.address })
      let confirmationSent = false

      tx.on('confirmation', () => {
        if (!confirmationSent) {
          confirmationCallback()
          confirmationSent = true
        }
      })
      tx.on('transactionHash', resolve)
      tx.on('error', reject)
    })
  }
}
