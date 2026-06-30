import { useState, useEffect } from 'react'
import { MapPin, Phone, Plus, Pencil, Trash2, Check, X, Star } from 'lucide-react'
import { getAddresses, updateAddresses } from "../../services/userServices"

const EMPTY_FORM = {
  fullName: '', phone: '',
  addressLine1: '', addressLine2: '',
  city: '', state: '', pincode: '', country: 'India',
  isDefault: false,
}

const inputCls = "w-full px-3 py-2 border border-[#D5D9D9] rounded text-sm text-[#0F1111] placeholder:text-[#767676] focus:outline-none focus:border-[#007185] focus:ring-2 focus:ring-[#007185]/20 transition"

const FIELDS = [
  { label: 'Full name',        name: 'fullName',     placeholder: 'Full name',                 half: true  },
  { label: 'Phone number',     name: 'phone',        placeholder: 'Phone number',              half: true  },
  { label: 'Address line 1',   name: 'addressLine1', placeholder: 'House no., Street',         half: false },
  { label: 'Address line 2',   name: 'addressLine2', placeholder: 'Area, Landmark (optional)', half: false },
  { label: 'City',             name: 'city',         placeholder: 'City',                      half: true  },
  { label: 'State',            name: 'state',        placeholder: 'State',                     half: true  },
  { label: 'Pincode',          name: 'pincode',      placeholder: 'Pincode',                   half: true  },
  { label: 'Country',          name: 'country',      placeholder: 'Country',                   half: true  },
]

function AddressForm({ initial, onSave, onCancel, isNew }) {
  const [form, setForm] = useState({ ...(initial || EMPTY_FORM) })

  const handle = (e) => {
    const { name, value, type, checked } = e.target
    setForm(f => ({ ...f, [name]: type === 'checkbox' ? checked : value }))
  }

  return (
    <div className="border border-[#D5D9D9] rounded-lg overflow-hidden">
      <div className="flex items-center justify-between px-4 py-3 bg-[#F0F2F2] border-b border-[#D5D9D9]">
        <p className="text-sm font-semibold text-[#0F1111]">{isNew ? 'Add a new address' : 'Edit address'}</p>
        <button onClick={onCancel} className="text-[#565959] hover:text-[#0F1111] transition">
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="p-4 bg-white">
        <div className="grid grid-cols-2 gap-3">
          {FIELDS.map(({ label, name, placeholder, half }) => (
            <div key={name} className={half ? '' : 'col-span-2'}>
              <label className="block text-xs font-medium text-[#0F1111] mb-1">{label}</label>
              <input name={name} value={form[name]} onChange={handle} placeholder={placeholder} className={inputCls} />
            </div>
          ))}
        </div>

        <label className="flex items-center gap-2 mt-4 cursor-pointer w-fit">
          <input type="checkbox" name="isDefault" checked={form.isDefault} onChange={handle} className="w-4 h-4 accent-[#007185]" />
          <span className="text-sm text-[#0F1111]">Make this my default address</span>
        </label>

        <div className="flex gap-2 mt-4">
          <button
            onClick={() => onSave(form)}
            className="flex items-center gap-1.5 px-4 py-2 bg-[#FFD814] hover:bg-[#F7CA00] border border-[#FCD200] rounded text-sm font-medium text-[#0F1111] transition active:scale-[0.98]"
          >
            <Check className="w-3.5 h-3.5" /> Save address
          </button>
          <button
            onClick={onCancel}
            className="px-4 py-2 border border-[#D5D9D9] rounded text-sm text-[#0F1111] hover:bg-[#F0F2F2] transition active:scale-[0.98]"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  )
}

