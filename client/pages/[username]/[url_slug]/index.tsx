import { useState, MouseEvent } from 'react'
import dynamic from 'next/dynamic'
import { useRouter } from 'next/router'
import axios from 'axios'
import styled from '@emotion/styled'
import { apiDelete, apiGet } from '@src/api'
import { IPost } from '@src/types'
import { useUserState } from '@src/atoms/authState'

const API_URL = process.env.NEXT_PUBLIC_API_URL

const CodeViewer = dynamic(() => import('@src/components/common/CodeViewer'), {
  ssr: false,
})

interface PostPageProps {
  post: IPost | null
}

function PostPage({ post: initialPost }: PostPageProps) {
  const router = useRouter()
  const [user] = useUserState()
  const [post, setPost] = useState<IPost | null>(initialPost)
  const isOwn = user && post && user.id === post.user.id

  const fetchPost = async (username: string, urlSlug: string) => {
    try {
      const post = await apiGet<IPost>(`/posts/${username}/${urlSlug}`)

      setPost(post)
    } catch (e) {
      console.log(e)
    }
  }

  // useEffect(() => {
  //   const { username, url_slug: urlSlug } = router.query
  //   if (username && urlSlug) {
  //     fetchPost(username as string, urlSlug as string)
  //   }
  // }, [router.query])

  const onDelete = async () => {
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
            <button onClick={onDelete}>삭제</button>
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
  username: any
  url_slug: any
}

export async function getServerSideProps({ query }: { query: IPostQuery }) {
  const { username, url_slug: urlSlug } = query
  let post: IPost | null = null
  if (username && urlSlug) {
    const { data } = await axios.get(
      `${API_URL}/posts/${encodeURI(username)}/${encodeURI(urlSlug)}`,
    )
    post = data
  }
  return { props: { post } }
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
const TagWrapper = styled.div`
  padding: 15px 0 20px 0;
`

const Tag = styled.a`
  margin-bottom: 0.875rem;
  margin-right: 0.875rem;
  padding: 5px 14px;
  cursor: pointer;
`
