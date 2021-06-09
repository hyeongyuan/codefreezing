import React, { Dispatch, SetStateAction, useCallback, useState } from 'react'
import AceEditor from 'react-ace'
import styled from '@emotion/styled'
import { CODE_MODE } from '@src/constants'
import { CodeLanguage } from '@src/types'

import 'ace-builds/src-noconflict/mode-typescript'
import 'ace-builds/src-noconflict/mode-javascript'
import 'ace-builds/src-noconflict/mode-java'
import 'ace-builds/src-noconflict/mode-python'
import 'ace-builds/src-noconflict/theme-tomorrow'

export interface CodeInfo {
  value: string
  language: CodeLanguage
}

interface CodeEditorProps {
  placeholder?: string
  code: CodeInfo
  onChange: Dispatch<SetStateAction<CodeInfo>>
}

function CodeEditor({ code, onChange }: CodeEditorProps) {
  const onChangeLang = useCallback(
    (event: React.ChangeEvent<HTMLSelectElement>) => {
      const language = event.target.value as CodeLanguage
      onChange((prev) => ({ ...prev, language }))
    },
    [],
  )
  const onChangeValue = useCallback((value: string) => {
    onChange((prev) => ({ ...prev, value }))
  }, [])
  return (
    <div>
      <Toobar>
        <select value={code.language} onChange={onChangeLang}>
          {CODE_MODE.map((mode) => (
            <option key={mode} value={mode}>
              {mode}
            </option>
          ))}
        </select>
      </Toobar>
      <AceEditor
        style={{ width: '100%' }}
        setOptions={{ useWorker: false }}
        mode={code.language}
        theme="tomorrow"
        fontSize={16}
        highlightActiveLine={false}
        tabSize={2}
        onChange={onChangeValue}
        value={code.value}
      />
    </div>
  )
}

export default CodeEditor

const Toobar = styled.div`
  padding-left: 3rem;
  padding-right: 3rem;
  margin-bottom: 1rem;
`
