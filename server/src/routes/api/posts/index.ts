import { FastifyPluginCallback } from 'fastify'
import { getRepository, getManager } from 'typeorm'
import CustomError from '@lib/CustomError'
import { Post } from '@entity/Post'

const postsRoute: FastifyPluginCallback = (fastify, opts, done) => {
  /**
   * GET /api/posts
   */
  fastify.get('/', async (request, reply) => {
    const posts = await getRepository(Post).find()

    return posts.map((post) => post.serialize())
  })
  /**
   * GET /api/posts/:id
   */
  fastify.get<{ Params: { id: string } }>('/:id', async (request, reply) => {
    const parsedId = parseInt(request.params.id)
    const post = await getRepository(Post).findOne(parsedId)
    if (!post) {
      throw new CustomError({
        statusCode: 404,
        message: 'Post does not exist',
        name: 'NotFoundError',
      })
    }
    return post
  })
  /**
   * POST /api/posts
   */
  fastify.post<{ Body: { title: string; code: string } }>(
    '/',
    async (request, reply) => {
      const { body } = request

      const post = new Post()
      post.title = body.title
      post.code = body.code

      const manager = getManager()
      await manager.save(post)

      return post.serialize()
    },
  )

  done()
}
export default postsRoute
