import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import styled from '@emotion/styled'
import Post from '@src/components/home/Post'
import { apiGet } from '@src/api'
import { IPost } from '@src/types'

export default function HomePage() {
  const router = useRouter()
  const [posts, setPost] = useState<IPost[]>()

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
        {posts?.map(({ id, title, code }) => (
          <Post key={id} id={id} title={title} code={code} />
        ))}
      </ListContainer>
    </div>
  )
}

const ListContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  gap: 16px;
  padding: 0 2%;
`
