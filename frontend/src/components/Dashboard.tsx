const metrics = [
  { label: 'Total Records', value: '124' },
  { label: 'Upcoming Appointments', value: '3' },
  { label: 'Medications Active', value: '5' },
  { label: 'Vaccination Status', value: 'Up to date' }
]

const healthTrends = [
  { title: 'BMI', value: '22.7', status: 'Healthy' },
  { title: 'Blood Pressure', value: '118/78', status: 'Normal' },
  { title: 'Glucose', value: '98 mg/dL', status: 'Controlled' }
]

export default function Dashboard() {
  return (
    <section className="space-y-6 rounded-3xl bg-white p-6 shadow-sm">
      <div>
        <h2 className="text-2xl font-semibold text-slate-900">Patient Dashboard</h2>
        <p className="mt-2 text-slate-600">Track your medical history, prescriptions, appointments, and health insights in one place.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {metrics.map((metric) => (
          <div key={metric.label} className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
            <p className="text-sm font-medium text-slate-500">{metric.label}</p>
            <p className="mt-3 text-3xl font-semibold text-slate-900">{metric.value}</p>
          </div>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {healthTrends.map((item) => (
          <article key={item.title} className="rounded-3xl border border-slate-200 p-5">
            <p className="text-sm text-slate-500">{item.title}</p>
            <p className="mt-3 text-2xl font-semibold text-slate-900">{item.value}</p>
            <p className="mt-2 text-sm text-emerald-600">{item.status}</p>
          </article>
        ))}
      </div>
    </section>
  )
}
