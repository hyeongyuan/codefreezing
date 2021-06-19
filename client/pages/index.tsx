import axios from 'axios'
import Image from 'next/image'
import styled from '@emotion/styled'
import Card from '@src/components/common/Card'
import { IPost, ServerSideProps } from '@src/types'

const API_URL = process.env.NEXT_PUBLIC_API_URL

function HomePage({ data: posts }: ServerSideProps<IPost[]>) {
  if (!posts) {
    return <h2>loading</h2>
  }
  if (posts.length === 0) {
    return (
      <FullContainer>
        <Image src="/svgs/empty_post.svg" height={240} width={320} />
        <MainText>아직 코드가 없습니다</MainText>
      </FullContainer>
    )
  }
  return (
    <div style={{ marginTop: 24 }}>
      <ListContainer>
        {posts?.map((post) => (
          <Card key={post.id} {...post} />
        ))}
      </ListContainer>
    </div>
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

const FullContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: calc(100vh - 4rem);
`

const MainText = styled.p`
  font-size: 2rem;
  margin-top: 22px;
  color: rgb(134, 142, 150);
`
