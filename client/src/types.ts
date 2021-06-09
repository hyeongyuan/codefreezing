export type CodeLanguage = 'typescript' | 'javascript' | 'java' | 'python'

export interface IPost {
  id: number
  title: string
  language: CodeLanguage
  code: string
  is_private: boolean
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
