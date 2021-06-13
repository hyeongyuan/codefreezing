import styled from '@emotion/styled'
import dynamic from 'next/dynamic'
import { IPost } from '@src/types'
import { useRouter } from 'next/router'

const CodeViewer = dynamic(() => import('@src/components/common/CodeViewer'), {
  ssr: false,
})

function Post({
  id,
  title,
  code,
  language,
  user,
  url_slug,
  created_at,
}: IPost) {
  const router = useRouter()
  const onClickPost = () => {
    router.push(`/${user.username}/${url_slug}`)
  }
  return (
    <Container onClick={onClickPost}>
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
