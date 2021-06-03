import { FastifyPluginCallback } from 'fastify'
import { getRepository } from 'typeorm'
import CustomError from '@lib/CustomError'
import { Post } from '@entity/Post'

const postsRoute: FastifyPluginCallback = (fastify, opts, done) => {
  /**
   * GET /api/posts
   */
  fastify.get('/', async (request, reply) => {
    return [
      {
        id: 1,
        title: 'hello',
        code: "function hello () { return 'world'; }",
      },
    ]
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
  fastify.post<{ Body: any }>('/', async (request, reply) => {
    const { body } = request
    console.log(body)
    return 'hello'
  })

  done()
}
export default postsRoute
