const API_BASE_URL = ((import.meta as any).env?.VITE_API_BASE_URL as string) || 'http://localhost:8080'

async function request(path: string, options: RequestInit = {}) {
  const isFormData = options.body instanceof FormData
  const headers = isFormData
    ? options.headers
    : {
        'Content-Type': 'application/json',
        ...(options.headers || {})
      }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers
  })

  const data = await response.json().catch(() => null)
  if (!response.ok) {
    throw new Error(data?.message || response.statusText || 'Request failed')
  }
  return data
}

function authHeaders(token?: string): Record<string, string> {
  return token ? { Authorization: `Bearer ${token}` } : {}
}

export async function login(payload: { usernameOrEmail: string; password: string }) {
  return request('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify(payload)
  })
}

export async function register(payload: { username: string; email: string; password: string; phone?: string }) {
  return request('/api/auth/register', {
    method: 'POST',
    body: JSON.stringify(payload)
  })
}

export async function getPatientOverview(token?: string) {
  return request('/api/patient/overview', {
    method: 'GET',
    headers: authHeaders(token)
  })
}

export async function getPatientMedicalHistory(token?: string) {
  return request('/api/patient/medical-history', {
    method: 'GET',
    headers: authHeaders(token)
  })
}

export async function createPatientMedicalHistory(token: string | undefined, payload: Record<string, string>) {
  return request('/api/patient/medical-history', {
    method: 'POST',
    headers: authHeaders(token),
    body: JSON.stringify(payload)
  })
}

export async function updatePatientMedicalHistory(token: string | undefined, id: number, payload: Record<string, string>) {
  return request(`/api/patient/medical-history/${id}`, {
    method: 'PUT',
    headers: authHeaders(token),
    body: JSON.stringify(payload)
  })
}

export async function deletePatientMedicalHistory(token: string | undefined, id: number) {
  return request(`/api/patient/medical-history/${id}`, {
    method: 'DELETE',
    headers: authHeaders(token)
  })
}

export async function getPatientPrescriptions(token?: string) {
  return request('/api/patient/prescriptions', {
    method: 'GET',
    headers: authHeaders(token)
  })
}

export async function getPatientVaccinations(token?: string) {
  return request('/api/patient/vaccinations', {
    method: 'GET',
    headers: authHeaders(token)
  })
}

export async function getPatientInsurance(token?: string) {
  return request('/api/patient/insurance', {
    method: 'GET',
    headers: authHeaders(token)
  })
}

export async function createPatientInsurance(token: string | undefined, payload: Record<string, string>) {
  return request('/api/patient/insurance', {
    method: 'POST',
    headers: authHeaders(token),
    body: JSON.stringify(payload)
  })
}

export async function updatePatientInsurance(token: string | undefined, id: number, payload: Record<string, string>) {
  return request(`/api/patient/insurance/${id}`, {
    method: 'PUT',
    headers: authHeaders(token),
    body: JSON.stringify(payload)
  })
}

export async function deletePatientInsurance(token: string | undefined, id: number) {
  return request(`/api/patient/insurance/${id}`, {
    method: 'DELETE',
    headers: authHeaders(token)
  })
}

export async function getPatientAppointments(token?: string) {
  return request('/api/patient/appointments', {
    method: 'GET',
    headers: authHeaders(token)
  })
}

export async function getPatientDoctors(token?: string) {
  return request('/api/patient/doctors', {
    method: 'GET',
    headers: authHeaders(token)
  })
}

export async function createPatientAppointment(token: string | undefined, payload: Record<string, string>) {
  return request('/api/patient/appointments', {
    method: 'POST',
    headers: authHeaders(token),
    body: JSON.stringify(payload)
  })
}

export async function updatePatientAppointment(token: string | undefined, id: number, payload: Record<string, string>) {
  return request(`/api/patient/appointments/${id}`, {
    method: 'PUT',
    headers: authHeaders(token),
    body: JSON.stringify(payload)
  })
}

export async function deletePatientAppointment(token: string | undefined, id: number) {
  return request(`/api/patient/appointments/${id}`, {
    method: 'DELETE',
    headers: authHeaders(token)
  })
}

export async function getPatientAnalytics(token?: string) {
  return request('/api/patient/analytics', {
    method: 'GET',
    headers: authHeaders(token)
  })
}

export async function getPatientReminders(token?: string) {
  return request('/api/patient/reminders', {
    method: 'GET',
    headers: authHeaders(token)
  })
}

export async function createPatientReminder(token: string | undefined, payload: Record<string, string>) {
  return request('/api/patient/reminders', {
    method: 'POST',
    headers: authHeaders(token),
    body: JSON.stringify(payload)
  })
}

export async function updatePatientReminder(token: string | undefined, id: number, payload: Record<string, string>) {
  return request(`/api/patient/reminders/${id}`, {
    method: 'PUT',
    headers: authHeaders(token),
    body: JSON.stringify(payload)
  })
}

export async function deletePatientReminder(token: string | undefined, id: number) {
  return request(`/api/patient/reminders/${id}`, {
    method: 'DELETE',
    headers: authHeaders(token)
  })
}

export async function updatePatientEmergencyProfile(token: string | undefined, payload: Record<string, string>) {
  return request('/api/patient/emergency-profile', {
    method: 'PUT',
    headers: authHeaders(token),
    body: JSON.stringify(payload)
  })
}

export async function getDoctorDashboard(token?: string) {
  return request('/api/doctor/dashboard', {
    method: 'GET',
    headers: authHeaders(token)
  })
}

export async function getDoctorPatients(token?: string) {
  return request('/api/doctor/patients', {
    method: 'GET',
    headers: authHeaders(token)
  })
}

export async function getDoctorAppointments(token?: string) {
  return request('/api/doctor/appointments', {
    method: 'GET',
    headers: authHeaders(token)
  })
}

export async function uploadDoctorReport(token?: string, formData?: FormData) {
  return request('/api/doctor/report', {
    method: 'POST',
    headers: authHeaders(token),
    body: formData
  })
}

export async function createDoctorPrescription(token: string | undefined, payload: Record<string, string>) {
  return request('/api/doctor/prescriptions', {
    method: 'POST',
    headers: authHeaders(token),
    body: JSON.stringify(payload)
  })
}

export async function getPatientReports(token?: string) {
  return request('/api/patient/reports', {
    method: 'GET',
    headers: authHeaders(token)
  })
}

export async function getAdminDashboard(token?: string) {
  return request('/api/admin/dashboard', {
    method: 'GET',
    headers: authHeaders(token)
  })
}

export async function getAdminDoctors(token?: string) {
  return request('/api/admin/doctors', {
    method: 'GET',
    headers: authHeaders(token)
  })
}

export async function createAdminDoctor(
  token: string | undefined,
  payload: {
    name: string
    username: string
    email: string
    password: string
    specialty: string
    hospitalName?: string
    qualifications?: string
    phone?: string
  }
) {
  return request('/api/admin/doctors', {
    method: 'POST',
    headers: authHeaders(token),
    body: JSON.stringify(payload)
  })
}

export async function getAdminVerifications(token?: string) {
  return request('/api/admin/verify-profiles', {
    method: 'GET',
    headers: authHeaders(token)
  })
}

export async function getAdminReports(token?: string) {
  return request('/api/admin/reports', {
    method: 'GET',
    headers: authHeaders(token)
  })
}
