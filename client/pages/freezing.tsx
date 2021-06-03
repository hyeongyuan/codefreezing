import { useRef, useState } from 'react'
import { useRouter } from 'next/router'
import dynamic from 'next/dynamic'
import styled from '@emotion/styled'
import InputTitle from '@src/components/InputTitle'
import InputTags from '@src/components/InputTags'
import useResize from '@src/hooks/useResize'
import { apiPost } from '@src/api'

const CodeEditor = dynamic(() => import('@src/components/CodeEditor'), {
  ssr: false,
})

export default function FreezingPage() {
  const router = useRouter()
  const [title, setTitle] = useState('')
  const [tags, setTags] = useState<string[]>([])
  const [code, setCode] = useState('')

  const docRef = useRef<HTMLDivElement | null>(null)
  const { width } = useResize(docRef)

  const onCancel = () => {
    router.back()
  }

  const onSubmit = async () => {
    try {
      const res = await apiPost('/posts', { title, code, tags })
      console.log(res)
    } catch (e) {
      console.log(e)
    }
  }

  return (
    <RootContainer>å
      <MainContainer ref={docRef}>
        <TopContainer>
          <InputTitle
            placeholder="제목을 입력하세요"
            value={title}
            onChange={setTitle}
          />
          <InputTags
            placeholder="태그를 입력하세요"
            value={tags}
            onChange={setTags}
          />
        </TopContainer>
        <CodeEditor value={code} onChange={setCode} />
        <BottomContainer style={{ width }}>
          <ButtonWrapper>
            <button onClick={onCancel}>나가기</button>
            <button onClick={onSubmit}>저장하기</button>
          </ButtonWrapper>
        </BottomContainer>
      </MainContainer>
    </RootContainer>
  )
}

const RootContainer = styled.div`
  display: flex;
  justify-content: center;
  height: 100vh;
`

const MainContainer = styled.div`
  max-width: 800px;
  padding-bottom: 4rem;
`

const TopContainer = styled.div`
  padding: 2rem 3rem 0 3rem;
`

const BottomContainer = styled.div`
  position: fixed;
  bottom: 0;
  z-index: 10;
`

const ButtonWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 0 1rem 0 1rem;
  height: 4rem;
  width: 100%;
`
