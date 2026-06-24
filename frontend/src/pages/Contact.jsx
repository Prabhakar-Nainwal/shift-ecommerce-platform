import { useState } from 'react'

export default function Contact() {
  const [form, setForm]   = useState({ name: '', email: '', message: '' })
  const [sent, setSent]   = useState(false)

  function handleChange(e) {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  function handleSubmit() {
    if (!form.name || !form.email || !form.message) return
    setSent(true)
  }

  return (
    <main className="max-w-6xl mx-auto px-4 py-12">
      <div className="grid md:grid-cols-2 gap-14 items-start">
        {/* Left */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-3">Get in touch</h1>
          <p className="text-gray-400 mb-8">We'd love to hear from you — questions, feedback, or just a hello.</p>

          <div className="space-y-6">
            {[
              { icon: '📧', label: 'Email', value: 'hello@lume.store' },
              { icon: '📞', label: 'Phone', value: '+1 (555) 012-3456' },
              { icon: '🕐', label: 'Hours', value: 'Mon–Fri, 9am–6pm EST' },
              { icon: '📍', label: 'Location', value: '123 Design St, New York, NY' },
            ].map(item => (
              <div key={item.label} className="flex items-start gap-4">
                <span className="text-xl mt-0.5">{item.icon}</span>
                <div>
                  <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide">{item.label}</p>
                  <p className="text-gray-700 text-sm mt-0.5">{item.value}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Form */}
        <div className="bg-white border border-gray-100 rounded-2xl p-8 shadow-sm">
          {sent ? (
            <div className="text-center py-8">
              <p className="text-4xl mb-3">✅</p>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Message sent!</h3>
              <p className="text-gray-400 text-sm">We'll get back to you within 24 hours.</p>
              <button onClick={() => { setSent(false); setForm({ name: '', email: '', message: '' }) }}
                className="mt-5 text-brand-600 text-sm hover:text-brand-700 transition-colors">
                Send another message
              </button>
            </div>
          ) : (
            <div className="space-y-5">
              <h2 className="font-semibold text-gray-900">Send a message</h2>
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">Name</label>
                <input name="name" value={form.name} onChange={handleChange}
                  placeholder="Jane Smith"
                  className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-brand-400 transition-colors" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">Email</label>
                <input name="email" type="email" value={form.email} onChange={handleChange}
                  placeholder="jane@email.com"
                  className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-brand-400 transition-colors" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">Message</label>
                <textarea name="message" value={form.message} onChange={handleChange}
                  rows={4} placeholder="How can we help you?"
                  className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-brand-400 transition-colors resize-none" />
              </div>
              <button onClick={handleSubmit}
                className="w-full bg-brand-500 hover:bg-brand-600 text-white py-3 rounded-xl font-medium transition-colors">
                Send message
              </button>
            </div>
          )}
        </div>
      </div>
    </main>
  )
}
