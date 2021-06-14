import { decodeToken } from '@lib/auth'
import { FastifyPluginCallback } from 'fastify'
import fp from 'fastify-plugin'

interface UserTokenDecoded {
  subject: string
  user_id: string
  iat: number
  exp: number
}

const callback: FastifyPluginCallback = async (fastify, opts, done) => {
  fastify.decorateRequest('user', null)
  fastify.addHook('preHandler', async (request, reply) => {
    try {
      const [type, accessToken] =
        request.headers.authorization?.split(' ') || []

      if (type === 'Bearer' && accessToken) {
        const decoded = await decodeToken<UserTokenDecoded>(accessToken)
        request.user = {
          id: decoded.user_id,
        }
      }
    } catch (e) {}
  })
  done()
}

const jwtPlugin = fp(callback, {
  name: 'jwtPlugin',
})

declare module 'fastify' {
  interface FastifyRequest {
    user: null | { id: string }
  }
}

export default jwtPlugin
