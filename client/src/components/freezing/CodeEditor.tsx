import {
  Dispatch,
  SetStateAction,
  useState,
  useCallback,
  useEffect,
  ChangeEvent,
} from 'react'
import AceEditor from 'react-ace'
import styled from '@emotion/styled'
import path from 'path'
import Input from '@src/components/freezing/Input'
import Select from '@src/components/freezing/Select'
import { EXT_TO_LANG } from '@src/constants'
import { CodeLanguage } from '@src/types'

import 'ace-builds/src-noconflict/mode-typescript'
import 'ace-builds/src-noconflict/mode-javascript'
import 'ace-builds/src-noconflict/mode-java'
import 'ace-builds/src-noconflict/mode-python'
import 'ace-builds/src-noconflict/theme-tomorrow'

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
              { label: 'hello', value: 'world' },
              { label: 'world', value: 'hello' },
            ]}
            onChange={() => {}}
            value=""
          />
        </div>
      </Toobar>
      <AceEditor
        style={{ width: '100%' }}
        setOptions={{ useWorker: false }}
        mode={lang}
        theme="tomorrow"
        fontSize={16}
        highlightActiveLine={false}
        tabSize={2}
        onChange={onChangeValue}
        value={code.value}
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
