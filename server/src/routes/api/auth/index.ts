import { FastifyPluginCallback } from 'fastify'
import { getManager, getRepository } from 'typeorm'
import {
  decodeToken,
  generateSocialLoginLink,
  generateToken,
  getGithubAccessToken,
  getGithubProfile,
} from '@lib/auth'
import CustomError from '@lib/CustomError'
import { SocialRegisterToken, SocialProvider } from '@types'
import { SocialAccount } from '@entity/SocialAccount'
import { User } from '@entity/User'

const { GITHUB_ID, GITHUB_SECRET } = process.env

if (!GITHUB_ID || !GITHUB_SECRET) {
  throw new Error('GITHUB ENVVAR IS MISSING')
}

interface IRegister {
  Body: {
    email: string
    username: string
  }
}

interface ICallbackGithub {
  Querystring: {
    code?: string
    error?: string
    error_description?: string
  }
}

interface IRedirectProvider {
  Querystring: {
    next: string
  }
  Params: {
    provider: SocialProvider
  }
}

const authRoute: FastifyPluginCallback = (fastify, opts, done) => {
  /**
   * POST /api/auth/register
   * Register
   */
  fastify.post<IRegister>('/register', async (request, reply) => {
    const registerToken = request.cookies['register_token']
    if (!registerToken) {
      throw new CustomError({
        statusCode: 401,
        message: "'register_token' cookie is empty.",
        name: 'UnauthorizedError',
      })
    }

    const { email, username } = request.body

    try {
      const decoded = await decodeToken<SocialRegisterToken>(registerToken)

      const manager = getManager()

      manager.transaction('SERIALIZABLE', async (entityManager) => {
        const user = new User()
        user.email = email
        user.username = username
        await entityManager.save(user)

        const socialAccount = new SocialAccount()
        socialAccount.provider = decoded.provider
        socialAccount.social_id = decoded.profile.id.toString()
        socialAccount.user = user
        await entityManager.save(socialAccount)

        reply.status(201).send(user)
      })
    } catch (e) {
      throw new CustomError({
        statusCode: 401,
        message: 'Fail to decode token',
        name: 'UnauthorizedError',
      })
    }
  })
  /**
   * GET /api/auth/callback/github
   * Callback Github OAuth
   */
  fastify.get<ICallbackGithub>('/callback/github', async (request, reply) => {
    const { code, error, error_description } = request.query

    if (error || !code) {
      throw new CustomError({
        statusCode: 400,
        name: 'BadRequestError',
        message: 'Fail github login',
      })
    }

    try {
      const accessToken = await getGithubAccessToken({
        code,
        clientId: GITHUB_ID,
        clientSecret: GITHUB_SECRET,
      })
      const profile = await getGithubProfile(accessToken)

      const socialAccountRepo = getRepository(SocialAccount)

      const socialAccount = await socialAccountRepo.findOne({
        provider: 'github',
        social_id: profile.id.toString(),
      })

      const userRepo = getRepository(User)
      if (socialAccount) {
        const user = await userRepo.findOne(socialAccount.user)
        if (!user) {
          throw new Error('User is missing')
        }

        const accessToken = await user.generateToken()

        reply.setCookie('access_token', accessToken, {
          path: '/',
          httpOnly: true,
          maxAge: 60 * 60 * 24 * 15,
        })

        const redirectUrl =
          process.env.NODE_ENV === 'development' ? 'http://localhost:8081' : ''
        reply.redirect(redirectUrl)
        return
      }

      let user: User | undefined = undefined
      if (profile.email) {
        user = await userRepo.findOne({
          email: profile.email,
        })
      }

      if (user) {
        const redirectUrl =
          process.env.NODE_ENV === 'development' ? 'http://localhost:8081' : ''
        reply.redirect(redirectUrl)
        return
      }

      const registerTokenInfo = {
        profile,
        accessToken,
        provider: 'github',
      }

      const registerToken = await generateToken(registerTokenInfo, {
        expiresIn: '1h',
      })

      reply.setCookie('register_token', registerToken, {
        maxAge: 1000 * 60 * 60,
        path: '/',
      })

      const redirectUrl =
        process.env.NODE_ENV === 'development'
          ? 'http://localhost:8081/register?social=1'
          : ''
      reply.redirect(redirectUrl)
    } catch (e) {
      throw new CustomError({
        statusCode: 500,
        name: 'InternalServerError',
        message: e.message,
      })
    }
  })
  /**
   * GET /api/auth/profile
   * Get Profile
   */
  fastify.get('/profile', async (request, reply) => {
    const registerToken = request.cookies['register_token']
    if (!registerToken) {
      throw new CustomError({
        statusCode: 401,
        message: "'register_token' cookie is empty.",
        name: 'UnauthorizedError',
      })
    }

    const decoded = await decodeToken(registerToken)
    reply.send(decoded.profile)
  })
  /**
   * GET /api/auth/redirect/:provider(github)
   * Login Token
   */
  fastify.get<IRedirectProvider>(
    '/redirect/:provider',
    async (request, reply) => {
      const { provider } = request.params
      const { next } = request.query
      const validated = ['github'].includes(provider)
      if (!validated) {
        throw new CustomError({
          statusCode: 400,
          message: 'Unsupported provider',
          name: 'BadRequestError',
        })
      }
      const loginUrl = generateSocialLoginLink(provider, next)
      reply.redirect(loginUrl)
    },
  )
  done()
}

export default authRoute
