import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import axios from 'axios'
import styled from '@emotion/styled'
import Post from '@src/components/common/Post'
import { apiGet } from '@src/api'
import { IPost, User } from '@src/types'

const API_URL = process.env.NEXT_PUBLIC_API_URL

interface UserPageProps {
  user: User | null
}

function UserPage({ user }: UserPageProps) {
  const router = useRouter()
  const [posts, setPosts] = useState<IPost[]>()

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
  let user: User | null = null
  if (username) {
    const { data } = await axios.get(`${API_URL}/users/${encodeURI(username)}`)
    user = data
  }
  return { props: { user } }
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
