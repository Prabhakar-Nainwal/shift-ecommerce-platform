import { useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { CircleUserRound, Menu, X, ShoppingCart} from 'lucide-react'

export default function Navbar() {
  const { count } = useCart()
  const [open, setOpen] = useState(false)

  const links = [
    { to: '/', label: 'Home' },
    { to: '/shop', label: 'Shop' },
    { to: '/contact', label: 'Contact' },
  ]

  const navClass = ({ isActive }) =>
    `text-sm font-medium transition-colors ${isActive ? 'text-brand-600' : 'text-gray-600 hover:text-gray-900'}`

return (
  <header className="sticky top-0 z-50 bg-[#FAFAF8] border-b border-[#E2DDD8]">
    <div className="max-w-5xl mx-auto px-8 h-16 flex items-center justify-between">

      {/* Logo */}
      <Link
        to="/"
        className="font-serif text-xl text-[#1A1A1A] tracking-tight
                   transition-colors duration-200 hover:text-[#C8A97E]"
      >
        UrbanShop
      </Link>

      {/* Desktop nav */}
      <nav className="hidden md:flex items-center gap-8">
        {links.map(l => (
          <NavLink
            key={l.to}
            to={l.to}
            end={l.to === '/'}
            className={({ isActive }) =>
              `text-[13px] font-medium uppercase tracking-widest transition-colors duration-200
               relative after:absolute after:bottom-0 after:left-0 after:h-px after:bg-[#1A1A1A]
               after:transition-all after:duration-300
               ${isActive
                 ? 'text-[#1A1A1A] after:w-full'
                 : 'text-[#9A8C7E] hover:text-[#1A1A1A] after:w-0 hover:after:w-full'
               }`
            }
          >
            {l.label}
          </NavLink>
        ))}
      </nav>

      {/* Actions */}
      <div className="flex items-center gap-1">

        {/* Cart */}
        <Link
          to="/cart"
          className="group relative p-2.5 rounded-md text-[#9A8C7E]
                     transition-all duration-200
                     hover:text-[#1A1A1A] hover:bg-[#F0ECE7]
                     active:scale-95"
        >
          <ShoppingCart className="w-5 h-5 transition-transform duration-200 group-hover:scale-110" />
          {count > 0 && (
            <span className="absolute -top-0.5 -right-0.5 bg-[#1A1A1A] text-[#FAFAF8]
                             text-[10px] w-4 h-4 rounded-full flex items-center justify-center
                             font-semibold transition-transform duration-200 group-hover:scale-110">
              {count}
            </span>
          )}
        </Link>

        {/* Account */}
        <Link
          to="/account"
          className="group p-2.5 rounded-md text-[#9A8C7E]
                     transition-all duration-200
                     hover:text-[#1A1A1A] hover:bg-[#F0ECE7]
                     active:scale-95"
        >
          <CircleUserRound className="w-5 h-5 transition-transform duration-200 group-hover:scale-110" />
        </Link>

        {/* Mobile toggle */}
        <button
          onClick={() => setOpen(!open)}
          className="md:hidden p-2.5 rounded-md text-[#9A8C7E]
                     transition-all duration-200
                     hover:text-[#1A1A1A] hover:bg-[#F0ECE7]
                     active:scale-95"
        >
          {open
            ? <X className="w-5 h-5 transition-transform duration-200 rotate-0" />
            : <Menu className="w-5 h-5 transition-transform duration-200" />
          }
        </button>
      </div>
    </div>

    {/* Mobile menu */}
    <div
      className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out bg-[#FAFAF8] border-t border-[#E2DDD8]
                  ${open ? 'max-h-64 opacity-100' : 'max-h-0 opacity-0'}`}
    >
      <div className="max-w-5xl mx-auto px-8 py-4 flex flex-col gap-1">
        {links.map(l => (
          <NavLink
            key={l.to}
            to={l.to}
            end={l.to === '/'}
            onClick={() => setOpen(false)}
            className={({ isActive }) =>
              `text-[13px] font-medium uppercase tracking-widest px-3 py-2.5 rounded-md
               transition-all duration-150
               ${isActive
                 ? 'text-[#1A1A1A] bg-[#F0ECE7]'
                 : 'text-[#9A8C7E] hover:text-[#1A1A1A] hover:bg-[#F0ECE7]'
               }`
            }
          >
            {l.label}
          </NavLink>
        ))}
      </div>
    </div>
  </header>
)
}

