import axios from 'axios'
import styled from '@emotion/styled'
import Post from '@src/components/common/Post'
import { IPost, ServerSideProps } from '@src/types'

const API_URL = process.env.NEXT_PUBLIC_API_URL

function HomePage({ data: posts }: ServerSideProps<IPost[]>) {
  return (
    <ListContainer>
      {posts?.map((post) => (
        <Post key={post.id} {...post} />
      ))}
    </ListContainer>
  )
}

export async function getServerSideProps() {
  try {
    const { data } = await axios.get(`${API_URL}/posts`)
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

export default HomePage

const ListContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  gap: 16px;
  padding: 0 3%;
`
