import React, {useReducer, useEffect, useContext, useRef, useState} from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
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
import Form from 'react-bootstrap/Form'
import FloatingLabel from 'react-bootstrap/FloatingLabel'
import { toast } from 'react-toastify'
import Card from 'react-bootstrap/Card'


const reducer = (state, action) => {
    switch(action.type) {
        case 'REFRESH_PRODUCT':
            return {...state, product: action.payload}
        case 'CREATE_REQUEST':
            return {...state, loadingCreateReview: true}
        case 'CREATE_SUCCESS':
            return {...state, loadingCreateReview: false}
        case 'CREATE_FAIL':
            return {...state, loadingCreateReview: false}
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

    const reviewsRef = useRef()

    const [rating, setRating] = useState(0)
    const [comment, setComment] = useState("")
    const [selectedImage, setSelectedImage] = useState('')

    const navigate = useNavigate()
    const params = useParams()
    const { slug } = params

    const [{ loading, error, product, loadingCreateReview }, dispatch] = useReducer(reducer, {
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
    const { cart, userInfo } = state

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

    const submitHandler = async(e) => {
        e.preventDefault()
        if (!comment || !rating) {
            toast.error('Por favor escriba un comentario')
            return
        } 
        try {
            const { data } = await axios.post(
                `/api/products/${product._id}/reviews`,
                { rating, comment, name: userInfo.name },
                {
                    headers: { Authorization: `Titular ${userInfo.token}` }
                }
            )
            dispatch({ type: 'CREATE_SUCCESS' })
            toast.success('Comentario enviado')
            product.reviews.unshift(data.review)
            product.numreviews = data.numReviews
            dispatch({ type: 'REFRESH_PRODUCT', payload: product })
            window.scrollTo({
                behavior: 'smooth',
                top: reviewsRef.current.offsetTop
            })
        } catch (err) {
            toast.error(getError(err))
            dispatch({ type: 'CREATE_FAIL'})
        }
    }

    return (
        loading ? (
        <LoadingBox />
        ) : error ? (
        <MessageBox variant="danger">{error}</MessageBox>
        ) :  
        (
            <div className="product-screen">
                <Row className="row-container">
                    <Col md={5}>
                        <img src={selectedImage || product.image} className="img-large" alt={product.name} />
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
                                    <ListGroup.Item>
                                        <Row xs={1} md={2} className="images-container">
                                            {
                                                [product.image, ...product.images].map((x) => (
                                                    <Col key={x}  className="images-container2">
                                                        <Card >
                                                            <Button
                                                                className="thumbnail"
                                                                type="button"
                                                                variant="light"
                                                                onClick={() => setSelectedImage(x)}
                                                            >
                                                                <Card.Img 
                                                                    variant="top"
                                                                    src={x}
                                                                    alt="product"
                                                                    className="images-image"
                                                                />
                                                            </Button>
                                                        </Card>
                                                    </Col>
                                                ))
                                            }
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
                <div className="reviews-container">
                    <h2 ref={reviewsRef}>Comentarios</h2>
                    <div>
                        {product.reviews.length === 0 && (
                            <MessageBox>No hay comentarios</MessageBox>
                        )}
                    </div>
                    <ListGroup>
                        {product.reviews.map((review) => (
                            <ListGroup.Item key={review._id}>
                                <strong>{review.name}</strong>
                                <Rating rating={review.rating} caption=" "></Rating>
                                <p>{review.createdAt.substring(0, 10)}</p>
                                <p>{review.comment}</p>
                            </ListGroup.Item>
                        ))}
                    </ListGroup>
                    <div>
                        {userInfo ? (
                            <form onSubmit={submitHandler}>
                                <h2 className="my-3">Escribir comentario</h2>
                                <Form.Group>
                                    <Form.Label>Calificar</Form.Label>
                                    <Form.Select
                                        aria-label="Rating"
                                        value={rating}
                                        onChange={(e) => setRating(e.target.value)}
                                    >
                                        <option value="">Seleccionar</option>
                                        <option value="1">1 - Muy malo</option>
                                        <option value="2">2 - Malo</option>
                                        <option value="3">3 - Bueno</option>
                                        <option value="4">4 - Muy bueno</option>
                                        <option value="5">5 - Excelente</option>
                                    </Form.Select>
                                </Form.Group>
                                <FloatingLabel
                                    controlId="floatingTextarea"
                                    label="Escribe un comentario"
                                    className="mb-3"
                                >
                                    <Form.Control 
                                        as="textarea"
                                        placeholder="Deja tu comentario aca"
                                        value={comment}
                                        onChange={(e) => setComment(e.target.value)}
                                    />
                                </FloatingLabel>
                                <div className="mb-3">
                                    <Button className="btn-submit" type="submit" disabled={loadingCreateReview}>Enviar</Button>
                                    {loadingCreateReview && <LoadingBox></LoadingBox>}
                                </div>
                            </form>
                        ) : (
                            <MessageBox>
                                Por favor <Link to={`/signin?redirect=/product/${product.slug}`}>inicie sesión</Link> para escribir un comentario.
                            </MessageBox>
                        )}
                    </div>
                </div>
            </div>
        ))
}

export default ProductScreen