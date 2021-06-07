import '../styles/globals.css'

import AppMain from '@src/components/AppMain'
import type { AppProps } from 'next/app'
import { RecoilRoot } from 'recoil'

function App(props: AppProps) {
  return (
    <RecoilRoot>
      <AppMain {...props} />
    </RecoilRoot>
  )
}
export default App
