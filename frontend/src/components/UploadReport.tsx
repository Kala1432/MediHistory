export default function UploadReport() {
  return (
    <section className="rounded-3xl bg-white p-6 shadow-sm">
      <div className="mb-6">
        <h2 className="text-2xl font-semibold text-slate-900">Upload Medical Report</h2>
        <p className="mt-2 text-slate-600">Add prescriptions, lab reports, vaccination records, and insurance documents securely.</p>
      </div>

      <form className="space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block">
            <span className="text-sm font-medium text-slate-700">Report Type</span>
            <select className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-800 outline-none focus:border-slate-400">
              <option>Prescription</option>
              <option>Lab Report</option>
              <option>Vaccination</option>
              <option>Insurance</option>
            </select>
          </label>

          <label className="block">
            <span className="text-sm font-medium text-slate-700">Upload File</span>
            <input type="file" className="mt-2 w-full text-slate-700" />
          </label>
        </div>

        <label className="block">
          <span className="text-sm font-medium text-slate-700">Notes</span>
          <textarea className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-800 outline-none focus:border-slate-400" rows={4} placeholder="Enter details about the report..."></textarea>
        </label>

        <button className="rounded-2xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-700">
          Upload Securely
        </button>
      </form>
    </section>
  )
}
