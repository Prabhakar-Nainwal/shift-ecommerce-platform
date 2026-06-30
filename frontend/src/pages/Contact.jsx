import { useState } from 'react'
import { Mail, Phone, Clock, MapPin, Send, CheckCheck, ArrowRight } from 'lucide-react'

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', message: '' })
  const [sent, setSent] = useState(false)

  function handleChange(e) {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  function handleSubmit(e) {
    e.preventDefault()
    if (!form.name || !form.email || !form.message) return
    setSent(true)
  }

  return (
    <main className="bg-white text-zinc-900 min-h-screen py-16 px-4 sm:px-6 lg:px-8 transition-colors duration-300">
      <div className="max-w-6xl mx-auto">
        
        {/* Page Header */}
        <div className="border-b border-zinc-200 pb-8 mb-16 text-center md:text-left">
          <p className="text-xs font-bold tracking-[0.2em] uppercase text-red-600 mb-3
                        flex items-center justify-center md:justify-start gap-3 
                        before:hidden md:before:block before:w-6 before:h-px before:bg-red-600">
            Reach out
          </p>
          <h1 className="text-4xl sm:text-5xl font-black tracking-tight text-zinc-950 uppercase">
            Get in <span className="text-red-600">touch</span>
          </h1>
          <p className="text-sm sm:text-base text-zinc-500 mt-3 max-w-xl">
            Questions, feedback, or just a hello — we'd love to hear from you.
          </p>
        </div>

        <div className="grid md:grid-cols-12 gap-12 items-start">
          
          {/* Left Side — Contact Info */}
          <div className="md:col-span-5 space-y-8">
            <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-1">
              {[
                { icon: Mail,    label: 'Email',    value: 'hello@urbanshop.store', href: 'mailto:hello@urbanshop.store' },
                { icon: Phone,   label: 'Phone',    value: '+1 (555) 012-3456',    href: 'tel:+15550123456' },
                { icon: Clock,   label: 'Hours',    value: 'Mon–Fri, 9am–6pm EST' },
                { icon: MapPin,  label: 'Location', value: 'New Delhi, India' },
              ].map(({ icon: Icon, label, value, href }) => {
                const Wrapper = href ? 'a' : 'div'
                return (
                  <Wrapper
                    key={label}
                    href={href}
                    className="group flex items-center gap-4 p-5 rounded-xl border border-zinc-200 bg-zinc-50/50
                               transition-all duration-300 hover:border-black hover:bg-white hover:shadow-[0_8px_30px_rgba(0,0,0,0.06)]"
                  >
                    <div className="w-11 h-11 rounded-lg bg-zinc-100 border border-zinc-200 flex items-center justify-center flex-shrink-0
                                    transition-all duration-300 group-hover:bg-red-600 group-hover:border-red-600">
                      <Icon className="w-4 h-4 text-zinc-600 transition-colors duration-300 group-hover:text-white" />
                    </div>
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 mb-0.5">
                        {label}
                      </p>
                      <p className="text-sm text-zinc-800 font-medium group-hover:text-black transition-colors">
                        {value}
                      </p>
                    </div>
                  </Wrapper>
                )
              })}
            </div>

            {/* Response Promise Card */}
            <div className="p-6 rounded-xl border-l-2 border-red-600 bg-zinc-50">
              <p className="text-lg font-bold text-zinc-950 mb-2">We reply within 24 hours.</p>
              <p className="text-xs sm:text-sm text-zinc-500 leading-relaxed">
                Our team is small and dedicated. Every message gets a real, thoughtful response — never an automated template.
              </p>
            </div>
          </div>

          {/* Right Side — Interactive Form Box */}
          <div className="md:col-span-7 bg-zinc-50/50 border border-zinc-200 rounded-2xl p-6 sm:p-10
                          shadow-[0_10px_40px_rgba(0,0,0,0.03)]">
            {sent ? (
              /* Success State UI */
              <div className="text-center py-12">
                <div className="w-16 h-16 rounded-full bg-red-50 border border-red-200 flex items-center justify-center mx-auto mb-6">
                  <CheckCheck className="w-7 h-7 text-red-600" />
                </div>
                <h3 className="text-2xl font-black text-zinc-950 uppercase tracking-tight mb-2">Message Received</h3>
                <p className="text-sm text-zinc-500 mb-8">We've locked it into our inbox and will get back to you shortly.</p>
                
                <button
                  onClick={() => { setSent(false); setForm({ name: '', email: '', message: '' }) }}
                  className="group inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-red-600
                             transition-colors duration-200 hover:text-black"
                >
                  Send another message
                  <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" />
                </button>
              </div>
            ) : (
              /* Core Form Interactive UI */
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <h2 className="text-xl font-bold text-zinc-950 tracking-wide uppercase">Send a message</h2>
                  <p className="text-xs text-zinc-400 mt-1">Fields are required before submission.</p>
                </div>

                {/* Name Input Group */}
                <div className="relative group">
                  <label className="block text-[10px] font-bold uppercase tracking-widest text-zinc-500 mb-2
                                    transition-colors duration-200 group-focus-within:text-red-600">
                    Your Name
                  </label>
                  <input
                    name="name"
                    type="text"
                    required
                    value={form.name}
                    onChange={handleChange}
                    placeholder="Jane Smith"
                    className="w-full border border-zinc-200 rounded-lg px-4 py-3 text-sm
                               text-zinc-950 placeholder:text-zinc-300 bg-white
                               transition-all duration-200
                               focus:outline-none focus:border-black focus:ring-1 focus:ring-black/10
                               hover:border-zinc-400"
                  />
                </div>

                {/* Email Input Group */}
                <div className="relative group">
                  <label className="block text-[10px] font-bold uppercase tracking-widest text-zinc-400 mb-2
                                    transition-colors duration-200 group-focus-within:text-red-600">
                    Email Address
                  </label>
                  <input
                    name="email"
                    type="email"
                    required
                    value={form.email}
                    onChange={handleChange}
                    placeholder="jane@email.com"
                    className="w-full border border-zinc-200 rounded-lg px-4 py-3 text-sm
                               text-zinc-950 placeholder:text-zinc-300 bg-white
                               transition-all duration-200
                               focus:outline-none focus:border-black focus:ring-1 focus:ring-black/10
                               hover:border-zinc-400"
                  />
                </div>

                {/* Message Textarea Group */}
                <div className="relative group">
                  <label className="block text-[10px] font-bold uppercase tracking-widest text-zinc-400 mb-2
                                    transition-colors duration-200 group-focus-within:text-red-600">
                    Message
                  </label>
                  <textarea
                    name="message"
                    required
                    value={form.message}
                    onChange={handleChange}
                    rows={4}
                    placeholder="How can our shop help you?"
                    className="w-full border border-zinc-200 rounded-lg px-4 py-3 text-sm
                               text-zinc-950 placeholder:text-zinc-300 bg-white
                               transition-all duration-200
                               focus:outline-none focus:border-black focus:ring-1 focus:ring-black/10
                               hover:border-zinc-400 resize-none"
                  />
                </div>

                {/* Solid Black Button with Red Accent States */}
                <button
                  type="submit"
                  className="group w-full bg-black text-white py-3.5 rounded-lg
                             text-xs font-bold uppercase tracking-widest
                             flex items-center justify-center gap-2
                             transition-all duration-300
                             hover:bg-red-600 hover:shadow-[0_8px_25px_rgba(220,38,38,0.25)] hover:-translate-y-0.5
                             active:translate-y-0 active:shadow-none"
                >
                  Send message
                  <Send className="w-3.5 h-3.5 transition-transform duration-300
                                   group-hover:translate-x-1 group-hover:-translate-y-1" />
                </button>
              </form>
            )}
          </div>

        </div>
      </div>
    </main>
  )
}