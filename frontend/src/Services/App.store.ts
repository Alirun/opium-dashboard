// Utils
import { logger } from '../Utils/logger'

// Services
import blockchain from './Blockchain/Blockchain.store'
import api from './Api/Api.store'
import auth from './Auth/Auth.store'

const log = logger('AppStore')

export class AppStore {
  public blockchain = blockchain
  public api = api
  public auth = auth
}

export default new AppStore()
