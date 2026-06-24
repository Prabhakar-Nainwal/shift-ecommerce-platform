import { useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { useCart } from '../context/CartContext'

export default function Navbar() {
  const { count } = useCart()
  const [open, setOpen] = useState(false)

  const links = [
    { to: '/',        label: 'Home'    },
    { to: '/shop',    label: 'Shop'    },
    { to: '/contact', label: 'Contact' },
  ]

  const navClass = ({ isActive }) =>
    `text-sm font-medium transition-colors ${isActive ? 'text-brand-600' : 'text-gray-600 hover:text-gray-900'}`

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-100 shadow-sm">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="text-xl font-bold tracking-tight text-gray-900">
          Lumé
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-8">
          {links.map(l => <NavLink key={l.to} to={l.to} className={navClass} end={l.to === '/'}>{l.label}</NavLink>)}
        </nav>

        {/* Cart + mobile toggle */}
        <div className="flex items-center gap-4">
          <Link to="/cart" className="relative p-2 text-gray-600 hover:text-gray-900 transition-colors">
            <CartIcon />
            {count > 0 && (
              <span className="absolute -top-0.5 -right-0.5 bg-brand-500 text-white text-xs w-4 h-4 rounded-full flex items-center justify-center font-medium">
                {count}
              </span>
            )}
          </Link>
          <button className="md:hidden p-2 text-gray-600" onClick={() => setOpen(!open)}>
            {open ? <CloseIcon /> : <MenuIcon />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden border-t border-gray-100 bg-white px-4 py-3 flex flex-col gap-3">
          {links.map(l => (
            <NavLink key={l.to} to={l.to} className={navClass} end={l.to === '/'} onClick={() => setOpen(false)}>
              {l.label}
            </NavLink>
          ))}
        </div>
      )}
    </header>
  )
}

const CartIcon  = () => <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
const MenuIcon  = () => <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
const CloseIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
