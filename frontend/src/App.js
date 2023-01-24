import { BrowserRouter,  Route, Routes } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import Container from 'react-bootstrap/Container'
import HomeScreen from "./screens/HomeScreen.js";
import ProductScreen from "./screens/ProductScreen.js";
import CartScreen from './screens/CartScreen.js';
import SigninScreen from './screens/SigninScreen.js';
import SignupScreen from './screens/SignupScreen.js'
import ShippingAddressScreen from './screens/ShippingAddressScreen.js'
import PaymentMethodScreen from './screens/PaymentMethodScreen.js'
import PlaceOrderScreen from './screens/PlaceOrderScreen.js'
import OrderScreen from './screens/OrderScreen.js'
import OrderHistoryScreen from './screens/OrderHistoryScreen.js'
import ProfileScreen from './screens/ProfileScreen.js'
import ProtectedRoute from './components/ProtectedRoute.js'
import DashboardScreen from './screens/DashboardScreen.js'
import AdminRoute from './components/AdminRoute.js'
import SearchScreen from './screens/SearchScreen.js'
import ProductListScreen from './screens/ProductListScreen.js'
import ProductEditScreen from './screens/ProductEditScreen.js'
import Footer from './components/Footer.js'
import NavbarHomemade from './components/NavbarHomemade.js'
import OrderListScreen from './screens/OrderListScreen.js';
import UserListScreen from './screens/UserListScreen.js';
import UserEditScreen from './screens/UserEditScreen.js';
import WhatsApp from './components/WhatsApp.js';

function App() {
  
  return (
    <BrowserRouter>
      <div className='d-flex flex-column site-container'>
        <ToastContainer position="bottom-center" limit={2} />
        <NavbarHomemade />

        <main>
          <Container>
            <Routes>
              <Route path="/product/:slug" element={<ProductScreen />} />
              <Route path="/cart" element={<CartScreen />} />
              <Route path="/search" element={<SearchScreen />} />
              <Route path="/signin" element={<SigninScreen />} />
              <Route path="/signup" element={<SignupScreen />} />
              <Route path="/shipping" element={<ShippingAddressScreen />} />
              <Route path="/payment" element={<PaymentMethodScreen />} />
              <Route path="/placeorder" element={<PlaceOrderScreen />} />
              <Route path="/order/:id" element={<ProtectedRoute><OrderScreen /></ProtectedRoute>} />
              <Route path="/orderhistory" element={<ProtectedRoute><OrderHistoryScreen /></ProtectedRoute>} />
              <Route path="/profile" element={<ProtectedRoute><ProfileScreen /></ProtectedRoute>} />
              {/* Admin Routes */}
              <Route path="/admin/dashboard" element={<AdminRoute><DashboardScreen /></AdminRoute>} />
              <Route path="/admin/products" element={<AdminRoute><ProductListScreen /></AdminRoute>} />
              <Route path="/admin/orders" element={<AdminRoute><OrderListScreen /></AdminRoute>} />
              <Route path="/admin/users" element={<AdminRoute><UserListScreen /></AdminRoute>} />
              <Route path="/admin/product/:id" element={<AdminRoute><ProductEditScreen /></AdminRoute>} />
              <Route path="/admin/user/:id" element={<AdminRoute><UserEditScreen /></AdminRoute>} />
              <Route path="/" element={<HomeScreen />} />
            </Routes>
          </Container>
        </main>
        <Footer />
      </div>
    </BrowserRouter>
  );
}

export default App;
