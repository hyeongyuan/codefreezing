import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import axios from 'axios'
import styled from '@emotion/styled'
import Avatar from '@src/components/common/Avatar'
import Post from '@src/components/common/Post'
import { apiGet } from '@src/api'
import { IPost, User, ServerSideProps } from '@src/types'

const API_URL = process.env.NEXT_PUBLIC_API_URL

function UserPage({ data: user, error }: ServerSideProps<User>) {
  const router = useRouter()
  const [posts, setPosts] = useState<IPost[]>()

  useEffect(() => {
    if (error && error.code === 404) {
      router.replace('/404')
    }
  }, [error])

  const fetchUserPosts = async (id: string) => {
    try {
      const posts = await apiGet<IPost[]>(`/users/${id}/posts`)
      setPosts(posts)
    } catch (e) {
      console.log(e)
    }
  }

  useEffect(() => {
    if (!user) {
      return
    }
    fetchUserPosts(user.id)
  }, [user])

  if (!user) {
    return null
  }

  return (
    <Container>
      <ProfileSection>
        <Avatar imageUrl={user.thumbnail || ''} size={120} />
        <Username>{user.username}</Username>
      </ProfileSection>
      <ContentSection>
        <h1 style={{ margin: '1rem', textDecoration: 'underline' }}>
          All codes
        </h1>
        {!posts ? (
          <h3>Loading</h3>
        ) : posts.length === 0 ? (
          <h3>Empty</h3>
        ) : (
          posts.map((post) => <Post key={post.id} {...post} />)
        )}
      </ContentSection>
    </Container>
  )
}

interface IUserQuery {
  username: string
}

export async function getServerSideProps({ query }: { query: IUserQuery }) {
  const { username } = query
  if (!username) return { props: {} }
  try {
    const { data } = await axios.get(`${API_URL}/users/${encodeURI(username)}`)
    return { props: { data } }
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
  display: flex;
  flex-direction: row;
  margin-top: 2rem;
  padding-left: 1rem;
  padding-right: 1rem;
  @media screen and (max-width: 768px) {
    flex-direction: column;
    padding-left: 0.5rem;
    padding-right: 0.5rem;
  }
`

const ProfileSection = styled.section`
  padding-left: 1rem;
  padding-right: 1rem;
  @media screen and (max-width: 768px) {
    display: flex;
    margin-bottom: 1.5rem;
  }
`

const Username = styled.h1`
  font-size: 26px;
  line-height: 1.25;
  letter-spacing: -1px;
  margin-top: 1rem;
  @media screen and (max-width: 768px) {
    margin-left: 1rem;
  }
`
const ContentSection = styled.section`
  display: flex;
  flex: 1;
  flex-direction: column;
  padding-left: 1rem;
  padding-right: 1rem;
`
