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
  onClick?: () => void
  language: CodeLanguage
  content: string
  hoverColor?: string
}

function CodeViewer({
  onClick = () => {},
  language,
  content,
  hoverColor,
}: CodeViewerProps) {
  useEffect(() => {
    Prism.highlightAll()
  }, [language, content])
  return (
    <Container onClick={onClick}>
      <CodeWrapper borderCoder={hoverColor}>
        <pre
          style={{
            height: 150,
            borderRadius: 5,
            backgroundColor: '#fbfbfb',
            margin: 0,
          }}
        >
          <code
            className={`language-${language}`}
            style={{ fontSize: '0.8rem' }}
          >
            {content}
          </code>
        </pre>
      </CodeWrapper>
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
const CodeWrapper = styled.div<{ borderCoder?: string }>`
  margin-top: 8px;
  margin-bottom: 8px;
  border-width: 1px;
  border-style: solid;
  border-color: #ebebeb;
  border-radius: 5px;

  ${({ borderCoder }) =>
    borderCoder &&
    `
      cursor: pointer;
      :hover {
        border-color: ${borderCoder};
      }
    `}
`
