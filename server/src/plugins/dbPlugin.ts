import { FastifyPluginCallback } from 'fastify'
import fp from 'fastify-plugin'
import { createConnection, getConnectionOptions } from 'typeorm'
import { Post } from '@entity/Post'
import { Tag } from '@entity/Tag'
import { PostsTags } from '@entity/PostsTags'
import { User } from '@entity/User'
import { SocialAccount } from '@entity/SocialAccount'

const callback: FastifyPluginCallback = async (fastify) => {
  try {
    const connectionOptions = await getConnectionOptions()
    const connection = await createConnection(connectionOptions)

    fastify.decorate('db', {
      posts: connection.getRepository(Post),
      tags: connection.getRepository(Tag),
      posts_tags: connection.getRepository(PostsTags),
      users: connection.getRepository(User),
      social_accounts: connection.getRepository(SocialAccount),
    })
  } catch (error) {
    console.log(error)
  }
}

const dbPlugin = fp(callback, {
  name: 'dbPlugin',
})

export default dbPlugin
