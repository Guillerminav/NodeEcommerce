import React, { useContext } from 'react'
import { Link } from 'react-router-dom'
import Card from 'react-bootstrap/Card'
import Button from 'react-bootstrap/Button'
import Rating from '../components/Rating.js'
import { Store } from '../Store.js'
import axios from 'axios'
import { toast } from 'react-toastify'


const Product = (props) => {
    const {product} = props

    const {state, dispatch: ctxDispatch} = useContext(Store)
    const {
        cart: { cartItems }
    } = state

    const addToCartHandler = async(item) => {
        const existItem = cartItems.find((x) => x._id === product._id)
        const quantity = existItem ? existItem.quantity + 1 : 1;
        const { data } = await axios.get(`/api/products/${item._id}`)
        if (data.countInStock < quantity) {
            //window.alert('Producto fuera de stock')
            return
        }
        ctxDispatch({
            type: 'CART_ADD_ITEM', 
            payload: {...item, quantity}
        })
        toast.success("Producto agregado", {
            autoClose: 2000
        })
    }

    return (
        <Card className="product" key={product.slug}>
            <Link to={`/product/${product.slug}`} className="img-container">
                <img src={product.image} className="card-img-top" alt={product.name} />
            </Link>
            <Card.Body className="card-body">
                <Link to={`/product/${product.slug}`} className="card-title card-body-item">
                    <Card.Title className="card-body-title">{product.name}</Card.Title>
                </Link>
                <div className="price-rating">
                    <Rating rating={product.rating} numReviews={product.numReviews}></Rating>
                    <Card.Text className="card-body-item">${product.price}</Card.Text>
                </div>
                {product.countInStock === 0 ? <Button variant="light" disabled>Fuera de stock</Button> : <Button onClick={() => addToCartHandler(product)} className="btn-cart">Agregar al carrito</Button>}
            </Card.Body>
        </Card>
    )
}

export default Product