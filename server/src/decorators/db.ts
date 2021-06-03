import 'reflect-metadata'

import fp from 'fastify-plugin'
import { createConnection, getConnectionOptions } from 'typeorm'
import { Post } from '@entity/Post'

export default fp(async (fastify) => {
  try {
    const connectionOptions = await getConnectionOptions()
    const connection = await createConnection(connectionOptions)

    fastify.decorate('db', {
      post: connection.getRepository(Post),
    })
  } catch (error) {
    console.log(error)
  }
})
