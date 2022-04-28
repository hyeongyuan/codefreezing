import React, { useState } from 'react'
import { useRouter } from 'next/router'
import axios from 'axios'
import styled from '@emotion/styled'
import InputTitle from '@src/components/common/InputTitle'
import InputTags from '@src/components/common/InputTags'
import Button from '@src/components/common/Button'
import Input from '@src/components/freezing/Input'
import { apiPost, apiPut } from '@src/api'
import CodeEditor, { CodeInfo } from '@src/components/freezing/CodeEditor'
import { IPost, ServerSideProps } from '@src/types'

const API_URL = process.env.NEXT_PUBLIC_API_URL

function FreezingPage({ data }: ServerSideProps<IPost>) {
  const router = useRouter()
  const [title, setTitle] = useState(data?.title || '')
  const [description, setDescription] = useState(data?.description || '')
  const [tags, setTags] = useState<string[]>(
    data?.tags.map((t) => t.name) || [],
  )
  const [codeInfo, setCodeInfo] = useState<CodeInfo>({
    value: data?.code || '',
    filename: data?.filename || '',
  })
  const [isPrivate, setIsPrivate] = useState(!!data?.is_private)
  const isEditMode = !!router.query.id

  const onChangePrivate = (event: any) => {
    setIsPrivate(event.target.name === 'private')
  }

  const onCancel = () => {
    router.back()
  }

  const onSubmit = async () => {
    try {
      const data = {
        title,
        description,
        tags,
        isPrivate,
        code: codeInfo.value,
        filename: codeInfo.filename,
      }
      if (isEditMode) {
        const { id } = router.query
        await apiPut(`/posts/${id}`, data)
      } else {
        await apiPost('/posts', data)
      }
      alert(`${isEditMode ? '수정' : '업로드'} 성공`)
      router.back()
    } catch (e) {
      console.log(e)
    }
  }

  return (
    <Container>
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
      <Input
        style={{ backgroundColor: '#fafbfc', width: '100%' }}
        placeholder="Description..."
        onChange={(event) => setDescription(event.target.value)}
        value={description}
      />
      <div style={{ marginTop: 16, marginBottom: 16 }}>
        <CodeEditor code={codeInfo} onChange={setCodeInfo} />
      </div>
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
      <ButtonWrapper>
        <Button onClick={onCancel} label="나가기" />
        <Button
          onClick={onSubmit}
          label={isEditMode ? '수정하기' : '저장하기'}
        />
      </ButtonWrapper>
    </Container>
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

const Container = styled.div`
  max-width: 1012px;
  margin-left: auto;
  margin-right: auto;
  padding-left: 16px;
  padding-right: 16px;
`

const TopContainer = styled.div`
  padding: 2rem 3rem 0 3rem;
`

const ButtonWrapper = styled.div`
  display: flex;
  justify-content: space-between;
`
