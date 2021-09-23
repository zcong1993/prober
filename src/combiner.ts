import { Probe } from './prober'

export class Combine implements Probe {
  private readonly probes: Probe[]
  constructor(...probes: Probe[]) {
    this.probes = probes
  }

  ready() {
    for (const p of this.probes) {
      p.ready()
    }
  }

  notReady(err: Error) {
    for (const p of this.probes) {
      p.notReady(err)
    }
  }

  healthy() {
    for (const p of this.probes) {
      p.healthy()
    }
  }

  notHealthy(err: Error) {
    for (const p of this.probes) {
      p.notHealthy(err)
    }
  }
}
