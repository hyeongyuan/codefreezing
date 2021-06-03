import { FastifyPluginCallback } from 'fastify'
import { getRepository } from 'typeorm'
import CustomError from '@lib/CustomError'
import { Post } from '@entity/Post'
import { Tag } from '@entity/Tag'
import { PostsTags } from '@entity/PostsTags'

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
  fastify.post<{ Body: { title: string; code: string; tags: string[] } }>(
    '/',
    async (request, reply) => {
      const { body } = request

      const postRepo = getRepository(Post)

      const post = new Post()
      post.title = body.title
      post.code = body.code

      const tagsData = await Promise.all(body.tags.map(Tag.findOrCreate))
      await postRepo.save(post)

      await PostsTags.syncPostTags(post.id, tagsData)

      post.tags = tagsData

      return post.serialize()
    },
  )

  done()
}
export default postsRoute
