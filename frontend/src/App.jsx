import { Routes, Route } from 'react-router-dom'
import Navbar  from './components/Navbar'
import Footer  from './components/Footer'
import Home    from './pages/Home'
import Shop    from './pages/Shop'
import Cart    from './pages/Cart'
import Contact from './pages/Contact'
import NoPageFound from './pages/NoPageFound'
import ScrollToTop from './components/ScrollToTop'

export default function App() {
  return (

      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-1">
          <ScrollToTop/>
          <Routes>
            <Route path="/"        element={<Home />}    />
            <Route path="/shop"    element={<Shop />}    />
            <Route path="/cart"    element={<Cart />}    />
            <Route path="/contact" element={<Contact />} />
            <Route path="*" element={<NoPageFound/>} />
          </Routes>
        </div>
        <Footer />
      </div>
   
  )
}
