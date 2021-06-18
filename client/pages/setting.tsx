import { useRouter } from 'next/router'
import styled from '@emotion/styled'
import { useUserState } from '@src/atoms/authState'
import Avatar from '@src/components/common/Avatar'
import Button from '@src/components/common/Button'
import { apiDelete, revokeAccessToken } from '@src/api'

function SettingPage() {
  const router = useRouter()
  const [user, setUser] = useUserState()

  const onClickUnregister = async () => {
    const result = confirm('정말로 탈퇴하시겠습니까?')
    if (result) {
      try {
        await apiDelete('/auth/unregister')
        revokeAccessToken()
        setUser(null)
        router.replace('/')
      } catch (e) {
        console.log(e)
      }
    }
  }

  if (!user) {
    return <h1>Null</h1>
  }
  return (
    <Container>
      <ProfileSection>
        <ThumbnailArea>
          <Avatar imageUrl={user.thumbnail || ''} size={120} />
        </ThumbnailArea>
        <InfoArea>
          <h2>{user.username}</h2>
          <p>프론트엔드 개발자입니다.</p>
        </InfoArea>
      </ProfileSection>
      <DetailSection>
        <DetailColumn>
          <TitleWrapper>
            <h3>이메일 주소</h3>
          </TitleWrapper>
          <Content>{user.email}</Content>
        </DetailColumn>
        <DetailColumn>
          <TitleWrapper>
            <h3>회원 탈퇴</h3>
          </TitleWrapper>
          <Content>
            <Button onClick={onClickUnregister} label="회원 탈퇴" color="red" />
          </Content>
        </DetailColumn>
      </DetailSection>
    </Container>
  )
}

export default SettingPage

const Container = styled.main`
  width: 768px;
  margin-top: 3rem;
  margin-left: auto;
  margin-right: auto;
  @media screen and (max-width: 768px) {
    width: 100%;
  }
`

const ProfileSection = styled.section`
  display: flex;
  margin-bottom: 4rem;
  @media screen and (max-width: 768px) {
    flex-direction: column;
    margin-bottom: 0;
  }
  @media screen and (max-width: 1024px) {
    padding-left: 1rem;
    padding-right: 1rem;
  }
`

const ThumbnailArea = styled.div`
  display: flex;
  flex-direction: column;
  padding-right: 1.5rem;
  @media screen and (max-width: 768px) {
    align-items: center;
    padding-right: 0;
    padding-bottom: 1.5rem;
  }
`

const InfoArea = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  padding-left: 1.5rem;
  border-left: 1px solid rgb(233, 236, 239);
  h2 {
    font-size: 2.25rem;
    line-height: 1.5;
  }
  p {
    font-size: 1rem;
    line-height: 1.5;
    margin-top: 0.5rem;
  }
  @media screen and (max-width: 768px) {
    border-left: none;
    padding-left: 0;
    padding-top: 1.5rem;
    padding-bottom: 1.5rem;
    h2 {
      font-size: 1.25rem;
    }
    p {
      font-size: 0.875rem;
    }
  }
`

const DetailSection = styled.section`
  @media screen and (max-width: 1024px) {
    padding-left: 1rem;
    padding-right: 1rem;
  }
  > :not(:first-of-type) {
    border-top: 1px solid rgb(233, 236, 239);
  }
`
const DetailColumn = styled.div`
  padding-top: 1rem;
  padding-bottom: 1rem;
  display: flex;
`
const TitleWrapper = styled.div`
  display: flex;
  align-items: center;
  width: 9.5rem;
  h3 {
    font-size: 1.125rem;
    line-height: 1.5;
    color: rgb(52, 58, 64);
  }
`
const Content = styled.div`
  display: flex;
  flex: 1;
  align-items: center;
  font-size: 1rem;
  line-height: 1.5;
`
