export default function EmergencyCard() {
  return (
    <section className="rounded-3xl bg-white p-6 shadow-sm">
      <div className="mb-6">
        <h2 className="text-2xl font-semibold text-slate-900">Emergency Health Card</h2>
        <p className="mt-2 text-slate-600">Share critical medical details quickly with emergency responders.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="rounded-3xl border border-slate-200 p-6">
          <p className="text-sm text-slate-500">Blood Group</p>
          <p className="mt-3 text-4xl font-bold text-slate-900">O+</p>
          <p className="mt-2 text-slate-600">Allergies: Penicillin</p>
          <p className="mt-1 text-slate-600">Conditions: Asthma</p>
        </div>

        <div className="rounded-3xl border border-slate-200 p-6">
          <p className="text-sm text-slate-500">Emergency QR Profile</p>
          <div className="mt-4 flex items-center justify-center rounded-3xl bg-slate-900 p-8 text-white">
            <span className="text-center text-sm">QR CODE</span>
          </div>
          <p className="mt-4 text-sm text-slate-600">Use this code for instant access to your emergency profile.</p>
        </div>
      </div>
    </section>
  )
}
