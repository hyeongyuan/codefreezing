import { atom, useRecoilState } from 'recoil'
import { User } from '@src/types'

export const userState = atom<User | null>({
  key: 'userState',
  default: null,
})

export function useUserState() {
  return useRecoilState(userState)
}
