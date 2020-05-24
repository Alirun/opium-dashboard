import {
  createLogger as createBunyanLogger,
  stdSerializers as serializers
} from 'browser-bunyan'
// @ts-ignore
import { ConsoleFormattedStream } from '@browser-bunyan/console-formatted-stream'
import config from '../Constants/Config'


export const logger = (name: string) => {
  const loggerOptions = {
    name: name || 'default',
    streams: [
      {
        stream: new ConsoleFormattedStream({
          css: {
            levels: {
              trace: 'color: DeepPink',
              debug: 'color: GoldenRod',
              info: 'color: DimGray',
              warm: 'color: Purple',
              error: 'color: Crimson',
              fatal: 'color: Black',
            },
            def: 'color: \'#FF6700\'',
            msg: 'color: SteelBlue',
            src: 'color: DimGray; font-style: italic; font-size: 0.9em',
          },
        }),
        level: config.logger.level
      },
    ],
    serializers: {
      err: serializers.err
    }
  }

  return createBunyanLogger(loggerOptions)
}
