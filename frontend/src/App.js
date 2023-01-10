import { BrowserRouter, Link, Route, Routes } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import Container from 'react-bootstrap/Container'
import {LinkContainer} from 'react-router-bootstrap'
import HomeScreen from "./screens/HomeScreen.js";
import ProductScreen from "./screens/ProductScreen.js";
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import logo from './assets/logo_vigan.svg'
import Badge from 'react-bootstrap/Badge'
import { Store } from './Store.js';
import { useContext } from 'react';
import CartScreen from './screens/CartScreen.js';
import SigninScreen from './screens/SigninScreen.js';
import SignupScreen from './screens/SignupScreen.js'
import NavDropdown from 'react-bootstrap/NavDropdown'
import ShippingAddressScreen from './screens/ShippingAddressScreen.js'
import PaymentMethodScreen from './screens/PaymentMethodScreen.js'
import PlaceOrderScreen from './screens/PlaceOrderScreen.js'
import OrderScreen from './screens/OrderScreen.js'
import OrderHistoryScreen from './screens/OrderHistoryScreen.js'
import ProfileScreen from './screens/ProfileScreen.js'

function App() {

  const {state, dispatch: ctxDispatch} = useContext(Store)
  const {cart, userInfo} = state

  const signoutHandler = () => {
    ctxDispatch({ type: 'USER_SIGNOUT' })
    localStorage.removeItem('userInfo')
    localStorage.removeItem('shippingAddress')
    localStorage.removeItem('paymentMethod')
    window.location.href = '/signin'
  }
  
  return (
    <BrowserRouter>
      <div className='d-flex flex-column site-container'>
        <ToastContainer position="bottom-center" limit={1} />
        <header>
          <Navbar className="navbar container-fluid" expand="lg" fixed="top">
            <Container className="container-fluid">
              <LinkContainer to="/">
                <Navbar.Brand><img className="logo"src={logo} alt="logo"></img></Navbar.Brand>
              </LinkContainer>
              <Navbar.Toggle aria-controls="basic-navbar-nav" className="btn-toggle"/>
              <Navbar.Collapse id="basic-navbar-nav" className="nav-collapse container-fluid navbar-right">
                <Nav className="navbar-right">
                  <Nav.Link to="/cart" className="nav-link nav-item">
                    <span>
                        <i className="fas fa-shopping-cart"></i>
                      </span>
                      {
                        cart.cartItems.length > 0 && (
                          <Badge pill bg="danger" className="badge-pill">
                            {cart.cartItems.reduce((a, c) => a + c.quantity, 0)}
                          </Badge>
                        )
                      }
                  </Nav.Link>
                  <Nav.Link href="#home" className="categorias-nav nav-item">Categorias</Nav.Link>
                  <Nav className="nav-item">
                      {userInfo ? (
                        <NavDropdown title={userInfo.name} id="basic-nav-dropdown">
                          <LinkContainer to="/profile">
                            <NavDropdown.Item>Perfil</NavDropdown.Item>
                          </LinkContainer>
                          <LinkContainer to="/orderhistory">
                            <NavDropdown.Item>Mis pedidos</NavDropdown.Item>
                          </LinkContainer>
                          <NavDropdown.Divider />
                          <Link 
                            className="dropdown-item"
                            to="#signout"
                            onClick={signoutHandler}>
                            Cerrar sesión
                          </Link>
                        </NavDropdown>
                      ) : (
                        <Link className="nav-link" to="/signin">Ingresar</Link>
                      )}
                  </Nav>
                </Nav>
              </Navbar.Collapse>
            </Container>
          </Navbar>
        </header>
        <main>
          <Container>
            <Routes>
              <Route path="/product/:slug" element={<ProductScreen />} />
              <Route path="/cart" element={<CartScreen />} />
              <Route path="/signin" element={<SigninScreen />} />
              <Route path="/signup" element={<SignupScreen />} />
              <Route path="/shipping" element={<ShippingAddressScreen />} />
              <Route path="/payment" element={<PaymentMethodScreen />} />
              <Route path="/placeorder" element={<PlaceOrderScreen />} />
              <Route path="/order/:id" element={<OrderScreen />} />
              <Route path="/orderhistory" element={<OrderHistoryScreen />} />
              <Route path="/profile" element={<ProfileScreen />} />
              <Route path="/" element={<HomeScreen />} />
            </Routes>
          </Container>
        </main>
        <footer>
          <div className='text-center'>
            All rights reserved
          </div>
        </footer>
      </div>
    </BrowserRouter>
  );
}

export default App;
