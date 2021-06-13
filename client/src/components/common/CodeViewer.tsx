import { useEffect } from 'react'
import Prism from 'prismjs'
import { CodeLanguage } from '@src/types'
import styled from '@emotion/styled'

import 'prismjs/components/prism-bash.min'
import 'prismjs/components/prism-typescript.min'
import 'prismjs/components/prism-javascript.min'
import 'prismjs/components/prism-markup-templating.min'
import 'prismjs/components/prism-jsx.min'
import 'prismjs/components/prism-css.min'
import 'prismjs/components/prism-python.min'
import 'prismjs/components/prism-go.min'
import 'prismjs/components/prism-java.min'
import 'prismjs/components/prism-c.min'
import 'prismjs/components/prism-cpp.min'

interface CodeViewerProps {
  language: CodeLanguage
  content: string
}

function CodeViewer({ language, content }: CodeViewerProps) {
  useEffect(() => {
    Prism.highlightAll()
  }, [language, content])
  return (
    <Container>
      <pre
        style={{
          padding: '4px 8px',
          border: '1px solid #ebebeb',
          background: '#fbfbfb',
          borderRadius: 4,
          lineHeight: '1.6rem',
          marginTop: 0,
          marginBottom: '1em',
          height: 150,
        }}
      >
        <code className={`language-${language}`} style={{ fontSize: '0.8rem' }}>
          {content}
        </code>
      </pre>
    </Container>
  )
}

export default CodeViewer

const Container = styled.div`
  /* .token.keyword {
    color: #c678dd;
  }
  .token.function {
    color: #61afef;
  }
  .token.string {
    color: #50a14f;
  }
  .token.number {
    color: #986801;
  } */
`
