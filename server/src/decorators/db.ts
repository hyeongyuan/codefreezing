import fp from 'fastify-plugin'
import { createConnection, getConnectionOptions } from 'typeorm'
import { Post } from '@entity/Post'
import { Tag } from '@entity/Tag'
import { PostsTags } from '@entity/PostsTags'
import { User } from '@entity/User'
import { SocialAccount } from '@entity/SocialAccount'

export default fp(async (fastify) => {
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
})
