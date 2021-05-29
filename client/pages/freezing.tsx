import { useRef } from 'react'
import { useRouter } from 'next/router'
import dynamic from 'next/dynamic'
import InputTitle from '../src/components/InputTitle'
import InputTags from '../src/components/InputTags'
import useResize from '../src/hooks/useResize'
import styled from '@emotion/styled'

const CodeEditor = dynamic(() => import('../src/components/CodeEditor'), {
  ssr: false,
})

export default function FreezingPage() {
  const router = useRouter()

  const docRef = useRef<HTMLDivElement | null>(null)
  const { width } = useResize(docRef)

  const onCancelFreezing = () => {
    router.back()
  }

  return (
    <RootContainer>
      <MainContainer ref={docRef}>
        <TopContainer>
          <InputTitle placeholder="제목을 입력하세요" />
          <InputTags placeholder="태그를 입력하세요" />
        </TopContainer>
        <CodeEditor />
        <BottomContainer style={{ width }}>
          <ButtonWrapper>
            <button onClick={onCancelFreezing}>나가기</button>
            <button>저장하기</button>
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
