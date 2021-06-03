import fastify from 'fastify'
import db from '@decorators/db'
import apiRoute from '@routes/api'

const PORT = process.env.PORT || '3000'

const server = fastify({ logger: true })

server.register(db)
server.register(apiRoute, { prefix: '/api' })

server.listen(+PORT, (err) => {
  if (err) {
    server.log.error(err)
    process.exit(1)
  }
})
