import { decodeToken } from '@lib/auth'
import { FastifyPluginCallback } from 'fastify'
import fp from 'fastify-plugin'

interface UserTokenDecoded {
  subject: string
  userId: number
  iat: number
  exp: number
}

const callback: FastifyPluginCallback = async (fastify, opts, done) => {
  fastify.decorateRequest('user', null)
  fastify.addHook('preHandler', async (request, reply) => {
    const accessToken: string | undefined = request.cookies.access_token
    try {
      const decoded = await decodeToken<UserTokenDecoded>(accessToken)
      request.user = {
        id: decoded.userId,
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
    user: null | { id: number }
  }
}

export default jwtPlugin
