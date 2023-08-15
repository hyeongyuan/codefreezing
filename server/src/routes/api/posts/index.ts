import { FastifyPluginCallback } from 'fastify'
import { getRepository } from 'typeorm'
import { customAlphabet } from 'nanoid'
import CustomError from '@lib/CustomError'
import { Post } from '@entity/Post'
import { Tag } from '@entity/Tag'
import { PostsTags } from '@entity/PostsTags'
import { PostLike } from '@entity/PostLike'
import { User } from '@entity/User'
import { escapeForUrl } from '@lib/utils'
import withAuth from '@handler/withAuth'
import { fetchPostWithTagsById, fetchPostWithTags } from './query'

const nanoid = customAlphabet('abcdefghijklmnopqrstuvwxyz1234567890', 10)

interface IPostBody {
  title: string
  description: string
  filename: string
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
    try {
      const posts = await getRepository(Post).find({
        relations: ['user'],
        where: {
          is_private: false,
        },
      })
      reply.send(posts)
    } catch (e) {
      throw e
    }
  })
  /**
   * POST /api/posts
   */
  fastify.post<{ Body: IPostBody }>(
    '/',
    { preHandler: [withAuth] },
    async (request, reply) => {
      const user = await getRepository(User).findOne(request.user?.id)
      if (!user) {
        throw new CustomError({
          statusCode: 404,
          name: 'NotFoundError',
          message: 'User not found.',
        })
      }

      const { title, description, filename, code, tags, isPrivate } =
        request.body

      const postRepo = getRepository(Post)

      const post = new Post()
      post.title = title
      post.description = description ? description : null
      post.filename = filename
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

      const uniqueTags = Array.from(new Set(tags))
      const tagsData = await Promise.all(uniqueTags.map(Tag.findOrCreate))
      await postRepo.save(post)

      await PostsTags.syncPostTags(post.id, tagsData)

      post.tags = tagsData

      reply.status(201).send(post)
    },
  )
  /**
   * GET /api/posts/:id
   */
  fastify.get<{ Params: { id: string } }>('/:id', async (request, reply) => {
    const { id } = request.params
    try {
      const post = await fetchPostWithTagsById(id)
      if (!post) {
        throw new CustomError({
          statusCode: 404,
          message: 'Post does not exist',
          name: 'NotFoundError',
        })
      }
      reply.send(post)
    } catch (e) {
      throw e
    }
  })
  /**
   * PUT /api/posts/:id
   */
  fastify.put<{ Params: { id: string }; Body: IPostBody }>(
    '/:id',
    { preHandler: [withAuth] },
    async (request, reply) => {
      const { id } = request.params
      const { title, description, filename, code, tags, isPrivate } =
        request.body
      try {
        const postRepo = getRepository(Post)
        const post = await postRepo.findOne(id, {
          relations: ['user'],
        })
        if (!post) {
          throw new CustomError({
            statusCode: 404,
            message: 'Post does not exist',
            name: 'NotFoundError',
          })
        }
        if (post.user.id !== request.user?.id) {
          throw new CustomError({
            statusCode: 403,
            message: 'No permission.',
            name: 'ForbiddenError',
          })
        }

        post.title = title
        post.description = description ? description : null
        post.filename = filename
        post.code = code
        post.is_private = isPrivate

        const uniqueTags = Array.from(new Set(tags))
        const tagsData = await Promise.all(uniqueTags.map(Tag.findOrCreate))
        await Promise.all([
          PostsTags.syncPostTags(post.id, tagsData),
          getRepository(Post).save(post),
        ])
        post.tags = tagsData

        reply.send(post)
      } catch (e) {
        throw e
      }
    },
  )
  /**
   * DELETE /api/posts/:id
   */
  fastify.delete<{ Params: { id: string } }>(
    '/:id',
    { preHandler: [withAuth] },
    async (request, reply) => {
      const { id } = request.params
      try {
        const postRepo = getRepository(Post)
        const post = await postRepo.findOne(id, {
          relations: ['user'],
        })
        if (!post) {
          throw new CustomError({
            statusCode: 404,
            message: 'Post does not exist.',
            name: 'NotFoundError',
          })
        }
        if (post.user.id !== request.user?.id) {
          throw new CustomError({
            statusCode: 403,
            message: 'No permission.',
            name: 'ForbiddenError',
          })
        }

        await postRepo.remove(post)

        reply.status(204)
      } catch (e) {
        throw e
      }
    },
  )
  /**
   * POST /api/posts/:id/like
   */
  fastify.post<{ Params: { id: string } }>(
    '/:id/like',
    { preHandler: [withAuth] },
    async (request, reply) => {
      const { id } = request.params
      try {
        // Find post
        const postRepo = getRepository(Post)
        const post = await postRepo.findOne(id)
        if (!post) {
          throw new CustomError({
            statusCode: 404,
            message: 'Post does not exist',
            name: 'NotFoundError',
          })
        }

        // Check already liked
        const postLikeRepo = getRepository(PostLike)
        const alreadyLiked = await postLikeRepo.findOne({
          where: {
            post_id: id,
            user_id: request.user?.id,
          },
        })

        if (alreadyLiked) {
          reply.send({ ...post, liked: true })
          return
        }

        const postLike = new PostLike()
        postLike.post_id = id
        postLike.user_id = request.user?.id as string

        await postLikeRepo.save(postLike)

        const count = await postLikeRepo.count({ where: { post_id: id } })
        post.likes = count
        await postRepo.save(post)

        reply.send({ ...post, liked: true })
      } catch (e) {
        throw e
      }
    },
  )
  /**
   * POST /api/posts/:id/like
   */
  fastify.post<{ Params: { id: string } }>(
    '/:id/unlike',
    { preHandler: [withAuth] },
    async (request, reply) => {
      const { id } = request.params
      try {
        // Find post
        const postRepo = getRepository(Post)
        const post = await postRepo.findOne(id)
        if (!post) {
          throw new CustomError({
            statusCode: 404,
            message: 'Post does not exist',
            name: 'NotFoundError',
          })
        }

        // Check already liked
        const postLikeRepo = getRepository(PostLike)
        const postLike = await postLikeRepo.findOne({
          where: {
            post_id: id,
            user_id: request.user?.id,
          },
        })

        if (!postLike) {
          reply.send({ ...post, liked: false })
          return
        }

        await postLikeRepo.remove(postLike)

        const count = await postLikeRepo.count({ where: { post_id: id } })
        post.likes = count
        await postRepo.save(post)

        reply.send({ ...post, liked: false })
      } catch (e) {
        throw e
      }
    },
  )
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
        let liked = false
        if (request.user) {
          const postLike = await getRepository(PostLike).findOne({
            post_id: post.id,
            user_id: request.user.id,
          })
          console.log({ postLike })
          liked = !!postLike
        }
        reply.send({ ...post, liked })
      } catch (e) {
        throw e
      }
    },
  )
  done()
}
export default postsRoute
