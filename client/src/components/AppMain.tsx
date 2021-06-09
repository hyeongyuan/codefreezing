import { useEffect } from 'react'
import { AppProps } from 'next/app'
import { useRouter } from 'next/router'
import { AxiosError } from 'axios'
import { useUserState } from '@src/atoms/authState'
import { apiGet, registerAccessToken } from '@src/api'

function AppMain({ Component, pageProps }: AppProps) {
  const router = useRouter()
  const [, setUser] = useUserState()
  useEffect(() => {
    apiGet('/users')
      .then((reponse) => setUser(reponse.data))
      .catch((error: AxiosError) => {
        const { response } = error
        if (!response) {
          console.log(error)
          return
        }
        if (response.status === 401) {
          apiGet('/auth/refresh')
            .then((response) => {
              const { accessToken, user } = response.data

              registerAccessToken(accessToken)

              setUser({
                id: user.id,
                email: user.email,
                username: user.username,
              })
            })
            .catch(console.log)
        }
      })
  }, [setUser, router.pathname])
  return <Component {...pageProps} />
}

export default AppMain
