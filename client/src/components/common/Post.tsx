import dynamic from 'next/dynamic'
import { useRouter } from 'next/router'
import styled from '@emotion/styled'
import { getCodeLangFromFilename } from '@src/utils'
import { IPost } from '@src/types'

const CodeViewer = dynamic(() => import('@src/components/common/CodeViewer'), {
  ssr: false,
})

function Post({ title, description, filename, code, user, url_slug }: IPost) {
  const router = useRouter()
  const language = getCodeLangFromFilename(filename)

  const onClickCode = () => {
    router.push('/[username]/[url_slug]', `/${user.username}/${url_slug}`)
  }
  return (
    <Container>
      <div style={{ paddingLeft: 10 }}>
        <div
          style={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'flex-end',
          }}
        >
          <Title>{title}</Title>
          <Separator>/</Separator>
          <p>{filename}</p>
        </div>
        <Description>{description}</Description>
      </div>
      <CodeViewer
        style={{ maxHeight: 200 }}
        onClick={onClickCode}
        language={language}
        content={code}
        hoverColor="#2767cf"
      />
    </Container>
  )
}

export default Post

const Container = styled.div`
  margin-bottom: 2rem;
`
const Title = styled.h3``
const Description = styled.p`
  font-size: 12px;
`
const Separator = styled.span`
  margin-left: 0.25rem;
  margin-right: 0.25rem;
`
