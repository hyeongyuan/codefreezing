import { FastifyPluginCallback } from 'fastify'
import postRoute from '@routes/api/posts'

const apiRoute: FastifyPluginCallback = (fastify, opts, done) => {
  fastify.register(postRoute, { prefix: '/posts' })
  done()
}

export default apiRoute
