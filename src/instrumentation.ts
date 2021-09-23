import type * as PromType from 'prom-client'
import { Probe } from './prober'
import { loadPackage } from './util'

const ready = 'ready'
const healthy = 'healthy'

export interface Logger {
  info(msg: string): void
  warn(msg: string): void
}

export class InstrumentationProbe implements Probe {
  private prom: typeof PromType
  private status: PromType.Gauge<'check'>
  constructor(reg?: PromType.Registry, private readonly logger?: Logger) {
    this.prom = loadPackage<typeof PromType>(
      'prom-client',
      'InstrumentationProbe'
    )
    this.status = new this.prom.Gauge({
      name: 'status',
      help: 'Represents status (0 indicates failure, 1 indicates success) of the component.',
      labelNames: ['check'],
      registers: reg ? [reg] : undefined,
    })
  }

  ready() {
    this.status.labels(ready).set(1)

    if (this.logger) {
      this.logger.info('changing probe status: ready')
    }
  }

  notReady(err: Error) {
    this.status.labels(ready).set(0)

    if (this.logger) {
      this.logger.warn(`changing probe status: ready, error: ${err.message}`)
    }
  }

  healthy() {
    this.status.labels(healthy).set(1)

    if (this.logger) {
      this.logger.info('changing probe status: healthy')
    }
  }

  notHealthy(err: Error) {
    this.status.labels(healthy).set(0)

    if (this.logger) {
      this.logger.info(
        `changing probe status: not-healthy, error: ${err.message}`
      )
    }
  }
}
