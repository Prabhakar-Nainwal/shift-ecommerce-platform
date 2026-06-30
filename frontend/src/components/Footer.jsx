import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-[#FAFAF9] text-[#1A1A1A]">

      {/* Main content */}
      <div className="max-w-7xl mx-auto px-6 py-16 grid grid-cols-2 md:grid-cols-6 gap-x-8 gap-y-12">
        {/* Brand */}
        <div className="col-span-2 md:col-span-2 pr-4">

          <div className='font-sans text-sm font-black uppercase tracking-[0.2em] transition-all duration-300'>
            <span className="text-black">SH</span>
            <span className="text-red-600">IFT</span>
          </div>


          <p className="mt-4 text-sm leading-relaxed text-black/50 max-w-[26ch]">
            Curated everyday objects, thoughtfully designed for modern living.
          </p>

          <div className="flex gap-4 mt-6">
            {[
              { label: 'Instagram', d: 'M12 2c2.7 0 3 .01 4.1.06 1.1.05 1.84.22 2.5.47.67.26 1.24.6 1.8 1.17.56.56.9 1.13 1.16 1.8.25.66.42 1.4.47 2.5.05 1.1.06 1.4.06 4.1s-.01 3-.06 4.1c-.05 1.1-.22 1.84-.47 2.5a4.97 4.97 0 0 1-1.17 1.8 4.97 4.97 0 0 1-1.8 1.16c-.66.25-1.4.42-2.5.47-1.1.05-1.4.06-4.1.06s-3-.01-4.1-.06c-1.1-.05-1.84-.22-2.5-.47a4.97 4.97 0 0 1-1.8-1.17 4.97 4.97 0 0 1-1.16-1.8c-.25-.66-.42-1.4-.47-2.5C2.01 15 2 14.7 2 12s.01-3 .06-4.1c.05-1.1.22-1.84.47-2.5.26-.67.6-1.24 1.17-1.8A4.97 4.97 0 0 1 5.5 2.44c.66-.25 1.4-.42 2.5-.47C8.9 2.01 9.3 2 12 2zm0 1.8c-2.66 0-2.97.01-4.02.06-.97.04-1.5.2-1.85.34-.46.18-.8.39-1.15.74-.35.35-.56.69-.74 1.15-.14.35-.3.88-.34 1.85C3.85 9.03 3.84 9.34 3.84 12c0 2.66.01 2.97.06 4.02.04.97.2 1.5.34 1.85.18.46.39.8.74 1.15.35.35.69.56 1.15.74.35.14.88.3 1.85.34 1.05.05 1.36.06 4.02.06s2.97-.01 4.02-.06c.97-.04 1.5-.2 1.85-.34.46-.18.8-.39 1.15-.74.35-.35.56-.69.74-1.15.14-.35.3-.88.34-1.85.05-1.05.06-1.36.06-4.02s-.01-2.97-.06-4.02c-.04-.97-.2-1.5-.34-1.85a3.1 3.1 0 0 0-.74-1.15 3.1 3.1 0 0 0-1.15-.74c-.35-.14-.88-.3-1.85-.34C14.97 3.85 14.66 3.84 12 3.84zm0 3.06a5.1 5.1 0 1 1 0 10.2 5.1 5.1 0 0 1 0-10.2zm0 1.8a3.3 3.3 0 1 0 0 6.6 3.3 3.3 0 0 0 0-6.6zm5.3-1.99a1.19 1.19 0 1 1 0 2.38 1.19 1.19 0 0 1 0-2.38z' },
              { label: 'X', d: 'M3 3l7.6 9.6L3.4 21H6l5.9-6.6L16.4 21H21l-7.9-10 7.1-8h-2.6l-5.4 6-4.7-6H3z' },
              { label: 'Facebook', d: 'M13.5 21v-7.6h2.6l.4-3h-3v-1.9c0-.9.25-1.5 1.55-1.5h1.65V4.3C16.4 4.2 15.4 4 14.3 4c-2.4 0-4 1.45-4 4.1v2.3H7.7v3h2.6V21h3.2z' },
            ].map((icon) => (
              <a
                key={icon.label}
                href="#"
                aria-label={icon.label}
                className="text-black/40 hover:text-[#C8102E] transition-colors"
              >
                <svg viewBox="0 0 24 24" className="w-[18px] h-[18px] fill-current">
                  <path d={icon.d} />
                </svg>
              </a>
            ))}
          </div>
        </div>

        {/* Shop */}
        <div className="col-span-1">
          <h3 className="text-xs font-semibold uppercase tracking-[0.12em] text-black/40 mb-4">
            Shop
          </h3>
          <ul className="space-y-3 text-sm">
            <li><Link to="/" className="text-black/70 hover:text-[#C8102E] transition-colors">Home</Link></li>
            <li><Link to="/shop" className="text-black/70 hover:text-[#C8102E] transition-colors">All Products</Link></li>
            <li><Link to="/new" className="text-black/70 hover:text-[#C8102E] transition-colors">New Arrivals</Link></li>
            <li><Link to="/cart" className="text-black/70 hover:text-[#C8102E] transition-colors">Cart</Link></li>
          </ul>
        </div>

        {/* Help */}
        <div className="col-span-1">
          <h3 className="text-xs font-semibold uppercase tracking-[0.12em] text-black/40 mb-4">
            Help
          </h3>
          <ul className="space-y-3 text-sm">
            <li><Link to="/contact" className="text-black/70 hover:text-[#C8102E] transition-colors">Contact Us</Link></li>
            <li><Link to="/shipping" className="text-black/70 hover:text-[#C8102E] transition-colors">Shipping</Link></li>
            <li><Link to="/returns" className="text-black/70 hover:text-[#C8102E] transition-colors">Returns</Link></li>
            <li><Link to="/faq" className="text-black/70 hover:text-[#C8102E] transition-colors">FAQ</Link></li>
          </ul>
        </div>

        {/* Company */}
        <div className="col-span-1">
          <h3 className="text-xs font-semibold uppercase tracking-[0.12em] text-black/40 mb-4">
            Company
          </h3>
          <ul className="space-y-3 text-sm">
            <li><Link to="/about" className="text-black/70 hover:text-[#C8102E] transition-colors">About</Link></li>
            <li><Link to="/journal" className="text-black/70 hover:text-[#C8102E] transition-colors">Journal</Link></li>
            <li><Link to="/careers" className="text-black/70 hover:text-[#C8102E] transition-colors">Careers</Link></li>
          </ul>
        </div>

        {/* Contact */}
        <div className="col-span-2 md:col-span-1">
          <h3 className="text-xs font-semibold uppercase tracking-[0.12em] text-black/40 mb-4">
            Contact
          </h3>
          <ul className="space-y-3 text-sm">
            <li>
              <a href="mailto:hello@SHIFT.store" className="text-black/70 hover:text-[#C8102E] transition-colors">
                hello@SHIFT.store
              </a>
            </li>
            <li>
              <a href="tel:+15550123456" className="text-black/70 hover:text-[#C8102E] transition-colors">
                +1 (555) 012-3456
              </a>
            </li>
            <li className="text-black/40">Mon–Fri, 9am–6pm</li>
          </ul>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-black/10">
        <div className="max-w-7xl mx-auto px-6 py-6 flex flex-col-reverse md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-black/40">
            © {new Date().getFullYear()} SHIFT. All rights reserved.
          </p>

          <div className="flex gap-6 text-xs text-black/40">
            <Link to="/privacy" className="hover:text-[#C8102E] transition-colors">Privacy Policy</Link>
            <Link to="/terms" className="hover:text-[#C8102E] transition-colors">Terms of Service</Link>
          </div>

          <div className="flex gap-3 text-[11px] tracking-wide text-black/30 font-medium">
            <span>VISA</span>
            <span>MASTERCARD</span>
            <span>AMEX</span>
            <span>PAYPAL</span>
          </div>
        </div>
      </div>
    </footer>
  );
}