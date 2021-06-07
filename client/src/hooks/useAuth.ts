import { useCallback } from 'react'
import { User } from '@src/types'
import { useUserState } from '@src/atoms/authState'

export default function useAuth() {
  const [, setUserState] = useUserState()
  const authorize = useCallback((user: User) => {
    setUserState(user)
  }, [])

  const logout = useCallback(() => {
    setUserState(null)
  }, [])
  return {
    authorize,
    logout,
  }
}
