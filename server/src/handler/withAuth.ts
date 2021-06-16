import { FastifyError, FastifyReply, FastifyRequest } from 'fastify'
import CustomError from '@lib/CustomError'

const withAuth = (
  request: FastifyRequest,
  reply: FastifyReply,
  done: (err?: FastifyError) => void,
) => {
  if (!request.user) {
    throw new CustomError({
      statusCode: 401,
      name: 'UnauthorizedError',
      message: 'Unauthorized',
    })
  }
  done()
}

export default withAuth
