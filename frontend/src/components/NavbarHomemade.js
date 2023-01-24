import axios from 'axios';
import React, { useContext, useEffect, useState } from 'react'
import Container from 'react-bootstrap/Container';
import Badge from 'react-bootstrap/Badge';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import Offcanvas from 'react-bootstrap/Offcanvas';
import { LinkContainer } from 'react-router-bootstrap';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import logo from '../assets/logo_vigan.svg'
import SearchBox from '../components/SearchBox.js'
import { Store } from '../Store';
import { getError } from '../utils';

const NavbarHomemade = () => {


    const {state, dispatch: ctxDispatch} = useContext(Store)
    const {cart, userInfo} = state

    const signoutHandler = () => {
        ctxDispatch({ type: 'USER_SIGNOUT' })
        localStorage.removeItem('userInfo')
        localStorage.removeItem('shippingAddress')
        localStorage.removeItem('paymentMethod')
        window.location.href = '/signin'
    }

    //const [navOpen, setNavOpen] = useState(false)
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
        <>
        {[false].map((expand) => (
            <Navbar collapseOnSelect key={expand} expand={expand} className="navbar-main-container">
            <Container fluid className="nav-container">
                <LinkContainer to="/">
                    <Navbar.Brand><img className="logo"src={logo} alt="logo"></img></Navbar.Brand>
                </LinkContainer>
                <Navbar.Toggle aria-controls={`offcanvasNavbar-expand-${expand}`} className="toggle-navbar" />
                <Navbar.Offcanvas
                id={`offcanvasNavbar-expand-${expand}`}
                aria-labelledby={`offcanvasNavbarLabel-expand-${expand}`}
                placement="end"
                className="nav-active"
                >
                <Offcanvas.Header closeButton id="offcanvas-closebtn" />
                <Offcanvas.Title id={`offcanvasNavbarLabel-expand-${expand}`}>
                    <Navbar.Brand><img className="logo"src={logo} alt="logo"></img></Navbar.Brand>
                    </Offcanvas.Title>
                <Offcanvas.Body>
                    <Nav>
                        <Nav className="nav-active">
                            <SearchBox />
                        </Nav>
                        <Nav className="nav-items-container">
                        <Nav.Item className="itemnav nav-active">
                        <LinkContainer to ="/cart">
                                <Nav className="itemcarrito">
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
                        <Nav.Item className="itemnav">
                        <Nav className="itemnav-container">
                            <NavDropdown className="drop-container" title="Categorias" id="basic-nav-dropdown">
                            {categories.map((category) => (
                            <LinkContainer key={category} className="drop-item-link" to={{pathname: '/search', search: `category=${category}`}} >
                                <NavDropdown.Item className="drop-item" key={category}>{category}</NavDropdown.Item>
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
                        {userInfo && userInfo.isAdmin && (
                                <Nav.Item className="itemnav">
                                    <Nav className="itemnav-container">
                                    <NavDropdown title="Admin" id="admin-nav-dropdown" className="drop-container">
                                    <LinkContainer to="/admin/dashboard">
                                    <NavDropdown.Item className="drop-item">Dashboard</NavDropdown.Item>
                                    </LinkContainer>
                                    <LinkContainer to="/admin/products">
                                    <NavDropdown.Item className="drop-item">Productos</NavDropdown.Item>
                                    </LinkContainer>
                                    <LinkContainer to="/admin/orders">
                                    <NavDropdown.Item className="drop-item">Pedidos</NavDropdown.Item>
                                    </LinkContainer>
                                    <LinkContainer to="/admin/users">
                                    <NavDropdown.Item className="drop-item">Clientes</NavDropdown.Item>
                                    </LinkContainer>
                                </NavDropdown>
                                </Nav>
                                </Nav.Item>
                                )}
                        </Nav>
                    </Nav> 
                    </Offcanvas.Body>
                </Navbar.Offcanvas>
            </Container>
            </Navbar>
        ))}
    </>
    )
}

export default NavbarHomemade