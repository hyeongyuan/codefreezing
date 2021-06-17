import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import RegisterForm, {
  RegisterFormType,
} from '@src/components/register/RegisterForm'
import { apiGet, apiPost } from '@src/api'
import { SocialProfile } from '@src/types'

function RegisterPage() {
  const router = useRouter()
  const [socialProfile, setSocialProfile] = useState<SocialProfile>()

  useEffect(() => {
    if (!router.query.social) {
      return
    }
    const onGetSocialProfile = async () => {
      const profile = await apiGet<SocialProfile>('/auth/social/profile')
      setSocialProfile(profile)
    }
    onGetSocialProfile()
  }, [router.query])

  const onSubmit = async (data: RegisterFormType) => {
    try {
      await apiPost('/auth/register', data)

      alert('회원가입 성공')

      router.replace('/')
    } catch (error) {
      console.log({ error })
    }
  }

  if (!router.query || !socialProfile) {
    return null
  }
  return (
    <div>
      <h1>회원가입</h1>
      <RegisterForm
        onSubmit={onSubmit}
        defaultInfo={{
          username: socialProfile.name,
          email: socialProfile.email || '',
          thumbnail: socialProfile.thumbnail,
        }}
      />
    </div>
  )
}

export default RegisterPage
