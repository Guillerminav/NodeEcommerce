import React, { useContext, useEffect, useReducer } from 'react'
import { Store } from '../Store.js'
import axios from 'axios'
import { getError } from '../utils.js'
import { Helmet } from 'react-helmet-async'
import LoadingBox from '../components/LoadingBox.js'
import MessageBox from '../components/MessageBox.js'
import Button from 'react-bootstrap/Button'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'

function reducer(state, action) {
    switch (action.type) {
        case 'FETCH_REQUEST': 
            return {...state, loading: true}
        case 'FETCH_SUCCESS':
            return {...state, loading: false, orders: action.payload}
        case 'FETCH_FAIL':
            return {...state, loading: false, error: action.payload}
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

const OrderListScreen = () => {

    const navigate = useNavigate()

    const { state } = useContext(Store)
    const { userInfo } = state
    const [{ loading, error, orders, loadingDelete, successDelete }, dispatch] = useReducer(reducer, {
        loading: true,
        error: '',
    })

    useEffect(() => {
        const fetchData = async () => {
            try {
                dispatch({ type: 'FETCH_REQUEST' })
                const { data } = await axios.get(`/api/orders`, {
                    headers: { Authorization: `Titular ${userInfo.token}`}
                })
                dispatch({ type: 'FETCH_SUCCESS' ,payload: data })
            } catch (err) {
                dispatch({ type: 'FETCH_FAIL', payload: getError(err) })
            }
        }
        if(successDelete) {
            dispatch({ type: 'DELETE_RESET' })
        } else {
            fetchData()
        }
    }, [userInfo, successDelete])

    const deleteHandler = async (order) => {
        if (window.confirm('¿Eliminar pedido?')) {
            try {
                dispatch({ type: 'DELETE_REQUEST'})
                await axios.delete(`/api/orders/${order._id}`, {
                    headers: { Authorization: `Titular ${userInfo.token}` }
                })
                toast.success('Pedido eliminado')
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
                <title>Pedidos</title>
            </Helmet>
            <h1>Pedidos</h1>
            {loadingDelete && <LoadingBox></LoadingBox>}
            {loading ? (
                <LoadingBox></LoadingBox>
            ) : error ? (
                <MessageBox variant="danger">{error}</MessageBox>
            ) : (
                <table className="table">
                    <thead>
                        <tr>
                            <th className="titulo-tabla">CLIENTE</th>
                            <th className="titulo-tabla"><i className="fas fa-calendar"></i></th>
                            <th className="titulo-tabla">TOTAL</th>
                            <th className="titulo-tabla">$</th>
                            <th className="titulo-tabla"><i className="fas fa-bicycle"></i></th>
                            <th className="titulo-tabla">MÁS</th>
                        </tr>
                    </thead>
                    <tbody>
                        {orders.map((order) => (
                            <tr key={order._id}>
                                <td className="cuerpo-tabla">{order.user ? order.user.name : 'USUARIO ELIMINADO'}</td>
                                <td className="cuerpo-tabla">{order.createdAt.substring(0, 10)}</td>
                                <td className="cuerpo-tabla">{order.totalPrice.toFixed(2)}</td>
                                <td className="cuerpo-tabla">{order.isPaid ? 'Sí' : 'No'}</td>
                                <td className="cuerpo-tabla">{order.isDelivered ? 'Sí' : 'No'}</td>
                                <td className="botones-acciones">
                                    <Button type="button" className="btn-detalles" onClick={() => {
                                        navigate(`/order/${order._id}`)
                                    }}>
                                        +
                                    </Button>
                                    <Button type="button"  variant="danger" className="btn-detalles" onClick={() => {
                                        deleteHandler(order)
                                    }}>
                                        <i className="fas fa-trash"></i>
                                    </Button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    )
}

export default OrderListScreen