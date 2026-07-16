import { useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { useCart } from '../../context/CartContext'
import { CircleUserRound, Menu, X, ShoppingCart } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import Cart from '../../pages/Cart' 


export default function Navbar() {
  const { user } = useAuth()
  const { count } = useCart()
  const [open, setOpen] = useState(false)
  const [isCartOpen, setIsCartOpen] = useState(false) 

  const links = [
    { to: '/', label: 'Home' },
    { to: '/shop', label: 'Shop' },
    { to: '/contact', label: 'Contact' },
  ]

  const getNavLinkClass = ({ isActive }) =>
    `text-[12px] font-semibold uppercase tracking-[0.15em] transition-all duration-300 relative py-1
     after:absolute after:bottom-0 after:left-1/2 after:h-[1.5px] after:bg-red-600 after:transition-all after:duration-300 after:-translate-x-1/2
     ${isActive 
       ? 'text-red-600 after:w-full' 
       : 'text-gray-500 hover:text-red-600 after:w-0 hover:after:w-full'
     }`

  return (
    <>
      <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-gray-100 shadow-sm ">
        <div className="max-w-7xl mx-auto px-6 md:px-12 h-16 flex items-center justify-between">
          <Link
            to="/"
            className="font-sans text-lg font-black uppercase tracking-[0.2em] transition-all duration-300"
          >
            <span className="text-black">SH</span>
            <span className="text-red-600">IFT</span>
          </Link>

          <nav className="hidden md:flex items-center gap-10">
            {links.map(l => (
              <NavLink
                key={l.to}
                to={l.to}
                end={l.to === '/'}
                className={getNavLinkClass}
              >
                {l.label}
              </NavLink>
            ))}
            {user?.role === "admin" && (
              <NavLink
                to="/admin"
                className={getNavLinkClass}
              >
                Manage
              </NavLink>
            )}
          </nav>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsCartOpen(true)}
              className="group relative p-2.5 rounded-full text-gray-500
                         transition-all duration-300 hover:text-red-600 hover:bg-red-50/50
                         active:scale-95"
              aria-label="Open Cart"
            >
              <ShoppingCart className="w-[20px] h-[20px] transition-transform duration-300 group-hover:scale-105" />
              {count > 0 && (
                <span className="absolute top-1.5 right-1.5 bg-red-600 text-white
                                 text-[12px] w-4 h-4 rounded-full flex items-center justify-center
                                 font-bold tracking-tight animate-fade-in">
                  {count}
                </span>
              )}
            </button>

            <Link
              to="/account"
              className="group p-2.5 rounded-full text-gray-500
                         transition-all duration-300 hover:text-red-600 hover:bg-red-50/50
                         active:scale-95"
            >
              <CircleUserRound className="w-[20px] h-[20px] transition-transform duration-300 group-hover:scale-105" />
            </Link>

            <button
              onClick={() => setOpen(!open)}
              className="md:hidden p-2.5 rounded-full text-gray-500
                         transition-all duration-300 hover:text-red-600 hover:bg-red-50/50
                         active:scale-95"
              aria-label="Toggle menu"
            >
              {open ? (
                <X className="w-[18px] h-[18px] transition-transform duration-300 rotate-90" />
              ) : (
                <Menu className="w-[18px] h-[18px] transition-transform duration-300" />
              )}
            </button>
          </div>
        </div>

        <div
          className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out bg-white/95 backdrop-blur-md
                      ${open ? 'max-h-72 border-t border-gray-100 opacity-100' : 'max-h-0 opacity-0'}`}
        >
          <div className="px-6 py-4 flex flex-col gap-1.5">
            {links.map(l => (
              <NavLink
                key={l.to}
                to={l.to}
                end={l.to === '/'}
                onClick={() => setOpen(false)}
                className={({ isActive }) =>
                  `text-[12px] font-semibold uppercase tracking-[0.15em] px-4 py-3 rounded-xl
                   transition-all duration-200
                   ${isActive
                     ? 'text-red-600 bg-red-50/60 font-bold'
                     : 'text-gray-500 hover:text-red-600 hover:bg-red-50/30'
                   }`
                }
              >
                {l.label}
              </NavLink>
            ))}
            {user?.role === "admin" && (
              <NavLink
                to="/admin"
                onClick={() => setOpen(false)}
                className={({ isActive }) =>
                  `text-[12px] font-semibold uppercase tracking-[0.15em] px-4 py-3 rounded-xl 
                   transition-all duration-200
                   ${isActive ? 'text-red-600 bg-red-50/60 font-bold' : 'text-gray-500 hover:text-red-600 hover:bg-red-50/30'}`
                }
              >
                Manage
              </NavLink>
            )}
          </div>
        </div>
      </header>
      <Cart isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </>
  )
}