export default function Addresses() {
  const [addresses, setAddresses] = useState([])
  const [editingId, setEditingId] = useState(null)
  const [confirmDeleteId, setConfirmDeleteId] = useState(null)

  useEffect(() => {
    fetchAddresses();
  }, []);

  const fetchAddresses = async () => {
    try {
      const res = await getAddresses();
      setAddresses(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  const saveToBackend = async (updatedAddresses) => {
    try {
      await updateAddresses(updatedAddresses);
      await fetchAddresses();
    } catch (err) {
      console.log(err);
    }
  };

  const handleSave = async (form) => {
    let updatedList = [];
    if (editingId === 'new') {
      const newAddr = { ...form }
      const list = form.isDefault ? addresses.map(a => ({ ...a, isDefault: false })) : addresses
      updatedList = [...list, newAddr]
    } else {
      const list = form.isDefault ? addresses.map(a => ({ ...a, isDefault: false })) : addresses
      updatedList = list.map(a => a._id === editingId ? { ...form, _id: a._id } : a)
    }
    
    setEditingId(null)
    setAddresses(updatedList);
    await saveToBackend(updatedList)
  }

  const handleDelete = async (addrId) => {
    const updated = addresses.filter(a => a._id !== addrId);
    if (updated.length && !updated.some(a => a.isDefault)) {
      updated[0].isDefault = true;
    }
    setConfirmDeleteId(null)
    setAddresses(updated);
    await saveToBackend(updated)
  }

  const handleSetDefault = async (addrId) => {
    const updated = addresses.map(a => ({
      ...a,
      isDefault: a._id === addrId
    }))
    setAddresses(updated);
    await saveToBackend(updated)
  }

  return (
    <div className="max-w-2xl">
      <div className="border-b border-[#E7E7E7] pb-4 mb-6">
        <h2 className="text-2xl font-bold text-[#0F1111]">Your Addresses</h2>
        <p className="text-sm text-[#565959] mt-0.5">{addresses.length} saved</p>
      </div>

      <div className="space-y-3">
        {editingId === 'new' ? (
          <AddressForm key="new" isNew onSave={handleSave} onCancel={() => setEditingId(null)} />
        ) : (
          <button
            onClick={() => setEditingId('new')}
            className="w-full flex items-center justify-center gap-2 border-2 border-dashed border-[#D5D9D9] rounded-lg py-4 text-sm font-medium text-[#007185] hover:border-[#007185] hover:bg-[#F0F9FA] transition-all active:scale-[0.99]"
          >
            <Plus className="w-4 h-4" /> Add a new address
          </button>
        )}

        {addresses.map(addr =>
          editingId === addr._id ? (
            <AddressForm key={addr._id} initial={addr} onSave={handleSave} onCancel={() => setEditingId(null)} />
          ) : (
            <div key={addr._id} className={`border rounded-lg p-4 bg-white hover:shadow-sm transition-all ${addr.isDefault ? 'border-[#007185]' : 'border-[#D5D9D9]'}`}>

              <div className="flex items-center gap-2 mb-1">
                <p className="text-sm font-bold text-[#0F1111]">{addr.fullName}</p>
                {addr.isDefault && (
                  <span className="flex items-center gap-1 text-[10px] font-semibold bg-[#007185] text-white px-2 py-0.5 rounded-full">
                    <Star className="w-2.5 h-2.5 fill-current" /> Default
                  </span>
                )}
              </div>

              <p className="text-xs text-[#565959] flex items-center gap-1 mb-2">
                <Phone className="w-3 h-3" /> {addr.phone}
              </p>

              <p className="text-sm text-[#0F1111] leading-relaxed flex items-start gap-1.5 mb-3">
                <MapPin className="w-3.5 h-3.5 text-[#565959] mt-0.5 shrink-0" />
                {[addr.addressLine1, addr.addressLine2, addr.city, addr.state, addr.pincode, addr.country].filter(Boolean).join(', ')}
              </p>

              <div className="flex items-center gap-0.5 pt-3 border-t border-[#E7E7E7] text-xs">
                <button 
                  onClick={() => {
                    setConfirmDeleteId(null);
                    setEditingId(addr._id);
                  }} 
                  className="flex items-center gap-1 px-2.5 py-1 text-[#007185] hover:underline"
                >
                  <Pencil className="w-3 h-3" /> Edit
                </button>
                <span className="text-[#D5D9D9]">|</span>
                {confirmDeleteId === addr._id ? (
                  <div className="flex items-center gap-1.5 px-2">
                    <span className="text-[#565959]">Remove this address?</span>
                    <button
                      onClick={() => handleDelete(addr._id)}
                      className="px-2 py-0.5 rounded bg-[#CC0C39] text-white hover:bg-[#B0092F] text-[11px] font-medium transition"
                    >Yes</button>
                    <button
                      onClick={() => setConfirmDeleteId(null)}
                      className="px-2 py-0.5 rounded border border-[#D5D9D9] text-[#0F1111] hover:bg-[#F0F2F2] text-[11px] transition"
                    >No</button>
                  </div>
                ) : (
                  <button onClick={() => setConfirmDeleteId(addr._id)} className="flex items-center gap-1 px-2.5 py-1 text-[#007185] hover:underline">
                    <Trash2 className="w-3 h-3" /> Remove
                  </button>
                )}
                {!addr.isDefault && (
                  <>
                    <span className="text-[#D5D9D9]">|</span>
                    <button
                      onClick={() => handleSetDefault(addr._id)}
                      className="px-2.5 py-1 text-[#007185] hover:underline"
                    >
                      Set as default
                    </button>
                  </>
                )}
              </div>
            </div>
          )
        )}
      </div>
    </div>
  )
}