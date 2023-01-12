import axios from 'axios'
import React, { useContext, useEffect, useReducer } from 'react'
import { Helmet } from 'react-helmet-async'
import { Link, useLocation } from 'react-router-dom'
import LoadingBox from '../components/LoadingBox'
import MessageBox from '../components/MessageBox'
import Store from '../Store.js'

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
        case 'FETC_FAIL':
            return {...state, loading: false, error: action.payload} 
        default:
            return state
    }
}

const ProductListScreen = () => {

    const [{ loading, error, products, pages }, dispach] = useReducer(reducer, {
        loading: true,
        error: ''
    })

    const { search, pathname } = useLocation()
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
            } catch (err) {
                
            }
        }
        fetchData()
    }, [userInfo, page])

    return (
        <div>
            <Helmet>
                <title>Productos</title>
            </Helmet>
            <h1>Productos</h1>
            {loading ? (
                <LoadingBox></LoadingBox>
            ) : error ? (
                <MessageBox variant="danger"></MessageBox>
            ) : (
                <div>
                    <table className="table">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>NOMBRE</th>
                                <th>PRECIO</th>
                                <th>CAT</th>
                            </tr>
                        </thead>
                        <tbody>
                            {products.map((product) => (
                                <tr key={product._id}>
                                    <td>{product._id}</td>
                                    <td>{product.name}</td>
                                    <td>{product.price}</td>
                                    <td>{product.category}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <div>
                        {[...Array(pages).keys()].map((x) => (
                            <Link
                                className={x + 1 === Number(page) ? 'btn text-bold' : 'btn'}
                                key={x + 1}
                                to={`/productlist?page=${x+1}`}
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