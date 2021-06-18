import { FastifyPluginCallback } from 'fastify'
import { getManager, getRepository } from 'typeorm'
import socialRoute from '@routes/api/auth/social'
import { decodeToken } from '@lib/auth'
import { User } from '@entity/User'
import { DecodedToken, SocialRegisterToken } from '@types'
import CustomError from '@lib/CustomError'
import { SocialAccount } from '@entity/SocialAccount'
import withAuth from '@handler/withAuth'

interface IRegisterBody {
  email: string
  username: string
  thumbnail: string | null
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
      reply.status(401).send({
        statusCode: 401,
        error: 'Unauthorized',
        message: '"refresh_token" cookie is empty.',
      })
      return
    }
    try {
      const decoded = await decodeToken<DecodedToken>(refreshTokne)
      const user = await getRepository(User).findOne(decoded.user_id)
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
  fastify.post<{ Body: IRegisterBody }>('/register', async (request, reply) => {
    const registerToken: string | undefined = request.cookies['register_token']
    if (!registerToken) {
      throw new CustomError({
        statusCode: 401,
        message: "'register_token' cookie is empty.",
        name: 'UnauthorizedError',
      })
    }
    const { email, username, thumbnail } = request.body
    try {
      const decoded = await decodeToken<SocialRegisterToken>(registerToken)

      const exists = await getRepository(User)
        .createQueryBuilder()
        .where('email = :email OR username = :username', { email, username })
        .getOne()
      if (exists) {
        throw new CustomError({
          statusCode: 409,
          message: 'already exists email or username',
          name: 'ConflictError',
        })
      }

      const manager = getManager()
      const user = await manager.transaction(
        'SERIALIZABLE',
        async (entityManager) => {
          const user = new User()
          user.email = email
          user.username = username
          user.thumbnail = thumbnail ? thumbnail : null
          await entityManager.save(user)

          const socialAccount = new SocialAccount()
          socialAccount.provider = decoded.provider
          socialAccount.social_id = decoded.profile.id.toString()
          socialAccount.user = user
          await entityManager.save(socialAccount)

          return user
        },
      )
      // register_token 쿠키 제거
      reply.clearCookie('register_token', { path: '/' })

      // refresh_token 쿠키 등록
      const { refreshToken } = await user.generateToken()
      reply.setCookie('refresh_token', refreshToken, {
        path: '/',
        httpOnly: true,
        maxAge: 60 * 60 * 24 * 15,
      })

      reply.status(201).send(user)
    } catch (e) {
      throw e
    }
  })
  /**
   * DELETE /api/auth/unregister
   * Register
   */
  fastify.delete(
    '/unregister',
    { preHandler: [withAuth] },
    async (request, reply) => {
      try {
        const userRepo = getRepository(User)
        const user = await userRepo.findOne(request.user?.id)
        if (!user) {
          throw new CustomError({
            statusCode: 404,
            name: 'NotFoundError',
            message: 'User not found.',
          })
        }
        reply.clearCookie('refresh_token', { path: '/' })
        await userRepo.remove(user)
        reply.status(204)
      } catch (e) {
        throw e
      }
    },
  )
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
