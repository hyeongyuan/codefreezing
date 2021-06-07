import { useEffect } from 'react'
import { AppProps } from 'next/app'
import { apiGet } from '@src/api'
import { useUserState } from '@src/atoms/authState'

function AppMain({ Component, pageProps }: AppProps) {
  const [, setUser] = useUserState()
  useEffect(() => {
    apiGet('/users').then(({ data }) => {
      setUser(data)
    })
  }, [setUser])
  return <Component {...pageProps} />
}

export default AppMain
