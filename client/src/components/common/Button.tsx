import styled from '@emotion/styled'

const Container = styled.div`
  display: inline;
  padding: 10px 20px;
  background-color: skyblue;
  margin: 5px;
  border-radius: 5px;
  cursor: pointer;
`

const Label = styled.span`
  color: #ffffff;
`

interface ButtonProps {
  label: string
  onClick: () => void
}

function Button({ label, onClick }: ButtonProps) {
  return (
    <Container onClick={onClick}>
      <Label>{label}</Label>
    </Container>
  )
}

export default Button
