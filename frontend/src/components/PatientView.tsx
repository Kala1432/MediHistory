import { useEffect, useState } from 'react'
import type { ReactNode } from 'react'
import { useAuth } from '../context/AuthContext'
import {
  createPatientAppointment,
  createPatientInsurance,
  createPatientMedicalHistory,
  createPatientReminder,
  deletePatientAppointment,
  deletePatientInsurance,
  deletePatientMedicalHistory,
  deletePatientReminder,
  getPatientAnalytics,
  getPatientAppointments,
  getPatientDoctors,
  getPatientInsurance,
  getPatientMedicalHistory,
  getPatientOverview,
  getPatientPrescriptions,
  getPatientReports,
  getPatientReminders,
  getPatientVaccinations,
  updatePatientAppointment,
  updatePatientEmergencyProfile,
  updatePatientInsurance,
  updatePatientMedicalHistory,
  updatePatientReminder
} from '../utils/api'

const tabs = [
  { id: 'dashboard', label: 'Dashboard' },
  { id: 'history', label: 'Medical History' },
  { id: 'prescriptions', label: 'Prescriptions' },
  { id: 'reminders', label: 'Reminders' },
  { id: 'vaccination', label: 'Vaccination' },
  { id: 'insurance', label: 'Insurance' },
  { id: 'appointments', label: 'Appointments' },
  { id: 'analytics', label: 'Health Analytics' },
  { id: 'emergency', label: 'Emergency Card' }
]

const today = new Date().toISOString().slice(0, 10)

