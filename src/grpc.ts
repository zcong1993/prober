import { Implementation, ServingStatus } from '@zcong/node-grpc-health-check'
import { Probe } from './prober'

export class GrpcProbe implements Probe {
  private implementation: InstanceType<typeof Implementation>
  constructor() {
    this.implementation = new Implementation({ '': ServingStatus.NOT_SERVING })
  }

  get healthServer() {
    return this.implementation
  }

  ready() {
    this.implementation.setStatus('', ServingStatus.SERVING)
  }

  notReady(_err: Error) {
    this.implementation.setStatus('', ServingStatus.NOT_SERVING)
  }

  healthy() {
    this.implementation.resume()
  }

  notHealthy(_err: Error) {
    this.implementation.shutdown()
  }
}
