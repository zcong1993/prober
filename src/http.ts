import type { RequestListener } from 'http'
import { Probe } from './prober'

export class HttpProbe implements Probe {
  private isReady = false
  private isHealthy = false

  readyHandler() {
    return this.createHttpHandler('ready')
  }

  healthyHandler() {
    return this.createHttpHandler('healthy')
  }

  ready() {
    this.isReady = true
  }

  notReady(_err: Error) {
    this.isReady = false
  }

  healthy() {
    this.isHealthy = true
  }

  notHealthy(_err: Error) {
    this.isHealthy = false
  }

  private createHttpHandler(type: 'ready' | 'healthy'): RequestListener {
    return (_req, res) => {
      const status = type === 'ready' ? this.isReady : this.isHealthy

      if (!status) {
        res.writeHead(503)
        res.end('NOT OK')
      } else {
        res.end('OK')
      }
    }
  }
}
