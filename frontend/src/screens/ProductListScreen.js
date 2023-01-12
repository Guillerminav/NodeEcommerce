import axios from 'axios'
import React, { useContext, useEffect, useReducer } from 'react'
import { Helmet } from 'react-helmet-async'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import LoadingBox from '../components/LoadingBox'
import MessageBox from '../components/MessageBox'
import { Store } from '../Store.js'
import { getError } from '../utils'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Button from 'react-bootstrap/Button'
import { toast } from 'react-toastify'

const reducer = (state, action) => {
    switch (action.type) {
        case 'FETCH_REQUEST':
            return {...state, loading: true}
        case 'FETCH_SUCCESS':
            return {
                ...state,
                products: action.payload.products,
                page: action.payload.page,
                pages: action.payload.pages,
                loading: false
            }
        case 'FETCH_FAIL':
            return {...state, loading: false, error: action.payload} 
        case 'CREATE_REQUEST':
            return {...state, loadingCreate: true}
        case 'CREATE_SUCCESS':
            return {...state, loadingCreate: false}
        case 'CREATE_FAIL':
            return {...state, loadingCreate: false} 
        case 'DELETE_REQUEST':
            return {...state, loadingDelete: true, successDelete: false}
        case 'DELETE_SUCCESS':
            return {...state, loadingDelete: false, successDelete: true}
        case 'DELETE_FAIL':
            return {...state, loadingDelete: false, successDelete: false} 
        case 'DELETE_RESET':
            return {...state, loadingDelete: false, successDelete: false} 
        default:
            return state
    }
}

const ProductListScreen = () => {

    const navigate = useNavigate()

    const [{ loading, error, products, pages, loadingCreate, loadingDelete, successDelete }, dispatch] = useReducer(reducer, {
        loading: true,
        error: ''
    })

    const { search } = useLocation()
    const sp = new URLSearchParams(search)
    const page = sp.get('page') || 1

    const { state }= useContext(Store)
    const { userInfo } = state

    useEffect(() => {
        const fetchData = async() => {
            try {
                const { data } = await axios.get(`/api/products/admin/?page=${page}`, {
                    headers: { Authorization: `Titular ${userInfo.token}`}
                })
                dispatch({ type: 'FETCH_SUCCESS', payload: data})
            } catch (err) {
                dispatch({
                    type: 'FETCH_FAIL',
                    payload: getError(err)
                })
            }
        }
        if (successDelete) {
            dispatch({type: 'DELETE_RESET'})
        } else {
            fetchData()
        }
    }, [page, userInfo, successDelete])

    const createHandler = async() => {
        try {
            dispatch({ type: 'CREATE_REQUEST'})
            const { data } = await axios.post(
                '/api/products',
                {},
                {
                    headers: { Authorization: `Titular ${userInfo.token}`}
                }
            )
            //toast.success('Producto creado')
            dispatch({ type: 'CREATE_SUCCESS' })
            navigate(`/admin/product/${data.product._id}`)
        } catch (err) {
            toast.error(getError(err))
            dispatch({
                type: 'CREATE_FAIL'
            })
        }
    }

    const deleteHandler = async (product) => {
        if (window.confirm('¿Eliminar producto?')) {
            try {
                await axios.delete(`/api/products/${product._id}`, {
                    headers: { Authorization: `Titular ${userInfo.token}` }
                })
                toast.success('Producto eliminado', {
                    autoClose: 1500
                })
                dispatch({ type: 'DELETE_SUCCESS'})
            } catch (err) {
                toast.error(getError(err))
                dispatch({
                    type: 'DELETE_FAIL'
                })
            }
        }
    }

    return (
        <div>
            <Helmet>
                <title>Productos</title>
            </Helmet>
            <Row className="align-items-center">
                <Col>
                    <h1>Productos</h1>
                </Col>
                <Col className="col text-end">
                    <div>
                        <Button type="button" className="btn-submit create-product-btn" onClick={createHandler}>
                            Crear producto
                        </Button>
                    </div>
                </Col>
            </Row>

            {loadingCreate && <LoadingBox></LoadingBox>}
            {loadingDelete && <LoadingBox></LoadingBox>}

            {loading ? (
                <LoadingBox></LoadingBox>
            ) : error ? (
                <MessageBox variant="danger"></MessageBox>
            ) : (
                <div className="table-products">
                    <table className="table">
                        <thead>
                            <tr>
                                <th>NOMBRE</th>
                                <th>$</th>
                                <th>CAT</th>
                                <th>MÁS</th>
                            </tr>
                        </thead>
                        <tbody className="table-body">
                            {products.map((product) => (
                                <tr key={product._id}>
                                    <td className="table-item-product">{product.name}</td>
                                    <td>{product.price}</td>
                                    <td className="table-item-product">{product.category}</td>
                                    <td className="botones-acciones">
                                        <Button
                                            className="btn-edit edit-btn"
                                            type="button"
                                            variant="light"
                                            onClick={(() => navigate(`/admin/product/${product._id}`))}
                                        >
                                            <i className="fas fa-pen"></i>
                                        </Button>
                                        <Button
                                            className="btn-edit delete-btn"
                                            type="button"
                                            variant="danger"
                                            onClick={() => deleteHandler(product)}
                                        >
                                            <i className="fas fa-trash"></i>
                                        </Button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <div>
                        {[...Array(pages).keys()].map((x) => (
                            <Link
                                className={x + 1 === Number(page) ? 'btn text-bold' : 'btn'}
                                key={x + 1}
                                to={`/admin/products?page=${x + 1}`}
                            >
                                {x + 1}
                            </Link>
                        ))}
                    </div>
                </div>
            )}
        </div>
    )
}

export default ProductListScreen