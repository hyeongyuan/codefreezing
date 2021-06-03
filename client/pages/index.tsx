import { useEffect, useState } from 'react'
import { NextPage } from 'next'
import { useRouter } from 'next/router'
import styled from '@emotion/styled'
import Post from '@src/components/home/Post'
import { apiGet } from '@src/api'
import { IPost } from '@src/types'
import axios from 'axios'

interface HomePageProps {
  posts: IPost[]
}

const HomePage: NextPage<HomePageProps> = ({ posts: initialPosts }) => {
  const router = useRouter()
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
  return (
    <div>
      <h1>Code Freezing</h1>
      <button onClick={onFreezingCode}>글쓰기</button>
      <ListContainer>
        {posts?.map((post) => (
          <Post key={post.id} {...post} />
        ))}
      </ListContainer>
    </div>
  )
}

export async function getServerSideProps() {
  const { data: posts } = await axios.get(`${process.env.API_URL}/posts`)
  return { props: { posts } }
}

export default HomePage

const ListContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  gap: 16px;
  padding: 0 2%;
`
