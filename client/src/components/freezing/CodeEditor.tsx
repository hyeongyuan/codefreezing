import {
  Dispatch,
  SetStateAction,
  useState,
  useCallback,
  useEffect,
  ChangeEvent,
} from 'react'
import dynamic from 'next/dynamic'
import styled from '@emotion/styled'
import path from 'path'
import Input from '@src/components/freezing/Input'
import Select from '@src/components/freezing/Select'
import { EDITOR_HEIGHT, EXT_TO_LANG } from '@src/constants'
import { CodeLanguage } from '@src/types'

const AceEditor = dynamic(() => import('@src/components/freezing/AceEditor'), {
  ssr: false,
  loading: () => (
    <div
      style={{
        display: 'flex',
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        height: EDITOR_HEIGHT,
      }}
    >
      <p>Loading...</p>
    </div>
  ),
})

export interface CodeInfo {
  value: string
  filename: string
}

interface CodeEditorProps {
  placeholder?: string
  code: CodeInfo
  onChange: Dispatch<SetStateAction<CodeInfo>>
}

function CodeEditor({ code, onChange }: CodeEditorProps) {
  const [lang, setLang] = useState<CodeLanguage>('text')

  useEffect(() => {
    setLang(EXT_TO_LANG[path.extname(code.filename)] || 'text')
  }, [code.filename])

  const onChangeFilename = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      onChange((prev) => ({ ...prev, filename: event.target.value }))
    },
    [],
  )
  const onChangeValue = useCallback((value: string) => {
    onChange((prev) => ({ ...prev, value }))
  }, [])
  return (
    <Container>
      <Toobar>
        <Input
          placeholder="Filename including extension..."
          onChange={onChangeFilename}
          value={code.filename}
        />
        <div>
          <Select
            options={[
              { label: '2', value: '2' },
              { label: '4', value: '4' },
            ]}
            onChange={() => {}}
            placeholder="Indent size"
            value=""
          />
        </div>
      </Toobar>
      <AceEditor
        mode={lang}
        onChange={onChangeValue}
        value={code.value}
        tabSize={2}
      />
    </Container>
  )
}

export default CodeEditor

const Container = styled.div`
  border: 1px solid #dddddd;
  border-radius: 6px;
  background-color: #fafbfc;
`

const Toobar = styled.div`
  display: flex;
  align-items: center;
  padding: 5px 10px;
  border-bottom: 1px solid #dddddd;
`
