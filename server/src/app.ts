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
      callback(null, true)
      return
    }
    // Generate an error on other origins, disabling access
    callback(new Error('Not allowed'), false)
  },
})
server.register(cookie)
server.register(jwtPlugin)
server.register(dbPlugin)
server.register(apiRoute, { prefix: '/api' })

server.listen(+PORT, (err) => {
  if (err) {
    server.log.error(err)
    process.exit(1)
  }
})
