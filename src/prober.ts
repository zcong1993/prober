export interface Probe {
  healthy(): void
  notHealthy(err: Error): void
  ready(): void
  notReady(err: Error): void
}
