import { ChangeEvent } from 'react'

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
    <select value={value} onChange={onChange}>
      <optgroup label={placeholder}>
        {options.map(({ label, value }, index) => (
          <option key={index} value={value}>
            {label}
          </option>
        ))}
      </optgroup>
    </select>
  )
}

export default SelectComponent
