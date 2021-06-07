import { FastifyPluginCallback } from 'fastify'
import authRoute from '@routes/api/auth'
import postRoute from '@routes/api/posts'
import userRoute from '@routes/api/users'

const apiRoute: FastifyPluginCallback = (fastify, opts, done) => {
  fastify.register(authRoute, { prefix: '/auth' })
  fastify.register(postRoute, { prefix: '/posts' })
  fastify.register(userRoute, { prefix: '/users' })
  done()
}

export default apiRoute
