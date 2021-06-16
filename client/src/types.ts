export type CodeLanguage = 'typescript' | 'javascript' | 'java' | 'python'

export interface IPost {
  id: number
  title: string
  language: CodeLanguage
  code: string
  is_private: boolean
  user: User
  tags: ITag[]
  url_slug: string
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
  created_at: string
  updated_at: string
}

export interface ITag {
  id: string
  name: string
}

export interface ServerSideProps<T = any> {
  data?: T
  error?: {
    code: number
    message: string
  }
}
