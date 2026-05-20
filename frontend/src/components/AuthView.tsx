import { useState } from 'react'
import { useAuth } from '../context/AuthContext'

export default function AuthView() {
  const { login, register } = useAuth()
  const [isRegister, setIsRegister] = useState(false)
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [phone, setPhone] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    setError('')
    setSuccess('')

    try {
      const cleanedUsername = username.trim()
      const cleanedEmail = email.trim()
      const cleanedPassword = password.trim()

      if (isRegister) {
        const message = await register({
          username: cleanedUsername,
          email: cleanedEmail,
          password: cleanedPassword,
          phone: phone.trim()
        })
        setSuccess(message)
        setIsRegister(false)
      } else {
        await login({ usernameOrEmail: cleanedUsername || cleanedEmail, password: cleanedPassword })
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to authenticate')
    }
  }

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900">
      <div className="mx-auto max-w-2xl p-6">
        <div className="rounded-3xl bg-white p-8 shadow-sm">
          <div className="mb-6 flex items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-semibold">MediHistory</h1>
              <p className="mt-2 text-slate-600">Secure login for care teams and patient-only account registration.</p>
            </div>
            <button
              className="rounded-full border border-slate-200 bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-900 hover:bg-slate-200"
              onClick={() => setIsRegister(!isRegister)}
            >
              {isRegister ? 'Switch to Login' : 'Create Account'}
            </button>
          </div>

          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">Username or Email</label>
              <input
                type="text"
                value={username}
                onChange={(event) => setUsername(event.target.value)}
                placeholder={isRegister ? 'Choose a username' : 'Username or email'}
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none"
              />
            </div>
            {isRegister && (
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="Email address"
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none"
                />
              </div>
            )}
            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">Password</label>
              <input
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="Password"
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none"
              />
            </div>
            {isRegister && (
              <>
                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700">Phone</label>
                  <input
                    type="text"
                    value={phone}
                    onChange={(event) => setPhone(event.target.value)}
                    placeholder="Phone number"
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none"
                  />
                </div>
              </>
            )}

            {error && <p className="text-sm text-rose-600">{error}</p>}
            {success && <p className="text-sm text-emerald-600">{success}</p>}

            <button className="w-full rounded-2xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white hover:bg-slate-700">
              {isRegister ? 'Register' : 'Login'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
