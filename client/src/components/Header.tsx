import styled from '@emotion/styled'
import { useRouter } from 'next/router'
import Button from '@src/components/common/Button'
import { useUserState } from '@src/atoms/authState'
import { apiPost, revokeAccessToken } from '@src/api'
import { MouseEvent } from 'react'

const API_URL = process.env.NEXT_PUBLIC_API_URL

function Header() {
  const router = useRouter()
  const [user, setUser] = useUserState()

  const onFreezingCode = () => {
    router.push('/freezing')
  }

  const onLogout = () => {
    apiPost('/auth/logout')
      .then(() => {
        revokeAccessToken()
        setUser(null)
      })
      .catch(console.log)
  }

  const onClickLogo = (event: MouseEvent) => {
    event.preventDefault()
    router.push('/')
  }

  return (
    <Container>
      <Inner>
        <a style={{cursor: 'pointer'}} onClick={onClickLogo}>
          <h2>CODEFREEZING</h2>
        </a>
        {user ? (
          <div>
            <Button onClick={onFreezingCode} label="글쓰기" />
            <Button onClick={onLogout} label="로그아웃" />
          </div>
        ) : (
          <a href={`${API_URL}/auth/social/redirect/github`}>깃헙 로그인</a>
        )}
      </Inner>
    </Container>
  )
}

export default Header

const Container = styled.header`
  display: flex;
  justify-content: center;
  height: 4rem;
  width: 100%;
  box-shadow: 1px 1px 1px 1px rgba(116, 110, 110, 0.199);
  margin-bottom: 36px;
`

const Inner = styled.div`
  width: 90%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
`
