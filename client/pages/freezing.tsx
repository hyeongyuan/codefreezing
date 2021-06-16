import React, { useRef, useState } from 'react'
import { useRouter } from 'next/router'
import dynamic from 'next/dynamic'
import axios from 'axios'
import styled from '@emotion/styled'
import InputTitle from '@src/components/common/InputTitle'
import InputTags from '@src/components/common/InputTags'
import useResize from '@src/hooks/useResize'
import { apiPost, apiPut } from '@src/api'
import { CodeInfo } from '@src/components/freezing/CodeEditor'
import { IPost, ServerSideProps } from '@src/types'

const API_URL = process.env.NEXT_PUBLIC_API_URL

const CodeEditor = dynamic(
  () => import('@src/components/freezing/CodeEditor'),
  {
    ssr: false,
  },
)

function FreezingPage({ data }: ServerSideProps<IPost>) {
  const router = useRouter()
  const [title, setTitle] = useState(data?.title || '')
  const [tags, setTags] = useState<string[]>(
    data?.tags.map((t) => t.name) || [],
  )
  const [codeInfo, setCodeInfo] = useState<CodeInfo>({
    value: data?.code || '',
    language: data?.language || 'javascript',
  })
  const [isPrivate, setIsPrivate] = useState(!!data?.is_private)
  const isEditMode = !!router.query.id

  const docRef = useRef<HTMLDivElement | null>(null)
  const { width } = useResize(docRef)

  const onChangePrivate = (event: any) => {
    setIsPrivate(event.target.name === 'private')
  }

  const onCancel = () => {
    router.back()
  }

  const onSubmit = async () => {
    try {
      if (isEditMode) {
        const { id } = router.query
        await apiPut(`/posts/${id}`, {
          title,
          tags,
          isPrivate,
          code: codeInfo.value,
          language: codeInfo.language,
        })
      } else {
        await apiPost('/posts', {
          title,
          tags,
          isPrivate,
          code: codeInfo.value,
          language: codeInfo.language,
        })
      }
      alert(`${isEditMode ? '수정' : '업로드'} 성공`)

      router.back()
    } catch (e) {
      console.log(e)
    }
  }

  return (
    <RootContainer>
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
        <CodeEditor code={codeInfo} onChange={setCodeInfo} />
        <div>
          <input
            type="radio"
            name="public"
            checked={!isPrivate}
            onChange={onChangePrivate}
          />
          <label htmlFor="dewey">공개</label>
          <input
            type="radio"
            name="private"
            checked={isPrivate}
            onChange={onChangePrivate}
          />
          <label htmlFor="dewey">비공개</label>
        </div>
        <BottomContainer style={{ width }}>
          <ButtonWrapper>
            <button onClick={onCancel}>나가기</button>
            <button onClick={onSubmit}>
              {isEditMode ? '수정하기' : '저장하기'}
            </button>
          </ButtonWrapper>
        </BottomContainer>
      </MainContainer>
    </RootContainer>
  )
}

export async function getServerSideProps({ query }: { query: { id: string } }) {
  const { id } = query
  if (!id) return { props: {} }
  try {
    const { data } = await axios.get(`${API_URL}/posts/${id}`)
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

export default FreezingPage

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
