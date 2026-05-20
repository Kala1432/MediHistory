const upcoming = [
  { when: 'May 25, 2026', with: 'Dr. Asha Mehta', type: 'Follow-up' },
  { when: 'Jun 2, 2026', with: 'Dr. Rohan Singh', type: 'Teleconsultation' }
]

export default function Appointments() {
  return (
    <section className="rounded-3xl bg-white p-6 shadow-sm">
      <div className="mb-6">
        <h2 className="text-2xl font-semibold text-slate-900">Appointment Booking</h2>
        <p className="mt-2 text-slate-600">Schedule or manage upcoming consultations with doctors and hospitals.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="rounded-3xl border border-slate-200 p-5">
          <p className="text-sm text-slate-500">Book New Appointment</p>
          <button className="mt-4 inline-flex items-center justify-center rounded-2xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white hover:bg-slate-700">
            Schedule Visit
          </button>
        </div>

        <div className="rounded-3xl border border-slate-200 p-5">
          <p className="text-sm text-slate-500">Upcoming Appointments</p>
          <div className="mt-4 space-y-3">
            {upcoming.map((item) => (
              <div key={item.when} className="rounded-3xl bg-slate-50 p-4">
                <p className="text-sm font-semibold text-slate-900">{item.when}</p>
                <p className="text-sm text-slate-600">{item.with}</p>
                <p className="mt-1 text-xs uppercase tracking-wide text-slate-500">{item.type}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
