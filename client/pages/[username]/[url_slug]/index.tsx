import { useState } from 'react'
import dynamic from 'next/dynamic'
import { useRouter } from 'next/router'
import axios from 'axios'
import styled from '@emotion/styled'
import Post from '@src/components/common/Post'
import { apiGet } from '@src/api'
import { IPost } from '@src/types'

const API_URL = process.env.NEXT_PUBLIC_API_URL

const CodeViewer = dynamic(() => import('@src/components/common/CodeViewer'), {
  ssr: false,
})

interface PostPageProps {
  post: IPost | null
}

function PostPage({ post: initialPost }: PostPageProps) {
  const router = useRouter()
  const [post, setPost] = useState<IPost | null>(initialPost)

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

  if (!post) {
    return null
  }

  return (
    <Container>
      <h1>{post.title}</h1>
      <CodeViewer language={post.language} content={post.code} />
      <p>{post.language}</p>
      <div></div>
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
    width: 100%;
  }
`
