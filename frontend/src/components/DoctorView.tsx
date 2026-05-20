import { useEffect, useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { createDoctorPrescription, getDoctorAppointments, getDoctorDashboard, getDoctorPatients, uploadDoctorReport } from '../utils/api'

const tabs = [
  { id: 'dashboard', label: 'Doctor Dashboard' },
  { id: 'search', label: 'Patient Search' },
  { id: 'prescription', label: 'Add Prescription' },
  { id: 'reports', label: 'Upload Reports' },
  { id: 'schedule', label: 'Appointment Schedule' }
]

const defaultPatients = [
  { name: 'Sneha Patel', age: 32, condition: 'Hypertension', lastVisit: 'May 2, 2026' },
  { name: 'Arjun Mehta', age: 45, condition: 'Type 2 Diabetes', lastVisit: 'Apr 18, 2026' },
  { name: 'Nisha Rao', age: 28, condition: 'Asthma', lastVisit: 'Mar 22, 2026' }
]

const defaultSchedule = [
  { date: 'May 25, 2026', time: '10:00 AM', patient: 'Sneha Patel', type: 'Follow-up' },
  { date: 'May 26, 2026', time: '02:00 PM', patient: 'Arjun Mehta', type: 'Prescription review' }
]

export default function DoctorView() {
  const { auth } = useAuth()
  const token = auth?.token
  const [activeTab, setActiveTab] = useState('dashboard')
  const [searchTerm, setSearchTerm] = useState('')
  const [dashboard, setDashboard] = useState<any>(null)
  const [patients, setPatients] = useState<any[]>(defaultPatients)
  const [schedule, setSchedule] = useState<any[]>(defaultSchedule)
  const [reportType, setReportType] = useState('Lab Report')
  const [patientUsername, setPatientUsername] = useState('')
  const [reportNotes, setReportNotes] = useState('')
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [uploadMessage, setUploadMessage] = useState('')
  const [uploadError, setUploadError] = useState('')
  const [prescriptionMessage, setPrescriptionMessage] = useState('')
  const [prescriptionError, setPrescriptionError] = useState('')
  const [prescriptionForm, setPrescriptionForm] = useState({
    patientUsername: '',
    name: '',
    dosage: '',
    frequency: '',
    notes: ''
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!token) return

    setLoading(true)
    setError('')

    Promise.all([getDoctorDashboard(token), getDoctorPatients(token), getDoctorAppointments(token)])
      .then(([dashboardData, patientData, scheduleData]) => {
        setDashboard(dashboardData)
        setPatients(patientData || defaultPatients)
        setSchedule(scheduleData || defaultSchedule)
      })
      .catch((err) => setError(err instanceof Error ? err.message : 'Unable to load doctor data'))
      .finally(() => setLoading(false))
  }, [token])

  const filteredPatients = patients.filter((patient) => patient.name.toLowerCase().includes(searchTerm.toLowerCase()))

  function renderSection() {
    switch (activeTab) {
      case 'search':
        return (
          <section className="space-y-6">
            <div className="rounded-3xl bg-white p-6 shadow-sm">
              <h2 className="text-2xl font-semibold text-slate-900">Patient Search</h2>
              <p className="mt-2 text-slate-600">Search patient records and access history for consultations.</p>
              <div className="mt-6">
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(event) => setSearchTerm(event.target.value)}
                  placeholder="Search by patient name"
                  className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none"
                />
              </div>
              <div className="mt-6 space-y-4">
                {filteredPatients.map((patient) => (
                  <div key={patient.name} className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
                    <p className="text-lg font-semibold text-slate-900">{patient.name}</p>
                    <p className="text-slate-600">Age: {patient.age} · Condition: {patient.condition}</p>
                    <p className="text-slate-500">Last visit: {patient.lastVisit}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )
      case 'prescription':
        return (
          <section className="rounded-3xl bg-white p-6 shadow-sm">
            <h2 className="text-2xl font-semibold text-slate-900">Generate Digital Prescription</h2>
            <p className="mt-2 text-slate-600">Create prescriptions and share them directly with patients.</p>
            {prescriptionMessage && <div className="mt-4 rounded-3xl border border-emerald-200 bg-emerald-50 p-4 text-emerald-700">{prescriptionMessage}</div>}
            {prescriptionError && <div className="mt-4 rounded-3xl border border-rose-200 bg-rose-50 p-4 text-rose-700">{prescriptionError}</div>}
            <form
              className="mt-6 space-y-4"
              onSubmit={async (event) => {
                event.preventDefault()
                setPrescriptionMessage('')
                setPrescriptionError('')
                try {
                  await createDoctorPrescription(token, prescriptionForm)
                  setPrescriptionMessage(`Prescription saved for ${prescriptionForm.patientUsername}`)
                  setPrescriptionForm({ patientUsername: '', name: '', dosage: '', frequency: '', notes: '' })
                } catch (err) {
                  setPrescriptionError(err instanceof Error ? err.message : 'Unable to save prescription')
                }
              }}
            >
              <input value={prescriptionForm.patientUsername} onChange={(event) => setPrescriptionForm({ ...prescriptionForm, patientUsername: event.target.value })} type="text" placeholder="Patient username" className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none" />
              <input value={prescriptionForm.name} onChange={(event) => setPrescriptionForm({ ...prescriptionForm, name: event.target.value })} type="text" placeholder="Medication name" className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none" />
              <input value={prescriptionForm.dosage} onChange={(event) => setPrescriptionForm({ ...prescriptionForm, dosage: event.target.value })} type="text" placeholder="Dosage" className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none" />
              <input value={prescriptionForm.frequency} onChange={(event) => setPrescriptionForm({ ...prescriptionForm, frequency: event.target.value })} type="text" placeholder="Frequency" className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none" />
              <textarea value={prescriptionForm.notes} onChange={(event) => setPrescriptionForm({ ...prescriptionForm, notes: event.target.value })} rows={4} placeholder="Diagnosis notes" className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none" />
              <button className="rounded-2xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white hover:bg-slate-700">Save Prescription</button>
            </form>
          </section>
        )
      case 'reports':
        return (
          <section className="rounded-3xl bg-white p-6 shadow-sm">
            <h2 className="text-2xl font-semibold text-slate-900">Upload Lab Reports</h2>
            <p className="mt-2 text-slate-600">Upload patient lab reports securely to AWS S3 and store metadata in the MediHistory database.</p>
            {uploadMessage && <div className="mt-4 rounded-3xl border border-emerald-200 bg-emerald-50 p-4 text-emerald-700">{uploadMessage}</div>}
            {uploadError && <div className="mt-4 rounded-3xl border border-rose-200 bg-rose-50 p-4 text-rose-700">{uploadError}</div>}
            <form
              className="mt-6 grid gap-4"
              onSubmit={async (event) => {
                event.preventDefault()
                if (!token) {
                  setUploadError('Authentication required to upload reports.')
                  return
                }
                if (!selectedFile) {
                  setUploadError('Please choose a file to upload.')
                  return
                }
                if (!patientUsername.trim()) {
                  setUploadError('Please enter the patient username.')
                  return
                }

                setUploadMessage('')
                setUploadError('')
                setLoading(true)

                try {
                  const formData = new FormData()
                  formData.append('patientUsername', patientUsername.trim())
                  formData.append('reportType', reportType)
                  formData.append('notes', reportNotes)
                  formData.append('file', selectedFile)

                  const response = await uploadDoctorReport(token, formData)
                  setUploadMessage(response.message || 'Report uploaded successfully.')
                  setPatientUsername('')
                  setReportNotes('')
                  setSelectedFile(null)
                } catch (err) {
                  setUploadError(err instanceof Error ? err.message : 'Upload failed. Please try again.')
                } finally {
                  setLoading(false)
                }
              }}
            >
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="block">
                  <span className="text-sm font-medium text-slate-700">Patient username</span>
                  <input
                    type="text"
                    value={patientUsername}
                    onChange={(event) => setPatientUsername(event.target.value)}
                    placeholder="Patient username"
                    className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none"
                  />
                </label>
                <label className="block">
                  <span className="text-sm font-medium text-slate-700">Report type</span>
                  <select
                    value={reportType}
                    onChange={(event) => setReportType(event.target.value)}
                    className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none"
                  >
                    <option>Lab Report</option>
                    <option>Prescription</option>
                    <option>Vaccination</option>
                    <option>Insurance</option>
                  </select>
                </label>
              </div>

              <label className="block">
                <span className="text-sm font-medium text-slate-700">Upload file</span>
                <input
                  type="file"
                  onChange={(event) => setSelectedFile(event.target.files?.[0] || null)}
                  className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none"
                />
              </label>

              <label className="block">
                <span className="text-sm font-medium text-slate-700">Notes</span>
                <textarea
                  rows={4}
                  value={reportNotes}
                  onChange={(event) => setReportNotes(event.target.value)}
                  placeholder="Notes for the report"
                  className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none"
                />
              </label>

              <button
                type="submit"
                disabled={loading}
                className="rounded-2xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white hover:bg-slate-700 disabled:cursor-not-allowed disabled:bg-slate-500"
              >
                {loading ? 'Uploading...' : 'Upload Report'}
              </button>
            </form>
          </section>
        )
      case 'schedule':
        return (
          <section className="space-y-6">
            <div className="rounded-3xl bg-white p-6 shadow-sm">
              <h2 className="text-2xl font-semibold text-slate-900">Appointment Schedule</h2>
              <p className="mt-2 text-slate-600">View upcoming patient consultations and manage follow-ups.</p>
            </div>
            <div className="space-y-4">
              {schedule.map((item) => (
                <div key={`${item.date}-${item.patient}`} className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
                  <p className="text-sm text-slate-500">{item.date} · {item.time}</p>
                  <p className="mt-2 text-lg font-semibold text-slate-900">{item.patient}</p>
                  <p className="text-slate-600">{item.type}</p>
                </div>
              ))}
            </div>
          </section>
        )
      default:
        return (
          <section className="space-y-6">
            <div className="grid gap-6 lg:grid-cols-3">
              <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                <p className="text-sm text-slate-500">Active Patients</p>
                <p className="mt-3 text-4xl font-bold text-slate-900">{dashboard?.activePatients ?? 56}</p>
              </div>
              <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                <p className="text-sm text-slate-500">Pending Reports</p>
                <p className="mt-3 text-4xl font-bold text-slate-900">{dashboard?.pendingReports ?? 12}</p>
              </div>
              <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                <p className="text-sm text-slate-500">Follow-ups Today</p>
                <p className="mt-3 text-4xl font-bold text-slate-900">{dashboard?.followUpsToday ?? 7}</p>
              </div>
            </div>
          </section>
        )
    }
  }

  return (
    <div className="space-y-6 rounded-3xl bg-white p-6 shadow-sm">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-slate-900">Doctor Experience</h2>
          <p className="mt-2 text-slate-600">Access patient history, prescribe medications, upload reports, and manage appointments.</p>
        </div>
      </div>

      {error && <div className="rounded-3xl border border-rose-200 bg-rose-50 p-5 text-rose-700">{error}</div>}
      {loading && <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5 text-slate-600">Loading doctor dashboard...</div>}

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