export default function PatientView() {
  const { auth } = useAuth()
  const token = auth?.token
  const [activeTab, setActiveTab] = useState('dashboard')
  const [overview, setOverview] = useState<any>(null)
  const [historyRecords, setHistoryRecords] = useState<any[]>([])
  const [prescriptions, setPrescriptions] = useState<any[]>([])
  const [reminders, setReminders] = useState<any[]>([])
  const [vaccinations, setVaccinations] = useState<any[]>([])
  const [insuranceFiles, setInsuranceFiles] = useState<any[]>([])
  const [appointments, setAppointments] = useState<any[]>([])
  const [doctors, setDoctors] = useState<any[]>([])
  const [analytics, setAnalytics] = useState<any[]>([])
  const [reports, setReports] = useState<any[]>([])
  const [emergencyProfile, setEmergencyProfile] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')

  const [recordForm, setRecordForm] = useState({ title: '', category: '', notes: '' })
  const [reminderForm, setReminderForm] = useState({ title: '', detail: '', dueDate: today, dueTime: '09:00' })
  const [insuranceForm, setInsuranceForm] = useState({ provider: '', policyNumber: '', issuedAt: today, status: 'Pending Verification' })
  const [appointmentForm, setAppointmentForm] = useState({ doctorId: '', date: today, time: '09:00', type: 'Consultation', mode: 'In person', notes: '' })
  const [emergencyForm, setEmergencyForm] = useState({ bloodGroup: '', allergies: '', conditions: '', emergencyContact: '' })

  useEffect(() => {
    loadPatientData()
  }, [token])

  async function loadPatientData() {
    if (!token) return

    setLoading(true)
    setError('')
    try {
      const [
        overviewData,
        historyData,
        prescriptionsData,
        vaccinationsData,
        insuranceData,
        analyticsData,
        reportsData,
        remindersData,
        appointmentsData,
        doctorsData
      ] = await Promise.all([
        getPatientOverview(token),
        getPatientMedicalHistory(token),
        getPatientPrescriptions(token),
        getPatientVaccinations(token),
        getPatientInsurance(token),
        getPatientAnalytics(token),
        getPatientReports(token),
        getPatientReminders(token),
        getPatientAppointments(token),
        getPatientDoctors(token)
      ])

      setOverview(overviewData)
      setHistoryRecords(historyData || [])
      setPrescriptions(prescriptionsData || [])
      setVaccinations(vaccinationsData || [])
      setInsuranceFiles(insuranceData || [])
      setAnalytics(analyticsData || [])
      setReports(reportsData || [])
      setReminders(remindersData || [])
      setAppointments(appointmentsData || [])
      setDoctors(doctorsData || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to load patient data')
    } finally {
      setLoading(false)
    }
  }

  async function runAction(action: () => Promise<unknown>, success: string) {
    setError('')
    setMessage('')
    try {
      await action()
      await loadPatientData()
      setMessage(success)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Action failed')
    }
  }

  function syncEmergencyForm() {
    setEmergencyForm({
      bloodGroup: emergencyProfile?.bloodGroup === 'Not set' ? '' : emergencyProfile?.bloodGroup || '',
      allergies: emergencyProfile?.allergies === 'Not set' ? '' : emergencyProfile?.allergies || '',
      conditions: emergencyProfile?.conditions === 'Not set' ? '' : emergencyProfile?.conditions || '',
      emergencyContact: emergencyProfile?.emergencyContact === 'Not set' ? '' : emergencyProfile?.emergencyContact || ''
    })
  }

  async function loadEmergencyProfile() {
    const response = await fetch('http://localhost:8080/api/patient/emergency-profile', {
      headers: { Authorization: `Bearer ${token}` }
    })
    const data = await response.json()
    setEmergencyProfile(data)
    setEmergencyForm({
      bloodGroup: data.bloodGroup === 'Not set' ? '' : data.bloodGroup || '',
      allergies: data.allergies === 'Not set' ? '' : data.allergies || '',
      conditions: data.conditions === 'Not set' ? '' : data.conditions || '',
      emergencyContact: data.emergencyContact === 'Not set' ? '' : data.emergencyContact || ''
    })
  }

  useEffect(() => {
    if (activeTab === 'emergency' && token) {
      loadEmergencyProfile().catch(() => setError('Unable to load emergency profile'))
    }
  }, [activeTab, token])

  function renderSection() {
    switch (activeTab) {
      case 'history':
        return (
          <section className="space-y-6 rounded-3xl bg-white p-6 shadow-sm">
            <SectionTitle title="Medical History" subtitle="Add, update, and remove your own medical records. Doctor-uploaded lab reports remain linked below." />
            <form className="grid gap-3 md:grid-cols-3" onSubmit={(event) => {
              event.preventDefault()
              runAction(() => createPatientMedicalHistory(token, recordForm), 'Medical record added')
              setRecordForm({ title: '', category: '', notes: '' })
            }}>
              <input value={recordForm.title} onChange={(event) => setRecordForm({ ...recordForm, title: event.target.value })} placeholder="Record title" className="input" />
              <input value={recordForm.category} onChange={(event) => setRecordForm({ ...recordForm, category: event.target.value })} placeholder="Category" className="input" />
              <input value={recordForm.notes} onChange={(event) => setRecordForm({ ...recordForm, notes: event.target.value })} placeholder="Notes" className="input" />
              <button className="button md:col-span-3">Add Record</button>
            </form>
            <CrudList empty="No medical records yet. Add your first record above.">
              {historyRecords.map((record) => (
                <Card key={record.id}>
                  <p className="text-sm text-slate-500">{record.date} · {record.category}</p>
                  <h3 className="mt-2 text-lg font-semibold text-slate-900">{record.title || record.category}</h3>
                  <p className="text-slate-600">{record.notes}</p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    <button className="pill" onClick={() => runAction(() => updatePatientMedicalHistory(token, record.id, { ...record, notes: `${record.notes || ''} Updated` }), 'Medical record updated')}>Quick Update</button>
                    <button className="danger" onClick={() => runAction(() => deletePatientMedicalHistory(token, record.id), 'Medical record deleted')}>Delete</button>
                  </div>
                </Card>
              ))}
            </CrudList>
            {reports.length > 0 && (
              <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6">
                <h3 className="text-xl font-semibold text-slate-900">Doctor Uploaded Lab Reports</h3>
                <div className="mt-4 grid gap-4">
                  {reports.map((report) => (
                    <Card key={report.id}>
                      <p className="text-sm text-slate-500">{report.uploadedAt}</p>
                      <h3 className="text-lg font-semibold text-slate-900">{report.reportType}</h3>
                      <p className="text-slate-600">{report.summary}</p>
                    </Card>
                  ))}
                </div>
              </div>
            )}
          </section>
        )
      case 'prescriptions':
        return (
          <section className="space-y-6 rounded-3xl bg-white p-6 shadow-sm">
            <SectionTitle title="Prescription History" subtitle="Prescriptions are created by doctors and appear here for the patient." />
            <CrudList empty="No prescriptions yet. A doctor can add one from the doctor dashboard.">
              {prescriptions.map((prescription) => (
                <Card key={prescription.id}>
                  <p className="text-sm text-slate-500">{prescription.provider} · {prescription.date}</p>
                  <h3 className="mt-2 text-xl font-semibold text-slate-900">{prescription.name}</h3>
                  <p className="text-slate-600">{prescription.dosage} · {prescription.frequency}</p>
                  <p className="mt-2 text-sm text-slate-500">{prescription.notes}</p>
                </Card>
              ))}
            </CrudList>
          </section>
        )
      case 'reminders':
        return (
          <section className="space-y-6 rounded-3xl bg-white p-6 shadow-sm">
            <SectionTitle title="Smart Reminders" subtitle="Create reminders for medicine, appointments, vaccinations, or follow-ups." />
            <form className="grid gap-3 md:grid-cols-4" onSubmit={(event) => {
              event.preventDefault()
              runAction(() => createPatientReminder(token, reminderForm), 'Reminder added')
              setReminderForm({ title: '', detail: '', dueDate: today, dueTime: '09:00' })
            }}>
              <input value={reminderForm.title} onChange={(event) => setReminderForm({ ...reminderForm, title: event.target.value })} placeholder="Reminder title" className="input" />
              <input value={reminderForm.detail} onChange={(event) => setReminderForm({ ...reminderForm, detail: event.target.value })} placeholder="Detail" className="input" />
              <input type="date" value={reminderForm.dueDate} onChange={(event) => setReminderForm({ ...reminderForm, dueDate: event.target.value })} className="input" />
              <input type="time" value={reminderForm.dueTime} onChange={(event) => setReminderForm({ ...reminderForm, dueTime: event.target.value })} className="input" />
              <button className="button md:col-span-4">Add Reminder</button>
            </form>
            <CrudList empty="No reminders yet.">
              {reminders.map((reminder) => (
                <Card key={reminder.id}>
                  <p className="text-sm text-slate-500">{reminder.due}</p>
                  <h3 className="mt-2 text-lg font-semibold text-slate-900">{reminder.title}</h3>
                  <p className="text-slate-600">{reminder.detail}</p>
                  <div className="mt-4 flex gap-2">
                    <button className="pill" onClick={() => runAction(() => updatePatientReminder(token, reminder.id, { ...reminder, read: 'true' }), 'Reminder marked done')}>Mark Done</button>
                    <button className="danger" onClick={() => runAction(() => deletePatientReminder(token, reminder.id), 'Reminder deleted')}>Delete</button>
                  </div>
                </Card>
              ))}
            </CrudList>
          </section>
        )
      case 'vaccination':
        return (
          <section className="rounded-3xl bg-white p-6 shadow-sm">
            <SectionTitle title="Vaccination Tracker" subtitle="Vaccinations are currently read-only. They can be promoted to doctor-managed records next." />
            <CrudList empty="No vaccination records yet.">
              {vaccinations.map((item) => (
                <Card key={item.name}>
                  <p className="font-semibold text-slate-900">{item.name}</p>
                  <p className="text-slate-600">Date: {item.date}</p>
                  <p className="mt-2 text-sm text-slate-500">{item.status}</p>
                </Card>
              ))}
            </CrudList>
          </section>
        )
      case 'insurance':
        return (
          <section className="space-y-6 rounded-3xl bg-white p-6 shadow-sm">
            <SectionTitle title="Insurance Documents" subtitle="Add, update, and delete policy records linked to your patient account." />
            <form className="grid gap-3 md:grid-cols-4" onSubmit={(event) => {
              event.preventDefault()
              runAction(() => createPatientInsurance(token, insuranceForm), 'Insurance record added')
              setInsuranceForm({ provider: '', policyNumber: '', issuedAt: today, status: 'Pending Verification' })
            }}>
              <input value={insuranceForm.provider} onChange={(event) => setInsuranceForm({ ...insuranceForm, provider: event.target.value })} placeholder="Provider" className="input" />
              <input value={insuranceForm.policyNumber} onChange={(event) => setInsuranceForm({ ...insuranceForm, policyNumber: event.target.value })} placeholder="Policy number" className="input" />
              <input type="date" value={insuranceForm.issuedAt} onChange={(event) => setInsuranceForm({ ...insuranceForm, issuedAt: event.target.value })} className="input" />
              <input value={insuranceForm.status} onChange={(event) => setInsuranceForm({ ...insuranceForm, status: event.target.value })} placeholder="Status" className="input" />
              <button className="button md:col-span-4">Add Insurance</button>
            </form>
            <CrudList empty="No insurance records yet.">
              {insuranceFiles.map((file) => (
                <Card key={file.id}>
                  <h3 className="font-semibold text-slate-900">{file.provider || file.name}</h3>
                  <p className="text-slate-600">Policy: {file.policyNumber}</p>
                  <p className="text-slate-600">Issued: {file.issuedAt || file.uploaded}</p>
                  <p className="mt-2 text-sm text-slate-500">{file.status}</p>
                  <div className="mt-4 flex gap-2">
                    <button className="pill" onClick={() => runAction(() => updatePatientInsurance(token, file.id, { ...file, status: 'Verified' }), 'Insurance verified')}>Mark Verified</button>
                    <button className="danger" onClick={() => runAction(() => deletePatientInsurance(token, file.id), 'Insurance deleted')}>Delete</button>
                  </div>
                </Card>
              ))}
            </CrudList>
          </section>
        )
      case 'appointments':
        return (
          <section className="space-y-6 rounded-3xl bg-white p-6 shadow-sm">
            <SectionTitle title="Appointment Booking" subtitle="Book appointments with doctors created by admin and manage your requests." />
            <form className="grid gap-3 md:grid-cols-3" onSubmit={(event) => {
              event.preventDefault()
              runAction(() => createPatientAppointment(token, appointmentForm), 'Appointment requested')
            }}>
              <select value={appointmentForm.doctorId} onChange={(event) => setAppointmentForm({ ...appointmentForm, doctorId: event.target.value })} className="input">
                <option value="">Select doctor</option>
                {doctors.map((doctor) => (
                  <option key={doctor.id} value={doctor.id}>{doctor.name} · {doctor.specialty}</option>
                ))}
              </select>
              <input type="date" value={appointmentForm.date} onChange={(event) => setAppointmentForm({ ...appointmentForm, date: event.target.value })} className="input" />
              <input type="time" value={appointmentForm.time} onChange={(event) => setAppointmentForm({ ...appointmentForm, time: event.target.value })} className="input" />
              <input value={appointmentForm.type} onChange={(event) => setAppointmentForm({ ...appointmentForm, type: event.target.value })} placeholder="Visit type" className="input" />
              <input value={appointmentForm.mode} onChange={(event) => setAppointmentForm({ ...appointmentForm, mode: event.target.value })} placeholder="Mode" className="input" />
              <input value={appointmentForm.notes} onChange={(event) => setAppointmentForm({ ...appointmentForm, notes: event.target.value })} placeholder="Reason for visit" className="input" />
              <button className="button md:col-span-3">Request Appointment</button>
            </form>
            <CrudList empty="No appointments yet.">
              {appointments.map((appointment) => (
                <Card key={appointment.id}>
                  <p className="text-sm text-slate-500">{appointment.date} {appointment.time} · {appointment.status}</p>
                  <h3 className="mt-2 text-lg font-semibold text-slate-900">{appointment.provider}</h3>
                  <p className="text-slate-600">{appointment.type} · {appointment.mode}</p>
                  <p className="text-slate-500">{appointment.notes}</p>
                  <div className="mt-4 flex gap-2">
                    <button className="pill" onClick={() => runAction(() => updatePatientAppointment(token, appointment.id, { ...appointment, status: 'Rescheduled' }), 'Appointment updated')}>Mark Rescheduled</button>
                    <button className="danger" onClick={() => runAction(() => deletePatientAppointment(token, appointment.id), 'Appointment deleted')}>Cancel</button>
                  </div>
                </Card>
              ))}
            </CrudList>
          </section>
        )
      case 'analytics':
        return (
          <section className="space-y-6 rounded-3xl bg-white p-6 shadow-sm">
            <SectionTitle title="Health Analytics" subtitle="Live counts from your records, prescriptions, appointments, and insurance data." />
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              {analytics.map((item) => (
                <Card key={item.label}>
                  <p className="text-sm text-slate-500">{item.label}</p>
                  <p className="mt-3 text-3xl font-semibold text-slate-900">{item.value}</p>
                  <p className="mt-2 text-sm text-slate-600">Trend: {item.trend}</p>
                </Card>
              ))}
            </div>
          </section>
        )
      case 'emergency':
        return (
          <section className="space-y-6 rounded-3xl bg-white p-6 shadow-sm">
            <SectionTitle title="Emergency Health Card" subtitle="Update critical details responders and hospitals need quickly." />
            <form className="grid gap-3 md:grid-cols-2" onSubmit={(event) => {
              event.preventDefault()
              runAction(async () => {
                const data = await updatePatientEmergencyProfile(token, emergencyForm)
                setEmergencyProfile(data)
              }, 'Emergency profile updated')
            }}>
              <input value={emergencyForm.bloodGroup} onChange={(event) => setEmergencyForm({ ...emergencyForm, bloodGroup: event.target.value })} placeholder="Blood group" className="input" />
              <input value={emergencyForm.emergencyContact} onChange={(event) => setEmergencyForm({ ...emergencyForm, emergencyContact: event.target.value })} placeholder="Emergency contact" className="input" />
              <input value={emergencyForm.allergies} onChange={(event) => setEmergencyForm({ ...emergencyForm, allergies: event.target.value })} placeholder="Allergies" className="input" />
              <input value={emergencyForm.conditions} onChange={(event) => setEmergencyForm({ ...emergencyForm, conditions: event.target.value })} placeholder="Conditions" className="input" />
              <button className="button md:col-span-2">Save Emergency Card</button>
            </form>
            <div className="grid gap-4 lg:grid-cols-2">
              <Card>
                <p className="text-sm text-slate-500">Blood Group</p>
                <p className="mt-3 text-4xl font-bold text-slate-900">{emergencyProfile?.bloodGroup ?? 'Not set'}</p>
                <p className="mt-2 text-slate-600">Allergies: {emergencyProfile?.allergies ?? 'Not set'}</p>
                <p className="text-slate-600">Conditions: {emergencyProfile?.conditions ?? 'Not set'}</p>
                <p className="text-slate-600">Contact: {emergencyProfile?.emergencyContact ?? 'Not set'}</p>
              </Card>
              <Card>
                <div className="mx-auto mb-4 grid h-48 w-48 place-items-center rounded-3xl bg-slate-900 text-center text-white">
                  <span className="text-sm uppercase tracking-[0.2em]">QR CODE</span>
                </div>
                <p className="text-center text-sm text-slate-600">Emergency responder card preview.</p>
              </Card>
            </div>
          </section>
        )
      default:
        return (
          <section className="space-y-6 rounded-3xl bg-white p-6 shadow-sm">
            <div className="grid gap-6 lg:grid-cols-2">
              <Metric title="Total Records" value={overview?.totalRecords ?? 0} detail="Prescriptions, appointments, and medical records from live data." />
              <Metric title="Upcoming Appointments" value={overview?.upcomingAppointments ?? 0} detail="Doctor-linked appointment requests." />
              <Metric title="Active Medications" value={overview?.activeMedications ?? 0} detail="Doctor-issued prescriptions." />
              <Metric title="Vaccination Status" value={overview?.vaccinationStatus ?? 'Keep updated'} detail="Preventive care tracking." />
            </div>
          </section>
        )
    }
  }

  return (
    <div className="space-y-6 rounded-3xl bg-white p-6 shadow-sm">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-slate-900">Patient Dashboard</h2>
          <p className="mt-2 text-slate-600">Live records, reminders, appointments, and emergency details linked to your patient profile.</p>
        </div>
      </div>

      {error && <div className="rounded-3xl border border-rose-200 bg-rose-50 p-5 text-rose-700">{error}</div>}
      {message && <div className="rounded-3xl border border-emerald-200 bg-emerald-50 p-5 text-emerald-700">{message}</div>}
      {loading && <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5 text-slate-600">Loading patient data...</div>}

      <nav className="flex flex-wrap gap-2">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            className={`rounded-full px-4 py-2 text-sm font-medium transition ${
              activeTab === tab.id ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
            onClick={() => {
              setActiveTab(tab.id)
              setMessage('')
              if (tab.id === 'emergency') syncEmergencyForm()
            }}
          >
            {tab.label}
          </button>
        ))}
      </nav>

      {renderSection()}
    </div>
  )
}

function SectionTitle({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <div>
      <h2 className="text-2xl font-semibold text-slate-900">{title}</h2>
      <p className="mt-2 text-slate-600">{subtitle}</p>
    </div>
  )
}

function CrudList({ children, empty }: { children: ReactNode; empty: string }) {
  const list = Array.isArray(children) ? children.filter(Boolean) : children
  const isEmpty = Array.isArray(list) ? list.length === 0 : !list
  return <div className="grid gap-4 sm:grid-cols-2">{isEmpty ? <p className="rounded-3xl border border-slate-200 bg-slate-50 p-5 text-slate-600">{empty}</p> : list}</div>
}

function Card({ children }: { children: ReactNode }) {
  return <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5">{children}</div>
}

function Metric({ title, value, detail }: { title: string; value: string | number; detail: string }) {
  return (
    <Card>
      <p className="text-sm text-slate-500">{title}</p>
      <p className="mt-3 text-4xl font-bold text-slate-900">{value}</p>
      <p className="mt-2 text-slate-600">{detail}</p>
    </Card>
  )
}
