import styled from '@emotion/styled'
import dynamic from 'next/dynamic'

const CodeViewer = dynamic(() => import('@src/components/CodeViewer'), {
  ssr: false,
})

interface PostProps {
  id: string
  title: string
  content: string
}

function Post({ id, title, content }: PostProps) {
  return (
    <Container>
      <Title>{title}</Title>
      <CodeViewer key={id} language="javascript" content={content} />
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
