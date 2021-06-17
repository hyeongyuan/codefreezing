import Avatar from '@src/components/common/Avatar'
import useInputs from '@src/hooks/useInputs'

export interface RegisterFormType {
  email: string
  username: string
  thumbnail: string | null
}

export interface RegisterFormProps {
  onSubmit: (form: RegisterFormType) => any
  defaultInfo?: RegisterFormType
}

function RegisterForm({ onSubmit, defaultInfo }: RegisterFormProps) {
  const [form, onChange] = useInputs({
    email: defaultInfo ? defaultInfo.email : '',
    username: defaultInfo ? defaultInfo.username : '',
    thumbnail: defaultInfo ? defaultInfo.thumbnail : '',
  })
  return (
    <div>
      <Avatar imageUrl={form.thumbnail || ''} size={100} />
      <p>이메일</p>
      <input
        type="text"
        name="email"
        onChange={onChange}
        value={form.email || ''}
      />
      <p>닉네임</p>
      <input
        type="text"
        name="username"
        onChange={onChange}
        value={form.username || ''}
      />
      <button onClick={() => onSubmit(form)}>가입하기</button>
    </div>
  )
}

export default RegisterForm
