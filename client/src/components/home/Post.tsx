import styled from '@emotion/styled'
import dynamic from 'next/dynamic'
import { IPost } from '@src/types'

const CodeViewer = dynamic(() => import('@src/components/common/CodeViewer'), {
  ssr: false,
})

function Post({ id, title, code, language, created_at }: IPost) {
  return (
    <Container>
      <Title>{title}</Title>
      <CodeViewer key={id} language={language} content={code} />
      <p>{created_at}</p>
    </Container>
  )
}

export default Post

const Container = styled.div`
  display: flex;
  flex-direction: column;
  padding: 20px 10px;
`
const Title = styled.p`
  color: rgb(104, 104, 104);
  text-align: center;
  padding-bottom: 20px;
  font-size: 1.6rem;
  font-weight: 500;
`
