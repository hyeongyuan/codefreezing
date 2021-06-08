import { useEffect, useState } from 'react'
import { NextPage } from 'next'
import { useRouter } from 'next/router'
import axios from 'axios'
import styled from '@emotion/styled'
import Post from '@src/components/home/Post'
import Button from '@src/components/common/Button'
import { IPost } from '@src/types'
import { useUserState } from '@src/atoms/authState'
import { apiGet, apiPost, revokeAccessToken } from '@src/api'

const API_URL = process.env.NEXT_PUBLIC_API_URL

interface HomePageProps {
  posts: IPost[]
}

const HomePage: NextPage<HomePageProps> = ({ posts: initialPosts }) => {
  const router = useRouter()
  const [user, setUser] = useUserState()
  const [posts, setPost] = useState<IPost[]>(initialPosts)

  const fetchPosts = async () => {
    try {
      const { data } = await apiGet('/posts')

      setPost(data)
    } catch (e) {
      console.log(e)
    }
  }

  useEffect(() => {
    fetchPosts()
  }, [])

  const onFreezingCode = () => {
    router.push('/freezing')
  }

  const onLogout = () => {
    apiPost('/auth/logout')
      .then(() => {
        revokeAccessToken()
        setUser(null)
      })
      .catch(console.log)
  }

  return (
    <div>
      <h1>Code Freezing</h1>
      {user ? (
        <>
          <h3>{user.username}</h3>
          <Button onClick={onLogout} label="로그아웃" />
        </>
      ) : (
        <a href={`${API_URL}/auth/social/redirect/github`}>깃헙 로그인</a>
      )}
      <Button onClick={onFreezingCode} label="글쓰기" />
      <ListContainer>
        {posts?.map((post) => (
          <Post key={post.id} {...post} />
        ))}
      </ListContainer>
    </div>
  )
}

export async function getServerSideProps() {
  const { data: posts } = await axios.get(`${API_URL}/posts`)
  return { props: { posts } }
}

export default HomePage

const ListContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  gap: 16px;
  padding: 0 2%;
`
