import { ChangeEvent } from 'react'
import styled from '@emotion/styled'

export interface IOption {
  label: string
  value: string
}

interface SelectProps {
  value: string
  onChange: (event: ChangeEvent) => void
  options: IOption[]
  placeholder?: string
}

function SelectComponent({
  value,
  onChange,
  options,
  placeholder,
}: SelectProps) {
  return (
    <Select value={value} onChange={onChange}>
      <optgroup label={placeholder}>
        {options.map(({ label, value }, index) => (
          <option key={index} value={value}>
            {label}
          </option>
        ))}
      </optgroup>
    </Select>
  )
}

export default SelectComponent

const Select = styled.select`
  color: #24292e;
  outline: none;
  appearance: none;
  padding: 3px 24px 3px 12px;
  border: 1px solid #dddddd;
  background-image: url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTYiIGhlaWdodD0iMTYiIGZpbGw9IiM1ODYwNjkiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHBhdGggZD0iTTQuNDI3IDkuNDI3bDMuMzk2IDMuMzk2YS4yNTEuMjUxIDAgMDAuMzU0IDBsMy4zOTYtMy4zOTZBLjI1LjI1IDAgMDAxMS4zOTYgOUg0LjYwNGEuMjUuMjUgMCAwMC0uMTc3LjQyN3pNNC40MjMgNi40N0w3LjgyIDMuMDcyYS4yNS4yNSAwIDAxLjM1NCAwTDExLjU3IDYuNDdhLjI1LjI1IDAgMDEtLjE3Ny40MjdINC42YS4yNS4yNSAwIDAxLS4xNzctLjQyN3oiLz48L3N2Zz4=');
  background-repeat: no-repeat;
  background-position: right 6px center;
  background-size: 16px;
  border-radius: 6px;
`
