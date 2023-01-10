import React, { useContext } from 'react'
import Col from 'react-bootstrap/esm/Col'
import Row from 'react-bootstrap/esm/Row'
import { Helmet } from 'react-helmet-async'
import { Link, useNavigate } from 'react-router-dom'
import MessageBox from '../components/MessageBox'
import { Store } from '../Store'
import ListGroup from 'react-bootstrap/ListGroup'
import Button from 'react-bootstrap/esm/Button'
import Card from 'react-bootstrap/Card'
import axios from 'axios'

const CartScreen = () => {

    const navigate = useNavigate()

    const { state, dispatch: ctxDispatch } = useContext(Store)
    const {
        cart: { cartItems },
    } = state

    const updateCartHandler = async(item, quantity) => {
        const { data } = await axios.get(`/api/products/${item._id}`)
        if (data.countInStock < quantity) {
            window.alert('Producto fuera de stock')
            return
        }
        ctxDispatch({
            type: 'CART_ADD_ITEM',
            payload: {...item, quantity}
        })
    }

    const removeItemHandler = item => {
        ctxDispatch({type: 'CART_REMOVE_ITEM', payload: item})
    }

    const checkoutHandler = () => {
        navigate('/signin?redirect=/shipping')
    }

    return (
        <div>
            <Helmet>
                <title>Carrito</title>
            </Helmet>
            <h1>Carrito</h1>
            <Row>
                <Col md={8}>
                    {
                        cartItems.length === 0 ? (
                            <MessageBox>
                                El carrito esta vacío. <Link to="/">Ir a comprar</Link>
                            </MessageBox>
                        ) :
                        (
                            <ListGroup className="container-item-container">
                                {cartItems.map((item) => (
                                    <ListGroup.Item key={item._id}>
                                        <Row className="item-container">
                                            <Col md={5} className="col-item">
                                                <img src={item.image} alt={item.name} className="img-fluid rounded img-thumbnail"></img>
                                                <Link className="text-cart-product" to={`/product/${item.slug}`}>{item.name}</Link>
                                            </Col>
                                            <Col md={1} className="col-item">
                                                <Button variant="light"
                                                onClick={() => updateCartHandler(item, item.quantity - 1)}
                                                disabled={item.quantity === 1}>
                                                    <i className="fas fa-minus-circle"></i>
                                                </Button>
                                                <span>{item.quantity}</span>
                                                <Button variant="light"
                                                onClick={() => updateCartHandler(item, item.quantity + 1)}
                                                disabled={item.quantity === item.countInStock}>
                                                    <i className="fas fa-plus-circle"></i>
                                                </Button>
                                            </Col>
                                            <Col md={1} className="col-item  ">${item.price}</Col>
                                            <Col md={1} className="col-item  ">
                                                <Button 
                                                onClick={() => removeItemHandler(item)}
                                                variant="light">
                                                    <i className="fas fa-trash"></i>
                                                </Button>
                                            </Col>
                                        </Row>
                                    </ListGroup.Item>
                                ))}
                            </ListGroup>
                        )
                    }
                </Col >
                    <Col md={4} >
                        <Card className="container-item-container">
                            <Card.Body>
                                <ListGroup variant="flush">
                                    <ListGroup.Item>
                                        <h3>
                                            Subtotal ({cartItems.reduce((a, c) => a + c.quantity, 0)}{' '}items)
                                            : $ {cartItems.reduce((a, c) => a + c.price * c.quantity, 0)}
                                        </h3>
                                    </ListGroup.Item>
                                    <ListGroup.Item>
                                        <div className="d-grid">
                                            <Button
                                            onClick={checkoutHandler}
                                            type="button" className="btn-submit" disabled={cartItems.length === 0}>Continuar</Button>
                                        </div>
                                    </ListGroup.Item>
                                </ListGroup>
                            </Card.Body>
                        </Card>
                    </Col>
            </Row>
        </div>
    )
}

export default CartScreen