import useInputs from '@src/hooks/useInputs'

export interface RegisterFormType {
  email: string
  username: string
}

export interface RegisterFormProps {
  onSubmit: (form: RegisterFormType) => any
  defaultInfo?: {
    email: string
    username: string
  }
}

function RegisterForm({ onSubmit, defaultInfo }: RegisterFormProps) {
  const [form, onChange] = useInputs({
    email: defaultInfo ? defaultInfo.email : '',
    username: defaultInfo ? defaultInfo.username : '',
  })
  return (
    <div>
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
