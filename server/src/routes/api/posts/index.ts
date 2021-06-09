import { FastifyPluginCallback } from 'fastify'
import { getRepository } from 'typeorm'
import CustomError from '@lib/CustomError'
import { Post } from '@entity/Post'
import { Tag } from '@entity/Tag'
import { PostsTags } from '@entity/PostsTags'
import { User } from '@entity/User'

interface IPostBody {
  title: string
  language: string
  code: string
  tags: string[]
  isPrivate: boolean
}

const postsRoute: FastifyPluginCallback = (fastify, opts, done) => {
  /**
   * GET /api/posts
   */
  fastify.get('/', async (request, reply) => {
    const posts = await getRepository(Post).find({
      where: {
        is_private: false,
      },
    })

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
  fastify.post<{ Body: IPostBody }>('/', async (request, reply) => {
    if (!request.user) {
      throw new CustomError({
        statusCode: 401,
        name: 'UnauthorizedError',
        message: 'Unauthorized',
      })
    }

    const user = await getRepository(User).findOne(request.user.id)
    if (!user) {
      throw new CustomError({
        statusCode: 404,
        name: 'NotFoundError',
        message: 'User not found.',
      })
    }

    const { title, language, code, tags, isPrivate } = request.body

    const postRepo = getRepository(Post)

    const post = new Post()
    post.title = title
    post.language = language
    post.code = code
    post.is_private = isPrivate
    post.user = user

    const tagsData = await Promise.all(tags.map(Tag.findOrCreate))
    await postRepo.save(post)

    await PostsTags.syncPostTags(post.id, tagsData)

    post.tags = tagsData

    return post.serialize()
  })

  done()
}
export default postsRoute
