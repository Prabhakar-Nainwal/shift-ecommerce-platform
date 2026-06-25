import { useState } from 'react'
import { Mail, Phone, Clock, MapPin, Send, CheckCheck, ArrowRight } from 'lucide-react'
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
  <main className="max-w-5xl mx-auto px-8 py-14">

    {/* Page header */}
    <div className="border-b border-[#E2DDD8] pb-6 mb-12">
      <p className="text-[11px] font-medium tracking-[0.12em] uppercase text-[#9A8C7E] mb-3
                    flex items-center gap-3 before:block before:w-6 before:h-px before:bg-[#9A8C7E]">
        Reach out
      </p>
      <h1 className="font-serif text-[42px] leading-none text-[#1A1A1A]">Get in touch</h1>
      <p className="text-[15px] text-[#9A8C7E] mt-2">
        Questions, feedback, or just a hello — we'd love to hear from you.
      </p>
    </div>

    <div className="grid md:grid-cols-2 gap-14 items-start">

      {/* Left — contact info */}
      <div>
        <div className="space-y-3">
          {[
            { icon: Mail,    label: 'Email',    value: 'urbanshop@gmail.com' },
            { icon: Phone,   label: 'Phone',    value: '+1 (555) 012-3456' },
            { icon: Clock,   label: 'Hours',    value: 'Mon–Fri, 9am–6pm EST' },
            { icon: MapPin,  label: 'Location', value: 'New Delhi, India' },
          ].map(({ icon: Icon, label, value }) => (
            <div
              key={label}
              className="group flex items-start gap-4 p-4 rounded-xl border border-transparent
                         transition-all duration-200
                         hover:border-[#E2DDD8] hover:bg-white hover:shadow-[0_4px_16px_rgba(0,0,0,0.04)]"
            >
              <div className="mt-0.5 w-9 h-9 rounded-lg bg-[#F0ECE7] flex items-center justify-center flex-shrink-0
                              transition-colors duration-200 group-hover:bg-[#1A1A1A]">
                <Icon className="w-4 h-4 text-[#9A8C7E] transition-colors duration-200 group-hover:text-[#FAFAF8]" />
              </div>
              <div>
                <p className="text-[11px] font-medium uppercase tracking-widest text-[#C5BFB8] mb-0.5">
                  {label}
                </p>
                <p className="text-[14px] text-[#1A1A1A] font-medium">{value}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Divider + note */}
        <div className="mt-10 pt-8 border-t border-[#E2DDD8]">
          <p className="font-serif text-[22px] text-[#1A1A1A] mb-2">We reply within 24 hours.</p>
          <p className="text-[13px] text-[#9A8C7E] leading-relaxed">
            Our team is small and dedicated. Every message gets a real, thoughtful response — not a template.
          </p>
        </div>
      </div>

      {/* Right — form */}
      <div className="bg-white border border-[#E2DDD8] rounded-xl p-8
                      shadow-[0_4px_24px_rgba(0,0,0,0.05)]">
        {sent ? (
          /* Success state */
          <div className="text-center py-10">
            <div className="w-14 h-14 rounded-full bg-[#F0ECE7] flex items-center justify-center mx-auto mb-5">
              <CheckCheck className="w-6 h-6 text-[#1A1A1A]" />
            </div>
            <h3 className="font-serif text-[26px] text-[#1A1A1A] mb-2">Message sent.</h3>
            <p className="text-[14px] text-[#9A8C7E] mb-8">We'll get back to you within 24 hours.</p>
            <button
              onClick={() => { setSent(false); setForm({ name: '', email: '', message: '' }) }}
              className="group inline-flex items-center gap-2 text-[13px] font-medium text-[#9A8C7E]
                         transition-colors duration-200 hover:text-[#1A1A1A]"
            >
              Send another message
              <ArrowRight className="w-3.5 h-3.5 transition-transform duration-200 group-hover:translate-x-0.5" />
            </button>
          </div>
        ) : (
          /* Form */
          <div className="space-y-5">
            <div className="border-b border-[#E2DDD8] pb-4 mb-6">
              <h2 className="font-serif text-[22px] text-[#1A1A1A]">Send a message</h2>
            </div>

            {/* Name */}
            <div className="group">
              <label className="block text-[11px] font-medium uppercase tracking-widest text-[#9A8C7E] mb-2
                                transition-colors duration-200 group-focus-within:text-[#1A1A1A]">
                Name
              </label>
              <input
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Jane Smith"
                className="w-full border border-[#E2DDD8] rounded-md px-4 py-2.5 text-[13px]
                           text-[#1A1A1A] placeholder:text-[#C5BFB8] bg-[#FAFAF8]
                           transition-all duration-200
                           focus:outline-none focus:border-[#1A1A1A] focus:bg-white
                           focus:ring-2 focus:ring-[#1A1A1A]/5
                           hover:border-[#C5BFB8]"
              />
            </div>

            {/* Email */}
            <div className="group">
              <label className="block text-[11px] font-medium uppercase tracking-widest text-[#9A8C7E] mb-2
                                transition-colors duration-200 group-focus-within:text-[#1A1A1A]">
                Email
              </label>
              <input
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                placeholder="jane@email.com"
                className="w-full border border-[#E2DDD8] rounded-md px-4 py-2.5 text-[13px]
                           text-[#1A1A1A] placeholder:text-[#C5BFB8] bg-[#FAFAF8]
                           transition-all duration-200
                           focus:outline-none focus:border-[#1A1A1A] focus:bg-white
                           focus:ring-2 focus:ring-[#1A1A1A]/5
                           hover:border-[#C5BFB8]"
              />
            </div>

            {/* Message */}
            <div className="group">
              <label className="block text-[11px] font-medium uppercase tracking-widest text-[#9A8C7E] mb-2
                                transition-colors duration-200 group-focus-within:text-[#1A1A1A]">
                Message
              </label>
              <textarea
                name="message"
                value={form.message}
                onChange={handleChange}
                rows={4}
                placeholder="How can we help you?"
                className="w-full border border-[#E2DDD8] rounded-md px-4 py-2.5 text-[13px]
                           text-[#1A1A1A] placeholder:text-[#C5BFB8] bg-[#FAFAF8]
                           transition-all duration-200
                           focus:outline-none focus:border-[#1A1A1A] focus:bg-white
                           focus:ring-2 focus:ring-[#1A1A1A]/5
                           hover:border-[#C5BFB8] resize-none"
              />
            </div>

            {/* Submit */}
            <button
              onClick={handleSubmit}
              className="group w-full bg-[#1A1A1A] text-[#FAFAF8] py-3 rounded-md
                         text-[12px] font-semibold uppercase tracking-widest
                         flex items-center justify-center gap-2
                         transition-all duration-200
                         hover:bg-[#333] hover:-translate-y-0.5 hover:shadow-md
                         active:translate-y-0 active:shadow-none"
            >
              Send message
              <Send className="w-3.5 h-3.5 transition-transform duration-200
                               group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </button>
          </div>
        )}
      </div>
    </div>
  </main>
)
}
