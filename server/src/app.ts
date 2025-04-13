import 'dotenv/config'
import 'reflect-metadata'

import fastify from 'fastify'
import cors from 'fastify-cors'
import cookie from 'fastify-cookie'
import apiRoute from '@routes/api'
import jwtPlugin from '@plugins/jwtPlugin'
import dbPlugin from '@plugins/dbPlugin'

const PORT = process.env.PORT || '3000'

const server = fastify({ logger: true })

server.register(cors, {
  origin: (origin, callback) => {
    if (!origin || /localhost/.test(origin)) {
      return callback(null, true)
    }
    const host = origin.split('://')[1]
    const allowedHost = ['158.247.216.118']

    const allowed = allowedHost.includes(host)
    callback(null, allowed)
  },
})
server.register(cookie)
server.register(jwtPlugin)
server.register(dbPlugin)
server.register(apiRoute, { prefix: '/api' })

server.listen(+PORT, '0.0.0.0', (err) => {
  if (err) {
    server.log.error(err)
    process.exit(1)
  }
})
