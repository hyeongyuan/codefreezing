import { FastifyPluginCallback } from 'fastify'
import { getRepository } from 'typeorm'
import { User } from '@entity/User'
import { Post } from '@entity/Post'
import withAuth from '@handler/withAuth'
import CustomError from '@lib/CustomError'

const userRoute: FastifyPluginCallback = (fastify, opts, done) => {
  /**
   * GET /api/users
   */
  fastify.get('/', { preHandler: [withAuth] }, async (request, reply) => {
    const user = await getRepository(User).findOne(request.user?.id)
    if (!user) {
      throw new CustomError({
        statusCode: 404,
        name: 'NotFoundError',
        message: 'User not found.',
      })
    }
    reply.send(user)
  })
  /**
   * GET /api/users/:username
   */
  fastify.get<{ Params: { username: string } }>(
    '/:username',
    async (request, reply) => {
      const { username } = request.params
      const user = await getRepository(User).findOne({ username })
      if (!user) {
        throw new CustomError({
          statusCode: 404,
          name: 'NotFoundError',
          message: 'User not found.',
        })
      }
      reply.send({ ...user })
    },
  )
  /**
   * GET /api/users/:id/posts
   */
  fastify.get<{ Params: { id: string } }>(
    '/:id/posts',
    async (request, reply) => {
      const { id } = request.params
      try {
        const posts = await getRepository(Post)
          .createQueryBuilder('posts')
          .leftJoinAndSelect('posts.user', 'user')
          .where('user.id = :id', { id })
          .getMany()

        reply.send(posts)
      } catch (e) {
        throw e
      }
    },
  )
  done()
}

export default userRoute
