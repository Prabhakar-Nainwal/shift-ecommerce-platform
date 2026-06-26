export default function Profile() {
  return (
    <div className="min-h-screen bg-slate-100 py-10 px-4">
      <div className="max-w-md mx-auto bg-white rounded-2xl shadow-sm border border-slate-200 p-8">

        {/* Avatar + intro */}
        <div className="flex items-center gap-4 mb-7">
          <div className="w-14 h-14 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-semibold text-lg flex-shrink-0">
            JD
          </div>
          <div>
            <p className="font-semibold text-slate-800 text-base">John Doe</p>
            <p className="text-sm text-slate-400">Edit your profile below</p>
          </div>
        </div>

        <form className="space-y-4">

          {[
            { label: 'Full name',     type: 'text',     placeholder: 'John Doe' },
            { label: 'Email',         type: 'email',    placeholder: 'john@gmail.com' },
            { label: 'Phone number',  type: 'text',     placeholder: '+91 9876543210' },
          ].map(({ label, type, placeholder }) => (
            <div key={label}>
              <label className="block text-xs font-medium text-slate-500 mb-1.5">{label}</label>
              <input
                type={type}
                placeholder={placeholder}
                className="w-full border border-slate-200 hover:border-slate-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 rounded-lg px-3.5 py-2.5 text-sm outline-none transition"
              />
            </div>
          ))}

          <hr className="border-slate-100 my-2" />

          <p className="text-[11px] font-semibold text-slate-400 tracking-widest uppercase">
            Security verification
          </p>

          <div>
            <label className="block text-xs font-medium text-slate-500 mb-1.5">Current password</label>
            <input
              type="password"
              placeholder="Enter your password to save"
              className="w-full border border-slate-200 hover:border-slate-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 rounded-lg px-3.5 py-2.5 text-sm outline-none transition"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-indigo-600 hover:bg-indigo-700 active:scale-[0.98] text-white py-2.5 rounded-lg text-sm font-medium transition"
          >
            Save changes
          </button>

        </form>
      </div>
    </div>
  );
}