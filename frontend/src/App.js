import { BrowserRouter, Link, Route, Routes } from 'react-router-dom'
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

function App() {

  const {state} = useContext(Store)
  const {cart} = state
  
  return (
    <BrowserRouter>
      <div className='d-flex flex-column site-container'>
        <header>
          <Navbar className="navbar container-fluid" expand="lg" fixed="top">
            <Container className="container-fluid">
              <LinkContainer to="/">
                <Navbar.Brand><img className="logo"src={logo} alt="logo"></img></Navbar.Brand>
              </LinkContainer>
              <Navbar.Toggle aria-controls="basic-navbar-nav" className="btn-toggle"/>
              <Navbar.Collapse id="basic-navbar-nav" className="nav-collapse container-fluid navbar-right">
                <Nav className="navbar-right">
                  <Nav.Link href="#home" className="categorias-nav">Categorias</Nav.Link>
                  <Nav.Link href="#home" className="categorias-nav">Mi cuenta</Nav.Link>
                  <Nav>
                    <Link to="/cart" className="nav-link">
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
                      </Link>
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

