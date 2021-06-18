export type SocialProvider = 'github'

export interface SocialProfile {
  id: number
  email: string | null
  thumbnail: string | null
  name: string
}

export interface SocialRegisterToken {
  profile: SocialProfile
  provider: SocialProvider
}

export interface DecodedToken {
  user_id: number
  iat: number
  exp: number
  iss: string
  sub: 'access_token' | 'refresh_token'
}
