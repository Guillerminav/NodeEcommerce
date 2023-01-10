import { BrowserRouter, Link, Route, Routes } from 'react-router-dom'
import { toast, ToastContainer } from 'react-toastify'
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
import { useContext, useEffect, useState } from 'react';
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
import axios from 'axios'
import { getError } from './utils.js'

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

  const [navOpen, setNavOpen] = useState(false)
  const [categories, setCategories] = useState([])

  useEffect(() => {
    const fetchCategories = async() => {
      try {
        const { data } = await axios.get(`/api/products/categories`)
        setCategories(data)
      } catch (err) {
        toast.error(getError(err))
      }
    }
    fetchCategories()
  }, [])
  
  return (
    <BrowserRouter>
      <div className='d-flex flex-column site-container'>
        <ToastContainer position="bottom-center" limit={1} />

        <Navbar collapseOnSelect expand="lg" bg="transparent" variant="light" className="navbar-main-container">
          <Container>
            <LinkContainer to="/">
              <Navbar.Brand><img className="logo"src={logo} alt="logo"></img></Navbar.Brand>
            </LinkContainer>
            <Navbar.Toggle aria-controls="responsive-navbar-nav" onClick={() => setNavOpen(!navOpen)}/>
            <Navbar.Collapse id="responsive-navbar-nav" className={navOpen ? 'nav-active' : ''}>
              <Nav className="me-auto">
              </Nav>
              <Nav className="nav-items-container">
                <Nav.Item className="itemnav">
                  <LinkContainer to ="/cart">
                        <Nav >
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
                        </Nav>
                  </LinkContainer>
                </Nav.Item>
                {/* <Nav.Item className="itemnav">
                  Categorías
                  {categories.map((category) => (
                  <Nav.Item key={category} className="itemnav">
                    <LinkContainer
                      to={{pathname: '/search', search: `?${category}`}}
                    >
                      <Nav.Link>{category}</Nav.Link>
                    </LinkContainer>
                  </Nav.Item>
                ))}
                </Nav.Item> */}
                <Nav.Item className="itemnav">
                  <Nav className="itemnav-container">
                    <NavDropdown className="drop-container" title="Categorias" id="basic-nav-dropdown">
                    {categories.map((category) => (
                      <LinkContainer to={{pathname: '/search', search: `?${category}`}} >
                        <NavDropdown.Item className="drop-item">{category}</NavDropdown.Item>
                      </LinkContainer>
                    ))}
                  </NavDropdown>
                  </Nav>
                </Nav.Item>
                <Nav.Item className="itemnav">
                  <Nav className="itemnav-container">
                    {userInfo ? (
                      <NavDropdown className="drop-container" title={userInfo.name} id="basic-nav-dropdown">
                        <LinkContainer to="/profile">
                              <NavDropdown.Item className="drop-item">Perfil</NavDropdown.Item>
                            </LinkContainer>
                            <LinkContainer to="/orderhistory">
                              <NavDropdown.Item className="drop-item">Mis pedidos</NavDropdown.Item>
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
                </Nav.Item>
              </Nav>
            </Navbar.Collapse>
          </Container>
        </Navbar>

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
