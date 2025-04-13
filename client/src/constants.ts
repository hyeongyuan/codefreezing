import { CodeLanguage } from '@src/types'

interface ExtToLang {
  [index: string]: CodeLanguage
}

export const EXT_TO_LANG: ExtToLang = {
  '.js': 'javascript',
  '.ts': 'typescript',
  '.java': 'java',
  '.py': 'python',
}

export const EDITOR_HEIGHT = 550
