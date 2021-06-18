import styled from '@emotion/styled'

const Container = styled.div`
  display: inline;
  padding: 8px 18px;
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
  color?: string
}

function Button({ label, onClick, color = '#6C63FF' }: ButtonProps) {
  return (
    <Container style={{ backgroundColor: color }} onClick={onClick}>
      <Label>{label}</Label>
    </Container>
  )
}

export default Button
