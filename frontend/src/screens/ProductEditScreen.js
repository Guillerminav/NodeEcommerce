import React, { useContext, useEffect, useReducer, useState } from 'react'
import { Store } from '../Store.js'
import { Helmet } from 'react-helmet-async'
import { getError } from '../utils.js'
import axios from 'axios'
import { useNavigate, useParams } from 'react-router-dom'
import LoadingBox from '../components/LoadingBox.js'
import MessageBox from '../components/MessageBox.js'
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import { toast } from 'react-toastify'

const reducer = (state, action) => {
    switch (action.type) {
        case 'FETCH_REQUEST':
            return {...state, loading: true}
        case 'FETCH_SUCCESS':
            return {...state, loading: false}
        case 'FETCH_FAIL':
            return {...state, loading: false, error: action.payload} 
        case 'UPDATE_REQUEST':
            return {...state, loadingUpdate: true}
        case 'UPDATE_SUCCESS':
            return {...state, loadingUpdate: false}
        case 'UPDATE_FAIL':
            return {...state, loadingUpdate: false} 
        case 'UPLOAD_REQUEST':
            return {...state, loadingUpload: true, errorUpload: ''}
        case 'UPLOAD_SUCCESS':
            return {...state, loadingUpload: false, errorUpload: ''}
        case 'UPLOAD_FAIL':
            return {...state, loadingUpload: false, errorUpload: action.payload} 
        default:
            return state
    }
}

const ProductEditScreen = () => {

    const navigate = useNavigate()
    const params = useParams()
    const { id: productId } = params

    const { state }= useContext(Store)
    const { userInfo } = state
    const [{ loading, error, loadingUpdate, loadingUpload }, dispatch] = useReducer(reducer, {
        loading: false,
        error: ''
    })

    const [name, setName] = useState('')
    const [slug, setSlug] = useState('')
    const [price, setPrice] = useState('')
    const [image, setImage] = useState('')
    const [category, setCategory] = useState('')
    const [countInStock, setCountInStock] = useState('')
    const [description, setDescription] = useState('')

    useEffect(() => {
        const fetchData = async() => {
            try {
                dispatch({ type: 'FETCH_REQUEST' })
                const { data } = await axios.get(`/api/products/${productId}`)
                setName(data.name)
                setSlug(data.slug)
                setPrice(data.price)
                setImage(data.image)
                setCategory(data.category)
                setCountInStock(data.countInStock)
                setDescription(data.description)
                dispatch({ type: 'FETCH_SUCCESS' })

            } catch(err) {
                dispatch({
                    type: 'FETCH_FAIL',
                    payload: getError(err)
                })
            }
        }
        fetchData()
    }, [productId])

    const submitHandler = async(e) => {
        e.preventDefault()
        try {
            dispatch({ type: 'UPDATE_REQUEST' })
            await axios.put(
                `/api/products/${productId}`,
                {
                    _id: productId,
                    name,
                    slug,
                    price,
                    image,
                    category,
                    countInStock,
                    description
                },
                {
                    headers: { Authorization: `Titular ${userInfo.token}`}
                }
            )
            dispatch({
                type: 'UPDATE_SUCCESS'
            })
            toast.success('Producto actualizado', {
                autoClose: 1500
                }
            )
            navigate('/admin/products')
        } catch (err) {
            toast.error(getError(err))
            dispatch({ type: 'UPDATE_FAIL' })
        }
    }

    const uploadFileHandler = async (e) => {
        const file = e.target.files[0]
        const bodyFormData = new FormData()
        bodyFormData.append('file', file)
        try {
            dispatch({ type: 'UPLOAD_REQUEST' })
            const { data } = await axios.post(`/api/upload`, bodyFormData, {
                headers: {
                    'Content-Type' : 'multipart/form-data',
                    Authorization: `Titular ${userInfo.token}`
                }
            })
            dispatch({ type: 'UPLOAD_SUCCESS' })
            toast.success('Imagen agregada', {
                autoClose: 1000
            })
            setImage(data.secure_url)
        } catch (err) {
            toast.error(getError(err))
            dispatch({ type: 'UPLOAD_FAIL', payload: getError(err) })
        }
    }

    return (
        <div className="container small-container">
            <Helmet>
                <title>Editar producto {productId}</title>
            </Helmet>
            <h3 className="edit-product-title">Editar producto <span className="edit-product-id">{productId}</span></h3>
            {loading ? (
                <LoadingBox></LoadingBox>
            ) : error ? (
                <MessageBox variant="danger">{error}</MessageBox>
            ) : (
                <Form onSubmit={submitHandler}>
                    <Form.Group className="mb-3" controlId="name">
                        <Form.Label>Nombre</Form.Label>
                        <Form.Control
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                        >
                        </Form.Control>
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="slug">
                        <Form.Label>Slug</Form.Label>
                        <Form.Control
                            value={slug}
                            onChange={(e) => setSlug(e.target.value)}
                            required
                        >
                        </Form.Control>
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="price">
                        <Form.Label>Precio</Form.Label>
                        <Form.Control
                            value={price}
                            onChange={(e) => setPrice(e.target.value)}
                            required
                        >
                        </Form.Control>
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="image">
                        <Form.Label>Imagen</Form.Label>
                        <Form.Control
                            value={image}
                            onChange={(e) => setImage(e.target.value)}
                            required
                        >
                        </Form.Control>
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="imageFile">
                        <Form.Label>Subir foto</Form.Label>
                        <Form.Control type="file" onChange={uploadFileHandler} />
                        {loadingUpload && <LoadingBox></LoadingBox>}
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="category">
                        <Form.Label>Categoría</Form.Label>
                        <Form.Control
                            value={category}
                            onChange={(e) => setCategory(e.target.value)}
                            required
                        >
                        </Form.Control>
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="countInStock">
                        <Form.Label>Stock</Form.Label>
                        <Form.Control
                            value={countInStock}
                            onChange={(e) => setCountInStock(e.target.value)}
                            required
                        >
                        </Form.Control>
                    </Form.Group>
                    <Form.Group className="mb-4" controlId="description">
                        <Form.Label>Descripción</Form.Label>
                        <Form.Control
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            required
                        >
                        </Form.Control>
                    </Form.Group>
                    <div className="mb-2">
                        <Button disabled={loadingUpdate} type="submit">Actualizar</Button>
                        {loadingUpdate && <LoadingBox></LoadingBox>}
                    </div>
                </Form>
            )}
        </div>
    )
}

export default ProductEditScreen