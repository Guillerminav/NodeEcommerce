import axios from 'axios'
import React, { useContext, useEffect, useReducer } from 'react'
import { PayPalButtons, usePayPalScriptReducer } from '@paypal/react-paypal-js'
import Col from 'react-bootstrap/Col'
import Row from 'react-bootstrap/Row'
import { Helmet } from 'react-helmet-async'
import { useNavigate, useParams } from 'react-router-dom'
import LoadingBox from '../components/LoadingBox.js'
import MessageBox from '../components/MessageBox.js'
import { Store } from '../Store.js'
import { getError } from '../utils.js'
import Card from 'react-bootstrap/Card'
import ListGroup from 'react-bootstrap/ListGroup'
import { Link } from 'react-router-dom'
import { toast } from 'react-toastify'


function reducer(state, action) {
    switch (action.type) {
        case 'FETCH_REQUEST': 
            return {...state, loading: true, error: ''}
        case 'FETCH_SUCCESS':
            return {...state, loading: false, order: action.payload, error: ''}
        case 'FETCH_FAIL':
            return {...state, loading: false, error: action.payload}
        case 'PAY_REQUEST':
            return {...state, loadingPay: true}
        case 'PAY_SUCCESS':
            return {...state, loadingPay: false, successPay: true}
        case 'PAY_FAIL':
            return {...state, loadingPay: false, errorPay: action.payload}
        case 'PAY_RESET':
            return {...state, loadingPay: false, successPay: false}
        default:
            return state
    }
}

const OrderScreen = () => {

    const { state } = useContext(Store)
    const { userInfo } = state

    const params = useParams()
    const { id: orderId } = params

    const navigate = useNavigate()

    const [{ loading, error, order, successPay, loadingPay }, dispatch] = useReducer(reducer, {
        loading: true,
        order: {},
        error: '',
        successPay: false,
        loadingPay: false
    })

    const [{ isPending }, paypalDispatch] = usePayPalScriptReducer()

    function createOrder(data, actions) {
        return actions.order
            .create({
                purchase_units: [
                    {
                        amount: { value: order.totalPrice }
                    }
                ]
            })
            .then((orderID) => {
                return orderID
            })
    }

    function onApprove(data, actions) {
        return actions.order.capture().then(async function (details) {
            try {
                dispatch({ type: 'PAY_REQUEST' })
                const { data } = await axios.put(
                    `/api/orders/${order._id}/pay`,
                    details,
                    {
                        headers: { authorization: `Titular ${userInfo.token}` }
                    }
                )
                dispatch({ type: 'PAY_SUCCESS', payload: data })
                toast.success('Pago realizado')
            } catch (err) {
                dispatch({type: 'PAY_FAIL', payload: getError(err)})
                toast.error(getError(err))
            }
        })
    }

    function onError(err) {
        toast.error(getError(err))
    }

    useEffect(() => {

        const fetchOrder = async() => {
            try {
                dispatch({ type: 'FETCH_REQUEST' })
                const { data } = await axios.get(`/api/orders/${orderId}`, {
                    headers: { authorization: `Titular ${userInfo.token}`}
                })
                dispatch({ type: 'FETCH_SUCCESS', payload: data})
            } catch (err) {
                dispatch({ type: 'FETCH_FAIL', payload: getError(err)})
            }
        }

        if (!userInfo) {
            return navigate('/login')
        }
        if (!order._id || successPay || (order._id && order._id !== orderId)) {
            fetchOrder()
            if (successPay) {
                dispatch({ type: 'PAY_RESET' })
            }
        } else {
            const loadPayPalScript = async() => {
                const { data: clientId } = await axios.get('/api/keys/paypal', {
                    headers: { authorization: `Titular ${userInfo.token}` }
                })
                paypalDispatch({
                    type: 'resetOptions',
                    value: {
                        'client-id': clientId,
                        currency: 'USD'
                    }
                })
                paypalDispatch({ type: 'setLoadingStatus', value: 'pending' })
            }
            loadPayPalScript()
        }
    }, [order, userInfo, orderId, navigate, paypalDispatch, successPay])

    return (
        loading ? (
            <LoadingBox></LoadingBox>
        ) : error ? (
            <MessageBox variant="danger">{error}</MessageBox>
        ) : (
            <div>
                <Helmet>
                    <title>Orden {orderId}</title>
                </Helmet>
                <h3 className="my-3">Orden {orderId}</h3>
                <Row>
                    <Col md={8}>
                        <Card className="mb-3">
                            <Card.Body>
                                <Card.Title>Información de envío</Card.Title>
                                <Card.Text>
                                    <strong>Nombre:</strong> {order.shippingAddress.fullName} <br />
                                    <strong>Dirección:</strong> {order.shippingAddress.address}, {order.shippingAddress.city}, {order.shippingAddress.postalCode}, {order.shippingAddress.country} <br />
                                    <strong>Celular:</strong> {order.shippingAddress.mobile}
                                </Card.Text>
                                {order.isDelivered ? (
                                    <MessageBox variant="success">Enviado {order.deliveredAt}</MessageBox>
                                ) : (
                                    <MessageBox variant="danger">No enviado</MessageBox>
                                )
                                }
                            </Card.Body>
                        </Card>
                        <Card className="mb-3">
                            <Card.Body>
                                <Card.Title>Información de pago</Card.Title>
                                <Card.Text>
                                    <strong>Método</strong> {order.paymentMethod}
                                </Card.Text>
                                {order.isPaid ? (
                                    <MessageBox variant="success">Pagado {order.paidAt}</MessageBox>
                                ) : (
                                    <MessageBox variant="danger">No pagado</MessageBox>
                                )
                                }
                            </Card.Body>
                        </Card>
                        <Card className="mb-3">
                            <Card.Body>
                            <Card.Title>Items</Card.Title>
                            <ListGroup variant="flush">
                                {order.orderItems.map((item) => (
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
                        <Card className="mb-3">
                            <Card.Body>
                                <Card.Title>Resumen de compra</Card.Title>
                                <ListGroup variant="flush">
                                    <ListGroup.Item>
                                        <Row>
                                            <Col>Items</Col>
                                            <Col>${order.itemsPrice.toFixed(2)}</Col>
                                        </Row>
                                    </ListGroup.Item>
                                    <ListGroup.Item>
                                        <Row>
                                            <Col>Envío</Col>
                                            <Col>${order.shippingPrice.toFixed(2)}</Col>
                                        </Row>
                                    </ListGroup.Item>
                                    <ListGroup.Item>
                                        <Row>
                                            <Col><strong>Total</strong></Col>
                                            <Col>
                                            <strong>${order.totalPrice.toFixed(2)}</strong></Col>
                                        </Row>
                                    </ListGroup.Item>
                                        {(!order.isPaid && order.paymentMethod === "PayPal") && (
                                            <ListGroup.Item>
                                                {isPending ? (
                                                    <LoadingBox />
                                                ) : (
                                                    <div>
                                                        <PayPalButtons
                                                            createOrder={createOrder}
                                                            onApprove={onApprove}
                                                            onError={onError}
                                                        ></PayPalButtons>
                                                    </div>
                                                )}
                                                {loadingPay && <LoadingBox></LoadingBox>}
                                            </ListGroup.Item>
                                        )}
                                </ListGroup>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            </div>
        )
    )
}

export default OrderScreen