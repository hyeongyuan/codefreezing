import { ChangeEvent } from 'react'
import styled from '@emotion/styled'

interface InputProps {
  placeholder?: string
  style?: any
  onChange: (event: ChangeEvent<HTMLInputElement>) => void
  value: string
}

function InputComponent({
  onChange,
  value,
  placeholder = '',
  style,
}: InputProps) {
  return (
    <Container style={style}>
      <Input placeholder={placeholder} onChange={onChange} value={value} />
    </Container>
  )
}

export default InputComponent

const Container = styled.div`
  width: 250px;
  margin-right: 8px;
  border: 1px solid #dddddd;
  border-radius: 6px;
  background-color: #ffffff;
`

const Input = styled.input`
  width: 100%;
  padding: 5px 12px;
  box-sizing: border-box;
  border: 0;
  background-color: transparent;
  font-size: 14px;
  line-height: 20px;
`
