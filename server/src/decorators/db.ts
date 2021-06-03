import 'reflect-metadata'

import fp from 'fastify-plugin'
import { createConnection, getConnectionOptions } from 'typeorm'
import { Post } from '@entity/Post'
import { Tag } from '@entity/Tag'
import { PostsTags } from '@entity/PostsTags'

export default fp(async (fastify) => {
  try {
    const connectionOptions = await getConnectionOptions()
    const connection = await createConnection(connectionOptions)

    fastify.decorate('db', {
      posts: connection.getRepository(Post),
      tags: connection.getRepository(Tag),
      posts_tags: connection.getRepository(PostsTags),
    })
  } catch (error) {
    console.log(error)
  }
})
