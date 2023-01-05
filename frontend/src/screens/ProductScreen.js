import React, {useReducer, useEffect, useContext} from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import axios from 'axios'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import ListGroup from 'react-bootstrap/ListGroup'
import Rating from '../components/Rating.js'
import Badge from 'react-bootstrap/Badge'
import Button from 'react-bootstrap/Button'
import { Helmet } from 'react-helmet-async'
import MessageBox from '../components/MessageBox.js'
import LoadingBox from '../components/LoadingBox.js'
import { getError } from '../utils.js'
import { Store } from '../Store.js'

const reducer = (state, action) => {
    switch(action.type) {
        case 'FETCH_REQUEST':
            return {...state, loading: true}
        case 'FETCH_SUCCESS':
            return {...state, product: action.payload, loading: false}
        case 'FETCH_FAIL':
            return {...state, loading: false, error: action.payload}
        default:
            return state
    }
}

const ProductScreen = () => {

    const navigate = useNavigate()
    const params = useParams()
    const { slug } = params

    const [{ loading, error, product }, dispatch] = useReducer(reducer, {
        product: [],
        loading: true,
        error: ''
    })

    useEffect(() => {
        const fetchData = async () => {
            dispatch({type: 'FETCH_REQUEST'})
            try {
                const result = await axios.get(`/api/products/slug/${slug}`)
                dispatch({type: 'FETCH_SUCCESS', payload: result.data})
            } catch (err) {
                dispatch({type: 'FETCH_FAIL', payload: getError(err) })
            }
        }
        fetchData()
    }, [slug])

    const {state, dispatch: ctxDispatch} = useContext(Store)
    const {cart} = state

    const addToCartHandler = async() => {
        const existItem = cart.cartItems.find((x) => x._id === product._id)
        const quantity = existItem ? existItem.quantity + 1 : 1
        const { data } = await axios.get(`/api/products/${product._id}`)
        if (data.countInStock < quantity) {
            window.alert('Producto fuera de stock')
            return
        }
        ctxDispatch({
            type: 'CART_ADD_ITEM', 
            payload: {...product, quantity}
        })
        navigate('/cart')
    }

    return (
        loading ? (
        <LoadingBox />
        ) : error ? (
        <MessageBox variant="danger">{error}</MessageBox>
        ) :  
        (
            <div className="product-screen">
                <Row>
                    <Col md={6}>
                        <img src={product.image} className="img-large" alt={product.name} />
                    </Col>
                    <Col md={6}>
                        <ListGroup variante="flush" className="product-screen-info">
                            <ListGroup.Item className="product-screen-item">
                                <Helmet>
                                    <title>{product.name}</title>
                                </Helmet>
                                <h1>{product.name}</h1>
                            </ListGroup.Item>
                            <ListGroup.Item className="product-screen-item">
                                <Rating rating={product.rating} numReviews={product.numReviews}>
                                </Rating>
                            </ListGroup.Item>
                            <ListGroup.Item className="product-screen-item">
                                <p>{product.description}</p>
                            </ListGroup.Item>
                            <ListGroup.Item className="product-screen-item">    
                                <ListGroup variant="flush">
                                    <ListGroup.Item>
                                        <Row>
                                            <Col>Precio:</Col>
                                            <Col>${product.price}</Col>
                                        </Row>
                                    </ListGroup.Item>
                                    <ListGroup.Item className="product-screen-item">
                                        <Row>
                                            <Col>Estado</Col>
                                            <Col>{
                                                product.countInStock > 0 ?
                                                <Badge bg="success">En stock</Badge>
                                                : <Badge bg="danger">No disponible</Badge>
                                            }</Col>
                                        </Row>
                                    </ListGroup.Item>
                                    {
                                        product.countInStock > 0 && (
                                            <ListGroup.Item className="product-screen-item">
                                                <div className="d-grid">
                                                    <Button onClick={addToCartHandler} variant="primary" className="product-screen-item btn-add-to-cart">Agregar al carrito</Button>
                                                </div>
                                            </ListGroup.Item>
                                        )
                                    }
                                </ListGroup>
                            </ListGroup.Item>
                        </ListGroup>
                    </Col>
                </Row>
            </div>
        ))
}

export default ProductScreen