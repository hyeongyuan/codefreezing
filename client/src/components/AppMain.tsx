import { useEffect } from 'react'
import { AppProps } from 'next/app'
import axios, { AxiosError } from 'axios'
import { useUserState } from '@src/atoms/authState'
import { registerAccessToken } from '@src/api'

function AppMain({ Component, pageProps }: AppProps) {
  const [, setUser] = useUserState()
  useEffect(() => {
    axios
      .get('/users')
      .then((reponse) => {
        setUser(reponse.data)
      })
      .catch((error: AxiosError) => {
        const { response } = error
        if (!response) {
          console.log(error)
          return
        }
        if (response.status === 401) {
          axios
            .get('/auth/refresh')
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
  }, [setUser])
  return <Component {...pageProps} />
}

export default AppMain
