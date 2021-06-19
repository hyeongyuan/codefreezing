import axios from 'axios'
import jwt, { SignOptions } from 'jsonwebtoken'
import { SocialProfile, SocialProvider } from '@types'

const { GITHUB_ID, JWT_SECRET } = process.env

const redirectPath = `/api/auth/social/callback/`
export const redirectUri =
  process.env.NODE_ENV === 'development'
    ? `http://localhost:3000${redirectPath}`
    : `http://158.247.216.118:3000$${redirectPath}`

export function generateSocialLoginLink(
  provider: SocialProvider,
  next: string = '/',
) {
  const redirectUriWithNext = `${redirectUri}github?next=${next}`
  return `https://github.com/login/oauth/authorize?scope=user:email&client_id=${GITHUB_ID}&redirect_uri=${encodeURIComponent(
    redirectUriWithNext,
  )}`
}

interface GetGithubAccessTokenProps {
  code: string
  clientId: string
  clientSecret: string
}

interface GithubOAuthResult {
  access_token: string
  token_type: string
  scope: string
}

export async function getGithubAccessToken({
  code,
  clientId,
  clientSecret,
}: GetGithubAccessTokenProps) {
  const response = await axios.post<GithubOAuthResult>(
    'https://github.com/login/oauth/access_token',
    {
      code,
      client_id: clientId,
      client_secret: clientSecret,
    },
    {
      headers: {
        accept: 'application/json',
      },
    },
  )
  return response.data.access_token
}

export async function getGithubProfile(
  accessToken: string,
): Promise<SocialProfile> {
  const { data } = await axios.get('https://api.github.com/user', {
    headers: {
      Authorization: `token ${accessToken}`,
    },
  })
  const profile: SocialProfile = {
    id: data.id,
    email: data.email,
    name: data.login,
    thumbnail: data.avatar_url,
  }
  return profile
}

export const generateToken = async (
  payload: any,
  options?: SignOptions,
): Promise<string> => {
  const jwtOptions: SignOptions = {
    issuer: 'codefreezing.com',
    expiresIn: '7d',
    ...options,
  }
  const secretKey = JWT_SECRET || ''

  if (!jwtOptions.expiresIn) {
    // removes expiresIn when expiresIn is given as undefined
    delete jwtOptions.expiresIn
  }
  return new Promise((resolve, reject) => {
    if (!secretKey) reject(new Error('GITHUB ENVVAR IS MISSING'))
    jwt.sign(payload, secretKey, jwtOptions, (err, token) => {
      if (err) reject(err)
      resolve(token as string)
    })
  })
}

export const decodeToken = async <T = any>(token: string): Promise<T> => {
  if (!JWT_SECRET) {
    throw new Error('JWT_SECRET Environment Variable is not set')
  }
  return new Promise((resolve, reject) => {
    jwt.verify(token, JWT_SECRET, (error, decoded) => {
      if (error) {
        reject(error)
        return
      }
      if (!decoded) {
        reject(new Error('Token is empty'))
        return
      }
      resolve(decoded as any)
    })
  })
}
