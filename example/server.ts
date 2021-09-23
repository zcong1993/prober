import http from 'http'
import { Server, ServerCredentials } from '@grpc/grpc-js'
import { service } from '@zcong/node-grpc-health-check'
import { register } from 'prom-client'
import { GrpcProbe, InstrumentationProbe, HttpProbe, Combine } from '../src'

const startGrpcServer = async (probe: GrpcProbe) => {
  const grpcServer = new Server()
  grpcServer.addService(service, probe.healthServer)
  return new Promise<void>((resolve) => {
    grpcServer.bindAsync(
      '0.0.0.0:8080',
      ServerCredentials.createInsecure(),
      () => {
        grpcServer.start()
        console.log('grpc server start on 0.0.0.0:8080')
        resolve()
      }
    )
  })
}

const main = async () => {
  const grpcProbe = new GrpcProbe()
  const httpProbe = new HttpProbe()
  const instrumentation = new InstrumentationProbe(undefined, console)
  const combine = new Combine(grpcProbe, httpProbe, instrumentation)

  await startGrpcServer(grpcProbe)

  const createHttpServer = async () => {
    const httpServer = http.createServer(async (req, res) => {
      switch (req.url) {
        case '/health': {
          httpProbe.healthyHandler()(req, res)
          break
        }
        case '/ready': {
          httpProbe.readyHandler()(req, res)
          break
        }
        case '/metrics': {
          res.setHeader('Content-Type', register.contentType)
          res.end(await register.metrics())
          break
        }
        default: {
          res.end(req.url)
        }
      }
    })
    return new Promise<void>((resolve) => {
      httpServer.listen(3000, () => {
        console.log('http server start on localhost:3000')
        resolve()
      })
    })
  }

  await createHttpServer()
  combine.healthy()
  combine.ready()

  let flag = -1

  setInterval(() => {
    const e = new Error('test error')
    if (flag < 0) {
      combine.notReady(e)
      combine.notHealthy(e)
    } else {
      combine.healthy()
      combine.ready()
    }
    flag *= -1
  }, 5000)
}

main()
