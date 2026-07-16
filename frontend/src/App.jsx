import { Routes, Route, Navigate } from 'react-router-dom'
import Navbar from './components/layout/Navbar'
import Footer from './components/layout/Footer'
import Home from './pages/Home'
import Shop from './pages/Shop'
import Cart from './pages/Cart'
import Contact from './pages/Contact'
import NoPageFound from './pages/NoPageFound'
import ScrollToTop from './components/layout/ScrollToTop.jsx'
import Account from './pages/Account'
import Login from './pages/Login'
import Register from './pages/Register'
import VerifyOtp from './pages/VerifyOtp'
import ProductDetail from './pages/ProductDetail'
import AdminDashboard from './pages/AdminDashboard.jsx'
import Orders from "./components/account/Orders";
import Addresses from './components/account/Addresses.jsx'
import ContactUs from './components/account/ContactUs.jsx'
import ProtectedRoute from "./components/route/ProtectedRoute";
import Security from "./components/account/Security.jsx"
import Payments from "./components/account/Payments.jsx"

import Statistics from "./components/admin/Statistics.jsx"
import CategoryTab from "./components/admin/CategoryTab.jsx"
import ProductsTab from "./components/admin/ProductsTab.jsx"
import UsersTab from "./components/admin/UsersTab.jsx"
import OrdersTab from "./components/admin/OrdersTab.jsx"
import ForgotPassword from './pages/ForgetPassword.jsx'
import PaymentCallback from './pages/PaymentCallback.jsx'



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

          {/* Public Authentication Routes */}
          <Route path='/login' element={<Login />} />
          <Route path='/register' element={<Register />} />
          <Route path='/verify-otp' element={<VerifyOtp />} />
          <Route path='/forgot-password' element={<ForgotPassword />} /> {/* <-- ADDED THIS */}

          {/* Protected User Account Routes */}
          <Route element={<ProtectedRoute allowedRoles={["user", "admin"]} />}>
            <Route path="/account" element={<Account />}>
              <Route index element={<Navigate to="orders" replace />} />
              <Route path="orders" element={<Orders />} />
              <Route path="addresses" element={<Addresses />} />
              <Route path="contactUs" element={<ContactUs />} />
              <Route path="payment" element={<Payments />} />
              <Route path="security" element={<Security />} />
            </Route>
            <Route path="/payment/callback" element={<PaymentCallback />} />
          </Route>

          <Route path='/products/:id' element={<ProductDetail />} />

          {/* Admin Dashboard Routes */}
          <Route element={<ProtectedRoute allowedRoles={["admin"]} />}>
            <Route path="/admin" element={<AdminDashboard />}>
            <Route index element={<Navigate to="statistics" replace />} />
              <Route path="statistics" element={<Statistics />} />
              <Route path="category" element={<CategoryTab />} />
              <Route path="products" element={<ProductsTab />} />
              <Route path="users" element={<UsersTab />} />
              <Route path="orders" element={<OrdersTab />} />
            </Route>
          </Route>

          <Route path="*" element={<NoPageFound />} />
        </Routes>
      </div>
      <Footer />
    </div>

  )
}
