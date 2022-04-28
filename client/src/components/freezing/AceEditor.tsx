import ReactAce from 'react-ace'
import { EDITOR_HEIGHT } from '@src/constants'

import 'ace-builds/src-noconflict/mode-typescript'
import 'ace-builds/src-noconflict/mode-javascript'
import 'ace-builds/src-noconflict/mode-java'
import 'ace-builds/src-noconflict/mode-python'
import 'ace-builds/src-noconflict/theme-tomorrow'

interface AceProps {
  mode?: string
  value?: string
  onChange?: (value: string, event?: any) => void
  tabSize?: number
}

function AceEditor({ mode, value, tabSize, onChange }: AceProps) {
  return (
    <ReactAce
      style={{ width: '100%', height: EDITOR_HEIGHT }}
      setOptions={{ useWorker: false }}
      mode={mode}
      theme="tomorrow"
      fontSize={16}
      highlightActiveLine={false}
      tabSize={tabSize}
      onChange={onChange}
      value={value}
    />
  )
}

export default AceEditor
