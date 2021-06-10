import { useRouter } from 'next/router'

function PostPage() {
  const router = useRouter()

  return (
    <div>
      <h1>POST</h1>
      <h2>username: {router.query.username}</h2>
      <h2>url slug: {router.query.url_slug}</h2>
    </div>
  )
}

export default PostPage
