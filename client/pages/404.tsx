import React from 'react'
import Image from 'next/image'
import styled from '@emotion/styled'

function NotFoundPage() {
  return (
    <Container>
      <Image src="/svgs/not_found.svg" height="100%" width={400} />
      <MainText>페이지를 찾을 수 없습니다</MainText>
      <SubText>주소가 정확한지 다시 한번 확인해주세요.</SubText>
    </Container>
  )
}

export default NotFoundPage

const Container = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100vh;
  align-items: center;
  justify-content: center;
`

const MainText = styled.strong`
  font-size: 20px;
  margin-top: 22px;
  color: #262626;
`

const SubText = styled.p`
  font-size: 15px;
  margin-top: 6px;
  color: #7f7f7f;
`