import React, { useContext, useEffect, useReducer } from 'react'
import CheckoutSteps from '../components/CheckoutSteps.js'
import { Helmet } from 'react-helmet-async'
import Row from 'react-bootstrap/esm/Row.js'
import Col from 'react-bootstrap/esm/Col.js'
import Card from 'react-bootstrap/Card'
import {Store} from '../Store.js'
import Button from 'react-bootstrap/Button'
import ListGroup from 'react-bootstrap/ListGroup'
import {Link, useNavigate} from 'react-router-dom'
import { toast } from 'react-toastify'
import { getError } from '../utils.js'
import axios from 'axios'
import LoadingBox from '../components/LoadingBox.js'

const reducer = (state, action) => {
    switch (action.type) {
        case 'CREATE_REQUEST':
            return {...state, laoding: true}
        case 'CREATE_SUCCESS':
            return {...state, loading: false}
        case 'CREATE_FAIL':
            return {...state, loading: false}
        default:
            return state
    }
}


const PlaceOrderScreen = () => {

    const navigate = useNavigate()

    const [{ loading }, dispatch] = useReducer(reducer, {
        loading: false
    })

    const { state, dispatch: ctxDispatch } = useContext(Store)
    const { cart, userInfo } = state

    const round2 = (num) => Math.round(num * 100 + Number.EPSILON) / 100 

    cart.itemsPrice = round2(
        cart.cartItems.reduce((a, c) => a + c.quantity * c.price, 0)
    )
    cart.shippingPrice = cart.itemsPrice > 5000 ? round2(0) : round2(300)
    cart.platformTax = round2(0.01 * cart.itemsPrice)
    cart.totalPrice = cart.itemsPrice + cart.shippingPrice + cart.platformTax

    const placeOrderHandler = async() => {
        try {
            dispatch({ type: 'CREATE_REQUEST' })
            const { data } = await axios.post(
                '/api/orders',
                {
                    orderItems: cart.cartItems,
                    shippingAddress: cart.shippingAddress,
                    paymentMethod: cart.paymentMethod,
                    itemsPrice: cart.itemsPrice,
                    shippingPrice: cart.shippingPrice,
                    platformTax: cart.platformTax,
                    totalPrice: cart.totalPrice
                },
                {
                    headers: {
                        authorization: `Titular ${userInfo.token}`
                    }
                }
            )
            ctxDispatch({ type: 'CART_CLEAR' })
            dispatch({ type: 'CREATE_SUCCESS' })
            localStorage.removeItem('cartItems')
            navigate(`/order/${data.order._id}`)

        } catch (err) {
            dispatch({ type: 'CREATE_FAIL' })
            toast.error(getError(err))            
        }
    }

    useEffect(() => {
        if(!cart.paymentMethod) {
            navigate('/payment')
        }
    }, [cart, navigate])

    return (
        <div>
            <CheckoutSteps step1 step2 step3 step4></CheckoutSteps>
            <Helmet>
                <title>Revisar orden</title>
            </Helmet>
            <h1 className="my-3">Revisar orden</h1>
            <Row>
                <Col md={8}>
                    <Card className="mb-3">
                        <Card.Body>
                            <Card.Title>Información de envío</Card.Title>
                            <Card.Text>
                                <strong>Nombre:</strong> {cart.shippingAddress.fullName} <br />
                                <strong>Dirección:</strong> {cart.shippingAddress.address}, {cart.shippingAddress.city}, {cart.shippingAddress.postalCode}, {cart.shippingAddress.country} <br />
                                <strong>Celular:</strong> {cart.shippingAddress.mobile}
                            </Card.Text>
                            <Link to="/shipping" className="edit-link">Editar</Link>
                        </Card.Body>
                    </Card>
                    <Card className="mb-3">
                        <Card.Body>
                            <Card.Title>Método de pago</Card.Title>
                            <Card.Text>
                                <strong>Método:</strong> {cart.paymentMethod}
                            </Card.Text>
                            <Link to="/payment" className="edit-link">Editar</Link>
                        </Card.Body>
                    </Card>
                    <Card className="mb-3">
                        <Card.Body>
                            <Card.Title>Items</Card.Title>
                            <ListGroup variant="flush">
                                {cart.cartItems.map((item) => (
                                    <ListGroup.Item key={item._id}>
                                        <Row className="item-container">
                                            <Col md={6} className="col-item">
                                                <img src={item.image} alt={item.name} className="img-fluid rounded img-thumbnail" />{' '}
                                                <Link to={`/product/${item.slug}`} className="text-cart-product">{item.name}</Link>
                                            </Col>
                                            <Col md={3}><strong>{item.quantity}</strong></Col>
                                            <Col md={3}>${item.price}</Col>
                                        </Row>
                                    </ListGroup.Item>
                                ))}
                            </ListGroup>
                            <Link to="/cart" className="edit-link">Editar</Link>
                        </Card.Body>
                    </Card>
                </Col>
                <Col md={4}>
                    <Card>
                        <Card.Body>
                            <Card.Title>Resumen del pedido</Card.Title>
                            <ListGroup variant="flush">
                                <ListGroup.Item>
                                    <Row>
                                        <Col>Items</Col>
                                        <Col>${cart.itemsPrice.toFixed(2)}</Col>
                                    </Row>
                                </ListGroup.Item>
                                <ListGroup.Item>
                                    <Row>
                                        <Col>Costo de envío</Col>
                                        <Col>${cart.shippingPrice.toFixed(2)}</Col>
                                    </Row>
                                </ListGroup.Item>
                                <ListGroup.Item>
                                    <Row>
                                        <Col>Platform Tax*</Col>
                                        <Col>${cart.platformTax.toFixed(2)}</Col>
                                    </Row>
                                </ListGroup.Item>
                                <ListGroup.Item>
                                    <Row>
                                        <Col><strong>Total</strong></Col>
                                        <Col>${cart.totalPrice.toFixed(2)}</Col>
                                    </Row>
                                </ListGroup.Item>
                                <ListGroup.Item>
                                    <div className="d-grid">
                                        <Button
                                            type="button"
                                            onClick={placeOrderHandler}
                                            disabled={cart.cartItems.length === 0}
                                            className="btn-submit"
                                        >Finalizar compra</Button>
                                        {loading && <LoadingBox></LoadingBox>}
                                    </div>
                                </ListGroup.Item>
                            </ListGroup>
                        </Card.Body>
                    </Card>
                    <div className="tax-info">
                        <p>* El Platform Tax (0,01%) es utilizado para mantener esta página.</p>
                    </div>
                </Col>
            </Row>
        </div>
    )
}

export default PlaceOrderScreen