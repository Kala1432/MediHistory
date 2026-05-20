import { useEffect, useMemo, useState } from 'react'
import PatientView from './components/PatientView'
import DoctorView from './components/DoctorView'
import AdminView from './components/AdminView'
import AuthView from './components/AuthView'
import { useAuth } from './context/AuthContext'

function App() {
  const { auth, logout } = useAuth()
  const [role, setRole] = useState('patient')

  useEffect(() => {
    if (auth?.role) {
      setRole(auth.role)
    }
  }, [auth?.role])

  const content = useMemo(() => {
    switch (role) {
      case 'doctor':
        return <DoctorView />
      case 'admin':
        return <AdminView />
      default:
        return <PatientView />
    }
  }, [role])

  if (!auth?.token) {
    return <AuthView />
  }

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900">
      <div className="mx-auto max-w-7xl p-6">
        <header className="mb-8 rounded-3xl bg-white p-6 shadow-sm">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-3xl font-semibold text-slate-900">MediHistory</h1>
              <p className="mt-2 text-slate-600">Secure health records for patients, doctors, and administrators.</p>
            </div>
            <div className="flex flex-wrap items-center gap-3 text-sm text-slate-600">
              <span className="rounded-full border border-slate-200 bg-slate-50 px-4 py-2">{auth.username} ({auth.role})</span>
              <button
                onClick={logout}
                className="rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-700"
              >
                Logout
              </button>
            </div>
          </div>
        </header>

        <main className="space-y-6">{content}</main>
      </div>
    </div>
  )
}

export default App
