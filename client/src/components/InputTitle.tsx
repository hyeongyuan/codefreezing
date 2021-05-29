import React, { useState, useCallback } from 'react'
import styled from '@emotion/styled'

const TEXTAREA_HEIGHT = 66

interface InputTitleProps {
  placeholder?: string
}

function InputTitle({ placeholder }: InputTitleProps) {
  const [value, setValue] = useState('')
  const [height, setHeight] = useState(TEXTAREA_HEIGHT)

  const onChangeValue = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setValue(event.target.value)
  }

  const onKeyPress = useCallback((event: React.KeyboardEvent) => {
    if (event.key === 'Enter') {
      setHeight((prevHeight) => prevHeight + TEXTAREA_HEIGHT)
    }
  }, [])

  const onKeyDown = useCallback(
    (event: React.KeyboardEvent) => {
      if (event.key === 'Backspace') {
        const lines = value.split('\n')
        if (!lines[lines.length - 1]) {
          setHeight((prevHeight) =>
            prevHeight > TEXTAREA_HEIGHT
              ? prevHeight - TEXTAREA_HEIGHT
              : prevHeight,
          )
        }
      }
    },
    [value],
  )
  return (
    <Textarea
      height={height}
      placeholder={placeholder}
      onChange={onChangeValue}
      onKeyPress={onKeyPress}
      onKeyDown={onKeyDown}
      value={value}
    />
  )
}

export default InputTitle

const Textarea = styled.textarea<{ height: number }>`
  height: ${({ height }) => height}px;
  width: 100%;
  font-size: 2.75rem;
  font-weight: bold;
  line-height: 1.5;
  resize: none;
  border: none;
  outline: none;
  margin: 0;
  padding: 0;
`
