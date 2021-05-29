import { useRouter } from 'next/router'

export default function HomePage() {
  const router = useRouter()

  const onFreezingCode = () => {
    router.push('/freezing')
  }
  return (
    <div>
      <h1>Code Freezing</h1>

      <button onClick={onFreezingCode}>글쓰기</button>
    </div>
  )
}
