import { FastifyPluginCallback } from 'fastify'
import { getManager, getRepository } from 'typeorm'
import socialRoute from '@routes/api/auth/social'
import { decodeToken } from '@lib/auth'
import { User } from '@entity/User'
import { DecodedToken, SocialRegisterToken } from '@types'
import CustomError from '@lib/CustomError'
import { SocialAccount } from '@entity/SocialAccount'

interface IRegister {
  Body: {
    email: string
    username: string
  }
}

const authRoute: FastifyPluginCallback = (fastify, opts, done) => {
  fastify.register(socialRoute, { prefix: '/social' })
  /**
   * GET /api/auth/refresh
   * Issue access_token using refresh_token
   */
  fastify.get('/refresh', async (request, reply) => {
    const refreshTokne: string | undefined = request.cookies['refresh_token']
    if (!refreshTokne) {
      throw new CustomError({
        statusCode: 401,
        message: "'refresh_token' cookie is empty.",
        name: 'UnauthorizedError',
      })
    }
    try {
      const decoded = await decodeToken<DecodedToken>(refreshTokne)
      const user = await getRepository(User).findOne(decoded.userId)
      if (!user) {
        throw new CustomError({
          statusCode: 404,
          name: 'NotFoundError',
          message: 'User not found.',
        })
      }

      const { accessToken } = await user.generateToken()

      reply.send({ accessToken, user })
    } catch (error) {
      throw error
    }
  })
  /**
   * POST /api/auth/register
   * Register
   */
  fastify.post<IRegister>('/register', async (request, reply) => {
    const registerToken: string | undefined = request.cookies['register_token']
    if (!registerToken) {
      throw new CustomError({
        statusCode: 401,
        message: "'register_token' cookie is empty.",
        name: 'UnauthorizedError',
      })
    }
    const { email, username } = request.body
    try {
      const decoded = await decodeToken<SocialRegisterToken>(registerToken)

      const manager = getManager()

      manager.transaction('SERIALIZABLE', async (entityManager) => {
        const user = new User()
        user.email = email
        user.username = username
        await entityManager.save(user)

        const socialAccount = new SocialAccount()
        socialAccount.provider = decoded.provider
        socialAccount.social_id = decoded.profile.id.toString()
        socialAccount.user = user
        await entityManager.save(socialAccount)

        reply.status(201).send(user)
      })
    } catch (e) {
      throw new CustomError({
        statusCode: 401,
        message: 'Fail to decode token',
        name: 'UnauthorizedError',
      })
    }
  })
  /**
   * POST /api/auth/logout
   * Issue access_token using refresh_token
   */
  fastify.post('/logout', async (request, reply) => {
    reply.clearCookie('refresh_token', { path: '/' })
    reply.status(204).send()
  })
  done()
}

export default authRoute
