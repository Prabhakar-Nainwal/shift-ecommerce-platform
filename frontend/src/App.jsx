import { Routes, Route, Navigate} from 'react-router-dom'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Home from './pages/Home'
import Shop from './pages/Shop'
import Cart from './pages/Cart'
import Contact from './pages/Contact'
import NoPageFound from './pages/NoPageFound'
import ScrollToTop from './components/ScrollToTop'
import Account from './pages/Account'
import Login from './pages/Login'
import ProductDetail from './pages/ProductDetail'
import AdminDashboard from './pages/AdminDashboard.jsx'
import Profile from "./components/account/Profile";
import Orders from "./components/account/Orders";
import Addresses from './components/account/Addresses.jsx'
import ContactUs from './components/account/ContactUs.jsx'

export default function App() {
  return (

    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex-1">
        <ScrollToTop />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/contact" element={<Contact />} />

          <Route path="/account" element={<Account />}>
            <Route index element={<Navigate to="profile" replace />} />
            <Route path="profile" element={<Profile />} />
            <Route path="orders" element={<Orders />} />
            <Route path="addresses" element={<Addresses />} />
            <Route path="contactUs" element={<ContactUs />} />

          </Route>
          
      
          <Route path='/login' element={<Login />} />
          <Route path='/products/:id' element={<ProductDetail />} />
          <Route path='/admin' element={<AdminDashboard />} />

          <Route path="*" element={<NoPageFound />} />
        </Routes>
      </div>
      <Footer />
    </div>

  )
}
