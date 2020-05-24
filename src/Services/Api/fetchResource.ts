import config from '../../Constants/Config'

import { logger } from '../../Utils/logger'

const log = logger('fetchResource')

// Custom API error to throw
class ApiError extends Error {
  private _message: string = ''
  private _response: {} = {}
  private _isObject: boolean = false

  constructor(message: string, data: string | {}) {
    super(message)

    // We are trying to parse response
    if (typeof data == 'string') {
      try {
        this._response = JSON.parse(data)
        this._isObject = true
      } catch (e) {}
    } else {
      this._response = data
    }

    this._message = message
    Error.captureStackTrace(this, this.constructor)
  }

  toString = () => `
    ${this._message}
    Response:
    ${this._isObject ? JSON.stringify(this._response, null, 2) : this._response}`
}

type Options = {
  method?: string
  body?: any
  headers?: {}
}

// API wrapper function
export default (path: string, userOptions: Options = {}): Promise<any> => {
  // Define default options
  const defaultOptions: Options = {
    method: 'GET',
  }

  // Define default headers
  const defaultHeaders = {
    'content-type': 'application/json',
  }

  // Merge options
  const options: Options = {
    // Merge default
    ...defaultOptions,

    // Merge options
    ...userOptions,

    // Merge headers
    headers: {
      ...defaultHeaders,
      ...userOptions.headers,
    },
  }

  // Build Url
  const url = `${config.api.endpoint}/${path}`

  // Detect if we are uploading a file
  const isFile = options.body instanceof File

  // Stringify JSON data
  // If body is not a file
  if (options.body && typeof options.body === 'object' && !isFile) {
    options.body = JSON.stringify(options.body)
  }

  // Variable which will be used for storing response
  let response: Response | null = null

  return (
    fetch(url, options)
      .then(_responseObject => {
        // Saving response for later use in lower scopes
        response = _responseObject

        log.info(`${options.method} /${path} | ${response.status}`)

        // HTTP Unauthorized
        if (response.status === 401) {
          throw new Error('Unauthorized')
        }

        // Check for error HTTP error codes
        if (response.status < 200 || response.status >= 300) {
          // Get response as text
          return response.text()
        }

        if (response.status === 201 || response.status === 202) {
          return response.ok
        }

        if (response.status === 204) {
          return {}
        }

        if (response.status === 429) {
          return response.status
        }

        // Get response as json
        return response.json()
      })
      // "parsedResponse" will be either text or javascript object depending if
      // "response.text()" or "response.json()" got called in the upper scope
      .then(parsedResponse => {
        // Check for HTTP error codes
        if (response && (response.status < 200 || response.status >= 300)) {
          // Throw error
          throw parsedResponse
        }

        // Request succeeded
        return parsedResponse
      })
      .catch(error => {
        // Handle generic error
        if (!response) {
          throw new ApiError(error.toString(), {})
        }

        throw new ApiError(
          `Request failed with status ${response.status}`,
          error
        )
      })
  )
}
