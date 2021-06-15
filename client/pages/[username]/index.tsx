import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import axios from 'axios'
import styled from '@emotion/styled'
import Post from '@src/components/common/Post'
import { apiGet } from '@src/api'
import { IPost, ServerSideError, User } from '@src/types'

const API_URL = process.env.NEXT_PUBLIC_API_URL

interface UserPageProps {
  user?: User
  error?: ServerSideError
}

function UserPage({ user, error }: UserPageProps) {
  const router = useRouter()
  const [posts, setPosts] = useState<IPost[]>()

  useEffect(() => {
    if (error && error.code === 404) {
      router.replace('/404')
    }
  }, [error])

  const fetchUserPosts = async (username: string) => {
    try {
      const posts = await apiGet<IPost[]>(`/posts/${username}`)
      setPosts(posts)
    } catch (e) {
      console.log(e)
    }
  }

  useEffect(() => {
    if (!user) {
      return
    }
    fetchUserPosts(user.username)
  }, [user])

  if (!user) {
    return null
  }

  return (
    <Container>
      <h1>{user.username}</h1>
      {!posts ? (
        <h3>Loading</h3>
      ) : posts.length === 0 ? (
        <h3>Empty</h3>
      ) : (
        <ListContainer>
          {posts.map((post) => (
            <Post key={post.id} {...post} />
          ))}
        </ListContainer>
      )}
    </Container>
  )
}

interface IUserQuery {
  username: any
}

export async function getServerSideProps({ query }: { query: IUserQuery }) {
  const { username } = query
  if (!username) return
  try {
    const { data: user } = await axios.get(
      `${API_URL}/users/${encodeURI(username)}`,
    )
    return { props: { user } }
  } catch (error) {
    const { response = { status: 502, data: {} } } = error
    return {
      props: {
        error: { code: response.status, message: response.data.message },
      },
    }
  }
}

export default UserPage

const Container = styled.div`
  width: 768px;
  margin-left: auto;
  margin-right: auto;
  @media screen and (max-width: 768px) {
    width: 100%;
  }
`

const ListContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  gap: 16px;
  padding: 0 2%;
`
