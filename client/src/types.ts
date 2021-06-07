export type CodeMode = 'typescript' | 'javascript' | 'java' | 'python'

export interface IPost {
  id: number
  title: string
  code: string
  created_at: string
  updated_at: string
}

export interface SocialProfile {
  id: number
  email: string | null
  thumbnail: string | null
  name: string
}

export interface User {
  id: string
  email: string
  username: string
}
