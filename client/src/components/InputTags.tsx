import React, { useState } from 'react'
import styled from '@emotion/styled'

interface InputTagsProps {
  placeholder?: string
}

function InputTags({ placeholder }: InputTagsProps) {
  const [value, setValue] = useState('')
  const [tags, setTags] = useState<string[]>([])

  const onChangeValue = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target
    if (value && value[value.length - 1] === ',') {
      setTags((prevTags) => [...prevTags, value.slice(0, value.length - 1)])
      setValue('')
    } else {
      setValue(value)
    }
  }

  const onKeyPress = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter' && value) {
      setTags((prevTags) => [...prevTags, value])
      setValue('')
    }
  }

  const onKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Backspace' && !value && tags.length !== 0) {
      setTags((prevTags) => prevTags.splice(0, prevTags.length - 1))
    }
  }

  return (
    <Container>
      {tags.map((tag, index) => (
        <Tag key={index}>#{tag}</Tag>
      ))}
      <Input
        placeholder={placeholder}
        onChange={onChangeValue}
        onKeyPress={onKeyPress}
        onKeyDown={onKeyDown}
        value={value}
      />
    </Container>
  )
}

export default InputTags

const Container = styled.div`
  font-size: 1.125rem;
  display: flex;
  flex-wrap: wrap;
`

const Tag = styled.div`
  font-size: 1rem;
  display: inline-flex;
  align-items: center;
  height: 2rem;
  margin: 0 0.75rem 0.75rem 0;
  padding: 0 1rem;
`

const Input = styled.input`
  min-width: 8rem;
  margin-bottom: 0.75rem;
  line-height: 2rem;
  font-size: inherit;
  outline: none;
  border: none;
`
