import { useEffect, useState } from 'react'
import { NextPage } from 'next'
import axios from 'axios'
import styled from '@emotion/styled'
import Post from '@src/components/common/Post'
import { apiGet } from '@src/api'
import { IPost } from '@src/types'

const API_URL = process.env.NEXT_PUBLIC_API_URL

interface HomePageProps {
  posts: IPost[]
}

const HomePage: NextPage<HomePageProps> = ({ posts: initialPosts }) => {
  const [posts, setPost] = useState<IPost[]>(initialPosts)

  const fetchPosts = async () => {
    try {
      const posts = await apiGet<IPost[]>('/posts')

      setPost(posts)
    } catch (e) {
      console.log(e)
    }
  }

  useEffect(() => {
    fetchPosts()
  }, [])

  return (
    <ListContainer>
      {posts?.map((post) => (
        <Post key={post.id} {...post} />
      ))}
    </ListContainer>
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
  padding: 0 3%;
`
