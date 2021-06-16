import { useState, MouseEvent, useEffect } from 'react'
import dynamic from 'next/dynamic'
import { useRouter } from 'next/router'
import axios from 'axios'
import styled from '@emotion/styled'
import { apiDelete } from '@src/api'
import { IPost, ServerSideProps } from '@src/types'
import { useUserState } from '@src/atoms/authState'

const API_URL = process.env.NEXT_PUBLIC_API_URL

const CodeViewer = dynamic(() => import('@src/components/common/CodeViewer'), {
  ssr: false,
})

function PostPage({ data: post, error }: ServerSideProps<IPost>) {
  const router = useRouter()
  const [user] = useUserState()
  const isOwn = user && post && user.id === post.user.id

  useEffect(() => {
    if (error && error.code === 404) {
      router.replace('/404')
    }
  }, [error])

  const onClickEdit = async () => {
    if (!post) return
    router.push(`/freezing?id=${post.id}`)
  }

  const onClickDelete = async () => {
    if (!post) return
    const isConfirm = confirm('정말 삭제하시겠습니까?')
    if (isConfirm) {
      try {
        await apiDelete(`/posts/${post.id}`)
        router.push('/')
      } catch (error) {
        console.log(error)
      }
    }
  }

  const onClickTag = (event: MouseEvent, tagName: string) => {
    event.preventDefault()
    console.log({ tagName })
  }

  if (!post) {
    return null
  }
  return (
    <Container>
      <TopContainer>
        <Title>{post.title}</Title>
        {isOwn && (
          <ButtonWrapper>
            <Button onClick={onClickEdit}>수정</Button>
            <Button onClick={onClickDelete}>삭제</Button>
          </ButtonWrapper>
        )}
        <TagWrapper>
          {post.tags.map((tag) => (
            <Tag key={tag.id} onClick={(event) => onClickTag(event, tag.name)}>
              {tag.name}
            </Tag>
          ))}
        </TagWrapper>
      </TopContainer>
      <div>
        <CodeViewer language={post.language} content={post.code} />
        <p>{post.language}</p>
      </div>
    </Container>
  )
}

interface IPostQuery {
  username: string
  url_slug: string
}

export async function getServerSideProps({ query }: { query: IPostQuery }) {
  const { username, url_slug: urlSlug } = query
  if (!username || !urlSlug) return { props: {} }
  try {
    const { data } = await axios.get(
      `${API_URL}/posts/${encodeURI(username)}/${encodeURI(urlSlug)}`,
    )
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

export default PostPage

const Container = styled.div`
  width: 768px;
  margin-left: auto;
  margin-right: auto;
  @media screen and (max-width: 768px) {
    width: calc(100% - 20px);
  }
`

const TopContainer = styled.div`
  margin-top: 2rem;
`

const Title = styled.h1`
  margin-bottom: 1rem;
`

const ButtonWrapper = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-bottom: -1.25rem;
  box-sizing: inherit;
`
const Button = styled.button`
  margin-left: 0.5rem;
  color: rgb(134, 142, 150);
`

const TagWrapper = styled.div`
  padding: 15px 0 20px 0;
`

const Tag = styled.a`
  margin-bottom: 0.875rem;
  margin-right: 0.875rem;
  padding: 5px 14px;
  cursor: pointer;
`
