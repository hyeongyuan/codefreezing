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
