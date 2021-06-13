import { FastifyPluginCallback } from 'fastify'
import { getManager, getRepository } from 'typeorm'
import { customAlphabet } from 'nanoid'
import CustomError from '@lib/CustomError'
import { Post } from '@entity/Post'
import { Tag } from '@entity/Tag'
import { PostsTags } from '@entity/PostsTags'
import { User } from '@entity/User'
import { escapeForUrl } from '@lib/utils'
import { fetchPostWithTags } from './query'

const nanoid = customAlphabet('abcdefghijklmnopqrstuvwxyz1234567890', 10)

interface IPostBody {
  title: string
  language: string
  code: string
  tags: string[]
  isPrivate: boolean
}

interface IPostParams {
  username: string
  url_slug: string
}

const postsRoute: FastifyPluginCallback = (fastify, opts, done) => {
  /**
   * GET /api/posts
   */
  fastify.get('/', async (request, reply) => {
    const posts = await getRepository(Post).find({
      relations: ['user'],
      where: {
        is_private: false,
      },
    })

    return posts
  })
  /**
   * GET /api/posts/:username/:url_slug
   */
  fastify.get<{ Params: IPostParams }>(
    '/:username/:url_slug',
    async (request, reply) => {
      const { username, url_slug } = request.params
      try {
        const post = await fetchPostWithTags({ username, urlSlug: url_slug })
        if (!post) {
          throw new CustomError({
            statusCode: 404,
            message: 'Post does not exist',
            name: 'NotFoundError',
          })
        }
        console.log(post)
        reply.send(post)
      } catch (e) {
        throw e
      }
    },
  )
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

    // Generate url slug
    let processedUrlSlug = escapeForUrl(title)
    const urlSlugDuplicate = await postRepo.findOne({
      where: {
        user,
        url_slug: processedUrlSlug,
      },
    })
    if (urlSlugDuplicate) {
      const randomString = nanoid()
      processedUrlSlug += `-${randomString}`
    }
    post.url_slug = processedUrlSlug

    const tagsData = await Promise.all(tags.map(Tag.findOrCreate))
    await postRepo.save(post)

    await PostsTags.syncPostTags(post.id, tagsData)

    post.tags = tagsData

    return post
  })

  done()
}
export default postsRoute
