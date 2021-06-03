import fastify from 'fastify'
import cors from 'fastify-cors'
import db from '@decorators/db'
import apiRoute from '@routes/api'

const PORT = process.env.PORT || '3000'

const server = fastify({ logger: true })

server.register(cors, {
  origin: (origin, callback) => {
    if (!origin || /localhost/.test(origin)) {
      callback(null, true)
      return
    }
    // Generate an error on other origins, disabling access
    callback(new Error('Not allowed'), false)
  },
})
server.register(db)
server.register(apiRoute, { prefix: '/api' })

server.listen(+PORT, (err) => {
  if (err) {
    server.log.error(err)
    process.exit(1)
  }
})
