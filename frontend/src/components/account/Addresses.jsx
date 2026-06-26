import { useState } from 'react'
import { MapPin, Phone, Plus, Pencil, Trash2, Check, X, Star } from 'lucide-react'

const INITIAL_ADDRESSES = [
  {
    id: '1',
    fullName: 'Aryan Mehta',
    phone: '9876543210',
    addressLine1: '42, MG Road',
    addressLine2: 'Indiranagar',
    city: 'Bengaluru',
    state: 'Karnataka',
    pincode: '560038',
    country: 'India',
    isDefault: true,
  },
  {
    id: '2',
    fullName: 'Aryan Mehta',
    phone: '9876543210',
    addressLine1: 'WeWork Galaxy, 43',
    addressLine2: 'Residency Road',
    city: 'Bengaluru',
    state: 'Karnataka',
    pincode: '560025',
    country: 'India',
    isDefault: false,
  },
]

const EMPTY_FORM = {
  fullName: '', phone: '',
  addressLine1: '', addressLine2: '',
  city: '', state: '', pincode: '', country: 'India',
  isDefault: false,
}

function Field({ label, name, value, onChange, placeholder, half }) {
  return (
    <div className={half ? '' : 'col-span-2'} style={{ gridColumn: half ? 'span 1' : 'span 2' }}>
      <label className="block text-[11px] font-medium tracking-widest uppercase text-[#9A8C7E] mb-1.5">
        {label}
      </label>
      <input
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full px-3.5 py-2.5 bg-white border border-[#E2DDD8] rounded-md text-[13px]
                   text-[#1A1A1A] placeholder:text-[#C5BFB8]
                   focus:outline-none focus:border-[#1A1A1A] focus:ring-2 focus:ring-black/5
                   transition-all duration-200"
      />
    </div>
  )
}

function AddressForm({ initial, onSave, onCancel, isNew }) {
  const [form, setForm] = useState({ ...(initial || EMPTY_FORM) })

  const handle = (e) => {
    const { name, value, type, checked } = e.target
    setForm(f => ({ ...f, [name]: type === 'checkbox' ? checked : value }))
  }

  return (
    <div className="border border-[#1A1A1A]/10 rounded-xl overflow-hidden">
      <div className="flex items-center justify-between px-5 py-3.5 border-b border-[#E2DDD8] bg-white">
        <p className="text-[13px] font-medium text-[#1A1A1A]">{isNew ? 'New address' : 'Edit address'}</p>
        <button onClick={onCancel} className="p-1 rounded-md text-[#9A8C7E] hover:text-[#1A1A1A] hover:bg-[#F0ECE7] transition-all">
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="p-5 bg-[#FAFAF8]">
        <div className="grid gap-4" style={{ gridTemplateColumns: '1fr 1fr' }}>
          <Field label="Full name"      name="fullName"      value={form.fullName}      onChange={handle} placeholder="Full name"           half />
          <Field label="Phone"          name="phone"         value={form.phone}         onChange={handle} placeholder="Phone number"        half />
          <Field label="Address line 1" name="addressLine1"  value={form.addressLine1}  onChange={handle} placeholder="House no., Street" />
          <Field label="Address line 2" name="addressLine2"  value={form.addressLine2}  onChange={handle} placeholder="Area, Landmark (optional)" />
          <Field label="City"           name="city"          value={form.city}          onChange={handle} placeholder="City"                half />
          <Field label="State"          name="state"         value={form.state}         onChange={handle} placeholder="State"               half />
          <Field label="Pincode"        name="pincode"       value={form.pincode}       onChange={handle} placeholder="Pincode"             half />
          <Field label="Country"        name="country"       value={form.country}       onChange={handle} placeholder="Country"             half />
        </div>

        <label className="flex items-center gap-2.5 mt-5 cursor-pointer w-fit">
          <input
            type="checkbox"
            name="isDefault"
            checked={form.isDefault}
            onChange={handle}
            className="w-4 h-4 accent-black rounded"
          />
          <span className="text-[13px] text-[#6B6358]">Set as default address</span>
        </label>

        <div className="flex gap-3 mt-5">
          <button
            onClick={() => onSave(form)}
            className="flex items-center gap-2 px-5 py-2.5 bg-[#1A1A1A] text-[#FAFAF8] rounded-md
                       text-[12px] font-medium uppercase tracking-wider
                       hover:bg-[#2D2D2D] active:scale-[0.98] transition-all duration-200"
          >
            <Check className="w-3.5 h-3.5" /> Save address
          </button>
          <button
            onClick={onCancel}
            className="px-5 py-2.5 border border-[#E2DDD8] rounded-md text-[12px] font-medium
                       uppercase tracking-wider text-[#6B6358]
                       hover:border-[#1A1A1A] hover:text-[#1A1A1A] hover:bg-[#F0ECE7]
                       active:scale-[0.98] transition-all duration-200"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  )
}

function AddressCard({ address, onEdit, onDelete, onSetDefault }) {
  const [confirmDelete, setConfirmDelete] = useState(false)

  const fullAddress = [
    address.addressLine1, address.addressLine2,
    address.city, address.state, address.pincode, address.country
  ].filter(Boolean).join(', ')

  return (
    <div className={`group border rounded-xl p-5 bg-white transition-all duration-200
                     hover:shadow-md hover:-translate-y-0.5
                     ${address.isDefault ? 'border-[#1A1A1A]' : 'border-[#E2DDD8] hover:border-[#C5BFB8]'}`}>

      <div className="flex items-start justify-between gap-3 mb-3">
        <div>
          <p className="text-[14px] font-semibold text-[#1A1A1A]">{address.fullName}</p>
          <p className="text-[12px] text-[#9A8C7E] flex items-center gap-1 mt-0.5">
            <Phone className="w-3 h-3" /> {address.phone}
          </p>
        </div>
        {address.isDefault ? (
          <span className="flex items-center gap-1 text-[10px] font-semibold tracking-wider uppercase
                           bg-[#1A1A1A] text-[#FAFAF8] px-2.5 py-1 rounded-full shrink-0">
            <Star className="w-2.5 h-2.5 fill-current" /> Default
          </span>
        ) : (
          <button
            onClick={onSetDefault}
            className="text-[10px] font-medium uppercase tracking-wider text-[#9A8C7E]
                       border border-[#E2DDD8] px-2.5 py-1 rounded-full shrink-0
                       opacity-0 group-hover:opacity-100 transition-all duration-200
                       hover:border-[#1A1A1A] hover:text-[#1A1A1A]"
          >
            Set default
          </button>
        )}
      </div>

      <p className="text-[13px] text-[#6B6358] leading-relaxed flex items-start gap-1.5 mb-4">
        <MapPin className="w-3.5 h-3.5 text-[#C5BFB8] mt-0.5 shrink-0" />
        {fullAddress}
      </p>

      <div className="flex items-center gap-1 pt-3 border-t border-[#F0ECE7]">
        <button
          onClick={onEdit}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-[12px]
                     text-[#6B6358] hover:bg-[#F0ECE7] hover:text-[#1A1A1A] transition-all duration-200"
        >
          <Pencil className="w-3 h-3" /> Edit
        </button>

        <div className="w-px h-3 bg-[#E2DDD8] mx-1" />

        {!confirmDelete ? (
          <button
            onClick={() => setConfirmDelete(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-[12px]
                       text-[#9A8C7E] hover:bg-rose-50 hover:text-rose-600 transition-all duration-200"
          >
            <Trash2 className="w-3 h-3" /> Remove
          </button>
        ) : (
          <div className="flex items-center gap-1.5 ml-1">
            <span className="text-[12px] text-[#9A8C7E]">Remove this address?</span>
            <button onClick={onDelete} className="px-2.5 py-1 rounded-md text-[11px] font-medium bg-rose-600 text-white hover:bg-rose-700 transition-colors">
              Yes
            </button>
            <button onClick={() => setConfirmDelete(false)} className="px-2.5 py-1 rounded-md text-[11px] text-[#6B6358] hover:bg-[#F0ECE7] transition-colors">
              No
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default function Addresses() {
  const [addresses, setAddresses] = useState(INITIAL_ADDRESSES)
  const [editingId, setEditingId] = useState(null)

  const handleSave = (form) => {
    if (editingId === 'new') {
      const newAddr = { ...form, id: Date.now().toString() }
      setAddresses(prev => {
        const list = form.isDefault ? prev.map(a => ({ ...a, isDefault: false })) : prev
        return [...list, newAddr]
      })
    } else {
      setAddresses(prev => {
        const list = form.isDefault ? prev.map(a => ({ ...a, isDefault: false })) : prev
        return list.map(a => a.id === editingId ? { ...form, id: a.id } : a)
      })
    }
    setEditingId(null)
  }

  return (
    <div className="max-w-2xl">
      <div className="border-b border-[#E2DDD8] pb-5 mb-8">
        <p className="text-[11px] font-medium tracking-[0.12em] uppercase text-[#9A8C7E] mb-2
                      flex items-center gap-3 before:block before:w-6 before:h-px before:bg-[#9A8C7E]">
          Saved locations
        </p>
        <h2 className="font-serif text-[28px] leading-none text-[#1A1A1A]">Your Addresses</h2>
        <p className="text-[13px] text-[#9A8C7E] mt-1.5">{addresses.length} saved</p>
      </div>

      <div className="space-y-4">
        {addresses.map(addr =>
          editingId === addr.id ? (
            <AddressForm key={addr.id} initial={addr} onSave={handleSave} onCancel={() => setEditingId(null)} />
          ) : (
            <AddressCard
              key={addr.id}
              address={addr}
              onEdit={() => setEditingId(addr.id)}
              onDelete={() => setAddresses(prev => prev.filter(a => a.id !== addr.id))}
              onSetDefault={() => setAddresses(prev => prev.map(a => ({ ...a, isDefault: a.id === addr.id })))}
            />
          )
        )}

        {editingId === 'new' ? (
          <AddressForm isNew onSave={handleSave} onCancel={() => setEditingId(null)} />
        ) : (
          <button
            onClick={() => setEditingId('new')}
            className="w-full flex items-center justify-center gap-2
                       border-2 border-dashed border-[#E2DDD8] rounded-xl py-4
                       text-[13px] font-medium text-[#9A8C7E]
                       hover:border-[#1A1A1A] hover:text-[#1A1A1A] hover:bg-[#F5F2EE]
                       active:scale-[0.99] transition-all duration-200"
          >
            <Plus className="w-4 h-4" /> Add new address
          </button>
        )}
      </div>
    </div>
  )
}