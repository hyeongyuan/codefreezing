import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { apiGet, apiPost } from '@src/api'
import { SocialProfile } from '@src/types'
import RegisterForm, {
  RegisterFormType,
} from '@src/components/register/RegisterForm'

function RegisterPage() {
  const router = useRouter()
  const [socialProfile, setSocialProfile] = useState<SocialProfile>()

  useEffect(() => {
    if (!router.query.social) {
      return
    }
    const onGetSocialProfile = async () => {
      const { data } = await apiGet('/auth/profile')

      setSocialProfile(data)
    }
    onGetSocialProfile()
  }, [router.query])

  const onSubmit = async (data: RegisterFormType) => {
    try {
      await apiPost('/auth/register', data)

      await apiGet('/users')
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
        }}
      />
    </div>
  )
}

export default RegisterPage
