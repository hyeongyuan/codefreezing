import styled from '@emotion/styled'
import dynamic from 'next/dynamic'
import { IPost } from '@src/types'
import { useRouter } from 'next/router'
import { formatDate, getCodeLangFromFilename } from '@src/utils'

const CodeViewer = dynamic(() => import('@src/components/common/CodeViewer'), {
  ssr: false,
})

function Card({ title, code, filename, user, url_slug, created_at }: IPost) {
  const router = useRouter()
  const onClickPost = () => {
    router.push('/[username]/[url_slug]', `/${user.username}/${url_slug}`)
  }
  const language = getCodeLangFromFilename(filename)
  return (
    <Container onClick={onClickPost}>
      <Title>{title}</Title>
      <CodeViewer language={language} content={code} />
      <Date>{formatDate(created_at)}</Date>
    </Container>
  )
}

export default Card

const Container = styled.div`
  display: flex;
  flex-direction: column;
  padding: 20px 10px;

  background-color: #ffffff;
  border-radius: 4px;
  box-shadow: rgb(0 0 0 / 4%) 0px 4px 16px 0px;
  cursor: pointer;
`
const Title = styled.p`
  color: rgb(104, 104, 104);
  text-align: center;
  padding-bottom: 20px;
  font-size: 1.6rem;
  font-weight: 500;
`
const Date = styled.p`
  color: rgb(134, 142, 150);
`
