import React, { useState } from 'react'
import AceEditor from 'react-ace'
import styled from '@emotion/styled'
import { CODE_MODE } from '@src/constants'
import { CodeMode } from '@src/types'

import 'ace-builds/src-noconflict/mode-typescript'
import 'ace-builds/src-noconflict/mode-javascript'
import 'ace-builds/src-noconflict/mode-java'
import 'ace-builds/src-noconflict/theme-tomorrow'

function CodeEditor() {
  const [mode, setMode] = useState<CodeMode>('javascript')
  const [value, setValue] = useState('')

  const onChangeMode = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setMode(event.target.value as CodeMode)
  }

  return (
    <div>
      <Toobar>
        <select value={mode} onChange={onChangeMode}>
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
        mode={mode}
        theme="tomorrow"
        fontSize={16}
        highlightActiveLine={false}
        tabSize={2}
        onChange={setValue}
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
