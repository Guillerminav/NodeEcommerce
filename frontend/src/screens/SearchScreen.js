import axios from 'axios'
import React, { useEffect, useReducer, useState } from 'react'
import { useLocation, useNavigate, Link } from 'react-router-dom'
import { getError } from '../utils'
import { toast } from 'react-toastify'
import { Helmet } from 'react-helmet-async'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import LoadingBox from '../components/LoadingBox'
import MessageBox from '../components/MessageBox'
import Button from 'react-bootstrap/Button'
import Product from '../components/Product.js'
import LinkContainer from 'react-router-bootstrap/LinkContainer'



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
                countProducts: action.payload.countProducts,
                loading: false
            }
        case 'FETCH_FAIL':
            return {...state, loading: false, error: action.payload} 
        default:
            return state
    }
}

// const prices = [
//     {
//         name: '$1 to $50',
//         value: '1-50',
//     },
//     {
//         name: '$51 to $200',
//         value: '51-200',
//     },
//     {
//         name: '$201 to $1000',
//         value: '201-1000',
//     },
// ];

const SearchScreen = () => {

    const navigate = useNavigate()
    const { search } = useLocation()
    const sp = new URLSearchParams(search)
    const category = sp.get('category') || 'all'
    const query = sp.get('query') || 'all'
    const price = sp.get('price') || 'all'
    const order = sp.get('order') || 'newest'
    const page = sp.get('page') || 1

    const [{ loading, error, products, pages, countProducts }, dispatch] = useReducer(reducer, {
        loading: true,
        error: ''
    })

    useEffect(() => {
        const fetchData = async() => {
            try {
                const { data } = await axios.get(
                    `/api/products/search?page=${page}&query=${query}&category=${category}&price=${price}&order=${order}`
                )
                dispatch({ type: 'FETCH_SUCCESS', payload: data })
            } catch (error) {
                dispatch({
                    type: 'FETCH_FAIL',
                    payload: getError(error)
                })
            }
        }
        fetchData()
    }, [category, error, order, page, price, query])

    const [categories, setCategories] = useState([]);
    useEffect(() => {
    const fetchCategories = async () => {
        try {
            const { data } = await axios.get(`/api/products/categories`);
            setCategories(data);
        } catch (err) {
            toast.error(getError(err));
        }
        };
        fetchCategories();
    }, [dispatch]);

        
    const getFilterUrl = (filter) => {
        const filterPage = filter.page || page;
        const filterCategory = filter.category || category;
        const filterQuery = filter.query || query;
        const filterPrice = filter.price || price;
        const sortOrder = filter.order || order;
        return {
            pathname: '/search',
            search: `?category=${filterCategory}&query=${filterQuery}&price=${filterPrice}&order=${sortOrder}&page=${filterPage}`
        };
    };


    return (
        <div>
            <Helmet>
                <title>Buscar Productos</title>
            </Helmet>
            <Row>
                <Col md={3}>
                    <h3>Categorías</h3>
                    <div>
                        <ul className="ul-search">
                            <li>
                                <Link
                                    className={'all' === category ? 'text-bold link-item' : 'link-item'}
                                    to={getFilterUrl({category: 'all'})}
                                >
                                    Todas
                                </Link>
                            </li>
                            {categories.map((c) => (
                                <li>
                                    <Link
                                        className={c === category ? 'text-bold link-item' : 'link-item'}
                                        to={getFilterUrl({ category: c })}
                                    >
                                        {c}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                    {/* <div>
                        <h3>Precio</h3>
                        <ul>
                            <li>
                                <Link
                                        className={'all' === price ? 'text-bold' : ''}
                                        to={getFilterUrl({ price: 'all' })}
                                    >
                                        Todos
                                    </Link>
                            </li>
                            {prices.map((p) => (
                                <li key={p.value}>
                                    <Link
                                        to={getFilterUrl({ price: p.value })}
                                        className={p.value === price ? 'text-bold' : ''}
                                    >
                                        {p.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div> */}
                </Col>
                <Col md={9} className="mt-3">
                    {loading ? (
                        <LoadingBox></LoadingBox>
                    ) : error ? (
                        <MessageBox variant="danger"></MessageBox>
                    ) : (
                        <div>
                            <Row className="justify-content-between mb-3">
                                <Col md={6} className="filtrar-por">
                                    <div className="category-search">
                                        {query !== 'all' && ' ' + query}
                                        {category !== 'all' && ' ' + category}
                                        {/* {price !== 'all' && ' : Price ' + price} */}
                                        {query !== 'all' ||
                                        category !== 'all' ||
                                        price !== 'all' ? (
                                        <Button
                                            variant="light"
                                            onClick={() => navigate('/search')}
                                        >
                                            <i className="fas fa-times-circle"></i>
                                        </Button>
                                        ) : null}
                                    </div>
                                    <div>
                                        Filtrar por{' '}
                                        <select
                                            value={order}
                                            onChange={(e) => {
                                            navigate(getFilterUrl({ order: e.target.value }));
                                            }}
                                            className="select-search"
                                        >
                                            <option value="newest">Nuevos</option>
                                            <option value="lowest">Precio: - a +</option>
                                            <option value="highest">Precio: + a -</option>
                                        </select>
                                    </div>
                                </Col>
                            </Row>
                            {products.length === 0 && (
                                <MessageBox>No se encontraron productos</MessageBox>
                            )}

                            <Row>
                                {products.map((product) => (
                                <Col sm={6} lg={4} className="mb-3" key={product._id}>
                                    <Product product={product}></Product>
                                </Col>
                                ))}
                            </Row>

                            <div className="results-search">
                                {countProducts === 0 ? 'No' : countProducts} Resultados
                                {[...Array(pages).keys()].map((x) => (
                                <LinkContainer
                                    key={x + 1}
                                    className="mx-1"
                                    to={getFilterUrl({ page: x + 1 })}
                                >
                                    <Button
                                    className={Number(page) === x + 1 ? 'text-bold' : ''}
                                    variant="light"
                                    >
                                    {x + 1}
                                    </Button>
                                </LinkContainer>
                                ))}
                            </div>
                        </div>
                    )}
                </Col>
            </Row>
        </div>
    )
}

export default SearchScreen