import { useEffect, useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { createAdminDoctor, getAdminDashboard, getAdminDoctors, getAdminReports, getAdminVerifications } from '../utils/api'

const tabs = [
  { id: 'dashboard', label: 'Admin Dashboard' },
  { id: 'doctors', label: 'Doctor Network' },
  { id: 'verify', label: 'Verify Profiles' },
  { id: 'reports', label: 'Reports' }
]

const defaultDoctors = [
  { name: 'Dr. Asha Mehta', specialty: 'Cardiology', status: 'Active' },
  { name: 'Dr. Rohan Singh', specialty: 'Endocrinology', status: 'Active' },
  { name: 'Dr. Kavita Sharma', specialty: 'Pediatrics', status: 'Pending' }
]

const defaultVerifications = [
  { name: 'Rahul Jain', type: 'Patient', submitted: 'May 18, 2026' },
  { name: 'Nidhi Kapoor', type: 'Hospital', submitted: 'May 12, 2026' }
]

const defaultReportStats = [
  { title: 'Hospital Report Uploads', value: '48', change: '+12%' },
  { title: 'Doctor Notes Processed', value: '320', change: '+8%' }
]

export default function AdminView() {
  const { auth } = useAuth()
  const token = auth?.token
  const [activeTab, setActiveTab] = useState('dashboard')
  const [dashboard, setDashboard] = useState<any>(null)
  const [doctors, setDoctors] = useState<any[]>(defaultDoctors)
  const [verifications, setVerifications] = useState<any[]>(defaultVerifications)
  const [reportStats, setReportStats] = useState<any[]>(defaultReportStats)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [doctorMessage, setDoctorMessage] = useState('')
  const [doctorError, setDoctorError] = useState('')
  const [doctorForm, setDoctorForm] = useState({
    name: '',
    username: '',
    email: '',
    password: '',
    specialty: '',
    hospitalName: '',
    qualifications: '',
    phone: ''
  })

  useEffect(() => {
    if (!token) return

    setLoading(true)
    setError('')

    Promise.all([getAdminDashboard(token), getAdminDoctors(token), getAdminVerifications(token), getAdminReports(token)])
      .then(([dashboardData, doctorsData, verificationsData, reportsData]) => {
        setDashboard(dashboardData)
        setDoctors(doctorsData || defaultDoctors)
        setVerifications(verificationsData || defaultVerifications)
        setReportStats(reportsData || defaultReportStats)
      })
      .catch((err) => setError(err instanceof Error ? err.message : 'Unable to load admin data'))
      .finally(() => setLoading(false))
  }, [token])

  async function handleCreateDoctor(event: React.FormEvent) {
    event.preventDefault()
    setDoctorMessage('')
    setDoctorError('')

    try {
      const payload = {
        name: doctorForm.name.trim(),
        username: doctorForm.username.trim(),
        email: doctorForm.email.trim(),
        password: doctorForm.password.trim(),
        specialty: doctorForm.specialty.trim(),
        hospitalName: doctorForm.hospitalName.trim(),
        qualifications: doctorForm.qualifications.trim(),
        phone: doctorForm.phone.trim()
      }
      const response = await createAdminDoctor(token, payload)
      const updatedDoctors = await getAdminDoctors(token)
      setDoctors(updatedDoctors || defaultDoctors)
      setDoctorForm({ name: '', username: '', email: '', password: '', specialty: '', hospitalName: '', qualifications: '', phone: '' })
      setDoctorMessage(response.message || 'Doctor account created')
    } catch (err) {
      setDoctorError(err instanceof Error ? err.message : 'Unable to create doctor account')
    }
  }

  function updateDoctorForm(field: keyof typeof doctorForm, value: string) {
    setDoctorForm((current) => ({ ...current, [field]: value }))
  }

  function renderSection() {
    switch (activeTab) {
      case 'doctors':
        return (
          <section className="space-y-6 rounded-3xl bg-white p-6 shadow-sm">
            <div>
              <h2 className="text-2xl font-semibold text-slate-900">Doctor Network</h2>
              <p className="mt-2 text-slate-600">Create doctor accounts, manage credentials, and review hospital affiliations.</p>
            </div>

            <form className="grid gap-4 rounded-3xl border border-slate-200 bg-slate-50 p-5 lg:grid-cols-2" onSubmit={handleCreateDoctor}>
              <div className="lg:col-span-2">
                <h3 className="text-lg font-semibold text-slate-900">Add Doctor</h3>
              </div>
              <input value={doctorForm.name} onChange={(event) => updateDoctorForm('name', event.target.value)} placeholder="Doctor full name" className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none" />
              <input value={doctorForm.specialty} onChange={(event) => updateDoctorForm('specialty', event.target.value)} placeholder="Specialty" className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none" />
              <input value={doctorForm.username} onChange={(event) => updateDoctorForm('username', event.target.value)} placeholder="Login username" className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none" />
              <input type="email" value={doctorForm.email} onChange={(event) => updateDoctorForm('email', event.target.value)} placeholder="Email address" className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none" />
              <input type="password" value={doctorForm.password} onChange={(event) => updateDoctorForm('password', event.target.value)} placeholder="Temporary password" className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none" />
              <input value={doctorForm.phone} onChange={(event) => updateDoctorForm('phone', event.target.value)} placeholder="Phone number" className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none" />
              <input value={doctorForm.hospitalName} onChange={(event) => updateDoctorForm('hospitalName', event.target.value)} placeholder="Hospital or clinic" className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none" />
              <input value={doctorForm.qualifications} onChange={(event) => updateDoctorForm('qualifications', event.target.value)} placeholder="Qualifications" className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none" />
              {doctorError && <p className="text-sm text-rose-600 lg:col-span-2">{doctorError}</p>}
              {doctorMessage && <p className="text-sm text-emerald-600 lg:col-span-2">{doctorMessage}</p>}
              <button className="rounded-2xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white hover:bg-slate-700 lg:col-span-2">Create Doctor Account</button>
            </form>

            <div className="grid gap-4 sm:grid-cols-2">
              {doctors.map((doctor) => (
                <div key={`${doctor.username || doctor.name}-${doctor.specialty}`} className="rounded-3xl border border-slate-200 p-5">
                  <p className="text-sm text-slate-500">{doctor.specialty}</p>
                  <h3 className="mt-2 text-xl font-semibold text-slate-900">{doctor.name}</h3>
                  <p className="mt-3 text-sm text-slate-600">Status: {doctor.status}</p>
                  {doctor.username && <p className="mt-1 text-sm text-slate-500">Username: {doctor.username}</p>}
                  {doctor.hospital && <p className="mt-1 text-sm text-slate-500">Hospital: {doctor.hospital}</p>}
                </div>
              ))}
            </div>
          </section>
        )
      case 'verify':
        return (
          <section className="space-y-6 rounded-3xl bg-white p-6 shadow-sm">
            <h2 className="text-2xl font-semibold text-slate-900">Verify Profiles</h2>
            <p className="text-slate-600">Approve pending profile verifications for patients, doctors, and hospitals.</p>
            <div className="space-y-4">
              {verifications.map((item) => (
                <div key={item.name} className="rounded-3xl border border-slate-200 bg-slate-50 p-5 sm:flex sm:items-center sm:justify-between">
                  <div>
                    <p className="font-semibold text-slate-900">{item.name}</p>
                    <p className="text-sm text-slate-600">{item.type} · Submitted {item.submitted}</p>
                  </div>
                  <button className="rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-700">Verify</button>
                </div>
              ))}
            </div>
          </section>
        )
      case 'reports':
        return (
          <section className="rounded-3xl bg-white p-6 shadow-sm">
            <h2 className="text-2xl font-semibold text-slate-900">Report Insights</h2>
            <p className="mt-2 text-slate-600">Track operational metrics and platform health reports for executive review.</p>
            <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {reportStats.map((item) => (
                <div key={item.title} className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
                  <p className="text-sm text-slate-500">{item.title}</p>
                  <p className="mt-3 text-3xl font-semibold text-slate-900">{item.value}</p>
                  <p className="mt-2 text-sm text-slate-600">Change: {item.change}</p>
                </div>
              ))}
            </div>
          </section>
        )
      default:
        return (
          <section className="grid gap-6 lg:grid-cols-4">
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <p className="text-sm text-slate-500">Hospital Accounts</p>
              <p className="mt-3 text-4xl font-bold text-slate-900">{dashboard?.hospitalAccounts ?? 14}</p>
            </div>
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <p className="text-sm text-slate-500">Pending Verifications</p>
              <p className="mt-3 text-4xl font-bold text-slate-900">{dashboard?.pendingVerifications ?? 2}</p>
            </div>
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <p className="text-sm text-slate-500">Active Doctors</p>
              <p className="mt-3 text-4xl font-bold text-slate-900">{dashboard?.activeDoctors ?? 38}</p>
            </div>
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <p className="text-sm text-slate-500">Platform Sessions</p>
              <p className="mt-3 text-4xl font-bold text-slate-900">{dashboard?.platformSessions ?? 12400}</p>
            </div>
          </section>
        )
    }
  }

  return (
    <div className="space-y-6 rounded-3xl bg-white p-6 shadow-sm">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-slate-900">Admin Command Center</h2>
          <p className="mt-2 text-slate-600">Monitor platform activity, verify users, and manage doctors across the MediHistory ecosystem.</p>
        </div>
      </div>

      {error && <div className="rounded-3xl border border-rose-200 bg-rose-50 p-5 text-rose-700">{error}</div>}
      {loading && <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5 text-slate-600">Loading admin data...</div>}

      <nav className="flex flex-wrap gap-2">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            className={`rounded-full px-4 py-2 text-sm font-medium transition ${
              activeTab === tab.id ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </nav>

      {renderSection()}
    </div>
  )
}
