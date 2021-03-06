import { useEffect } from 'react'
import { AppProps } from 'next/app'
import { useRouter } from 'next/router'
import { AxiosError } from 'axios'
import Header from '@src/components/Header'
import { useUserState } from '@src/atoms/authState'
import { apiGet, registerAccessToken } from '@src/api'
import { User } from '@src/types'

function AppMain({ Component, pageProps }: AppProps) {
  const router = useRouter()
  const [, setUser] = useUserState()

  const isErrorPage = router.pathname === '/404'

  useEffect(() => {
    apiGet<User>('/users')
      .then(setUser)
      .catch((error: AxiosError) => {
        const { response } = error
        if (!response) {
          console.log(error)
          return
        }
        if (response.status === 401) {
          apiGet<{ accessToken: string; user: User }>('/auth/refresh')
            .then(({ accessToken, user }) => {
              registerAccessToken(accessToken)
              setUser(user)
            })
            .catch(console.log)
        }
      })
  }, [setUser, router.pathname])
  return (
    <>
      {!isErrorPage && <Header />}
      <Component {...pageProps} />
    </>
  )
}

export default AppMain
