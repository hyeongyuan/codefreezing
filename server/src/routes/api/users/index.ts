import { FastifyPluginCallback } from 'fastify'
import { getRepository } from 'typeorm'
import { User } from '@entity/User'
import CustomError from '@lib/CustomError'

const userRoute: FastifyPluginCallback = (fastify, opts, done) => {
  /**
   * GET /api/users
   */
  fastify.get('/', async (request, reply) => {
    if (!request.user) {
      throw new CustomError({
        statusCode: 401,
        name: 'UnauthorizedError',
        message: 'Unauthorized',
      })
    }

    console.log({ hello: request.user.id })

    const user = await getRepository(User).findOne(request.user.id)
    if (!user) {
      throw new CustomError({
        statusCode: 404,
        name: 'NotFoundError',
        message: 'User not found.',
      })
    }
    reply.send({ ...user })
  })

  done()
}

export default userRoute
