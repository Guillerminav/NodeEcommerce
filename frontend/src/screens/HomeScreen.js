import React, { useEffect, useReducer } from 'react'
//import data from "../data";
import axios from 'axios'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import logger from 'use-reducer-logger'
import Product from '../components/Product.js'
import { Helmet } from 'react-helmet-async'
import LoadingBox from '../components/LoadingBox.js'
import MessageBox from '../components/MessageBox.js'


const reducer = (state, action) => {
    switch(action.type) {
        case 'FETCH_REQUEST':
            return {...state, loading: true}
        case 'FETCH_SUCCESS':
            return {...state, products: action.payload, loading: false}
        case 'FETCH_FAIL':
            return {...state, loading: false, error: action.payload}
        default:
            return state
    }
}

const HomeScreen = () => {

    const [{ loading, error, products }, dispatch] = useReducer(logger(reducer), {
        products: [],
        loading: true,
        error: ''
    })


    useEffect(() => {
        const fetchData = async () => {
            dispatch({type: 'FETCH_REQUEST'})
            try {
                const result = await axios.get('/api/products')
                dispatch({type: 'FETCH_SUCCESS', payload: result.data})
            } catch (err) {
                dispatch({type: 'FETCH_FAIL', payload: err.message})
            }
            
        }
        fetchData()
    }, [])

    return (
        <div>
            <Helmet>
                <title>VIGAN</title>
            </Helmet>
            <div className="destacados-container">
                <p className="home-text">COMER SANO, RICO Y A BASE DE PLANTAS ES CADA VEZ MÁS FÁCIL</p>
            </div>
            <div className="products">
                {
                    loading ? (
                        <LoadingBox />
                    ) : error ? (
                        <MessageBox variant="danger">{error}</MessageBox>
                    ) : ( 
                    <Row>
                        {products.map(product => (
                            <Col key={product.slug} sm={6} md={4} lg={3} className="mb-4">
                                <Product product={product}></Product>
                            </Col>
                        ))}
                    </Row>
                )}
            </div>
        </div>
    )
}

export default HomeScreen

