import { MouseEvent, useEffect, useState } from 'react'
import dynamic from 'next/dynamic'
import { useRouter } from 'next/router'
import Link from 'next/link'
import axios from 'axios'
import nookies from 'nookies'
import styled from '@emotion/styled'
import { apiDelete, apiPost } from '@src/api'
import { IPost, ServerSideProps } from '@src/types'
import { useUserState } from '@src/atoms/authState'
import { formatDate, getCodeLangFromFilename } from '@src/utils'
import { GetServerSidePropsContext } from 'next'

const API_URL = process.env.NEXT_PUBLIC_API_URL

const CodeViewer = dynamic(() => import('@src/components/common/CodeViewer'), {
  ssr: false,
})

function PostPage({ data: initialPost, error }: ServerSideProps<IPost>) {
  const [post, setPost] = useState(initialPost)
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

  const onClickLike = async () => {
    if (!post) return
    if (!user) {
      alert('로그인 후 이용해주세요.')
      return
    }
    try {
      const data = await apiPost<IPost>(
        `/posts/${post.id}/${post.liked ? 'unlike' : 'like'}`,
      )
      setPost((prevPost) => ({ ...prevPost, ...data }))
    } catch (e) {
      console.log(e)
    }
  }

  if (!post) {
    return null
  }
  const language = getCodeLangFromFilename(post.filename)
  return (
    <Container>
      <TopContainer>
        <Title>{post.title}</Title>
        <InfoSection>
          <Link href="/[username]" as={`/${post.user.username}`}>
            <Username>{post.user.username}</Username>
          </Link>
          <Separator>·</Separator>
          <Date>{formatDate(post.created_at)}</Date>
        </InfoSection>
        {isOwn && (
          <ButtonWrapper>
            <Button onClick={onClickEdit}>수정</Button>
            <Button onClick={onClickDelete}>삭제</Button>
          </ButtonWrapper>
        )}
      </TopContainer>
      <Description>{post.description}</Description>
      <CodeViewer language={language} content={post.code} />
      <TagWrapper>
        {post.tags.map((tag) => (
          <Tag key={tag.id} onClick={(event) => onClickTag(event, tag.name)}>
            {tag.name}
          </Tag>
        ))}
      </TagWrapper>
      <BottomToolBar>
        <Button onClick={onClickLike}>
          {`${post.liked ? '싫은 상태로' : '좋은 상태로'} ${post.likes}`}
        </Button>
      </BottomToolBar>
    </Container>
  )
}

interface IPostQuery {
  username: string
  url_slug: string
}

export async function getServerSideProps(ctx: GetServerSidePropsContext) {
  const { username, url_slug: urlSlug } = ctx.query as unknown as IPostQuery
  if (!username || !urlSlug) return { props: {} }
  try {
    const { refresh_token: refreshToken } = nookies.get(ctx)
    let accessToken = ''
    if (refreshToken) {
      try {
        const { data } = await axios.get(`${API_URL}/auth/refresh`, {
          headers: { Cookie: `refresh_token=${refreshToken}` },
        })
        accessToken = data.accessToken
      } catch {}
    }
    const { data } = await axios.get(
      `${API_URL}/posts/${encodeURI(username)}/${encodeURI(urlSlug)}`,
      { headers: { Authorization: `Bearer ${accessToken}` } },
    )
    return { props: { data } }
  } catch (error) {
    console.log(error)
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
  font-size: 3rem;
  line-height: 1.5;
  color: rgb(52, 58, 64);
  margin-bottom: 1.5rem;
`
const InfoSection = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
`

const Username = styled.a`
  font-size: 1rem;
  font-weight: bold;
  color: rgb(52, 58, 64);
  cursor: pointer;
  :hover {
    text-decoration: underline;
  }
`

const Separator = styled.span`
  margin-left: 0.5rem;
  margin-right: 0.5rem;
`

const Date = styled.p`
  color: rgb(134, 142, 150);
`

const Description = styled.p`
  font-size: 1rem;
  margin-top: 1rem;
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
  height: 2rem;
  border-radius: 1rem;
  cursor: pointer;
  background-color: rgb(241, 243, 245);
  color: #6c63ff;
`

const BottomToolBar = styled.div``
