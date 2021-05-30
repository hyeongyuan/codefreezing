import { useRouter } from 'next/router'
import styled from '@emotion/styled'
import Post from '@src/components/home/Post'

const items = [
  {
    id: '1',
    title: 'Hello world',
    content: `function hello () {
  console.log('hello')
}
    `,
  },
  {
    id: '2',
    title: '커피값 벌기',
    content: `const getCoffee = ({bean}) => {
  return this.make(bean);
};
    `,
  },
  {
    id: '3',
    title: '기본3',
    content: `hello`,
  },
]

export default function HomePage() {
  const router = useRouter()

  const onFreezingCode = () => {
    router.push('/freezing')
  }
  return (
    <div>
      <h1>Code Freezing</h1>
      <button onClick={onFreezingCode}>글쓰기</button>
      <ListContainer>
        {items.map(({ id, title, content }) => (
          <Post id={id} title={title} content={content} />
        ))}
      </ListContainer>
    </div>
  )
}

const ListContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  gap: 16px;
  padding: 0 2%;
`
