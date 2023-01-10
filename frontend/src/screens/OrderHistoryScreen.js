import axios from 'axios'
import React, { useContext, useEffect, useReducer } from 'react'
import { Helmet } from 'react-helmet-async'
import { useNavigate } from 'react-router-dom'
import LoadingBox from '../components/LoadingBox'
import MessageBox from '../components/MessageBox'
import { Store } from '../Store'
import { getError } from '../utils'
import Button from 'react-bootstrap/Button'

function reducer(state, action) {
    switch (action.type) {
        case 'FETCH_REQUEST': 
            return {...state, loading: true, error: ''}
        case 'FETCH_SUCCESS':
            return {...state, loading: false, order: action.payload, error: ''}
        case 'FETCH_FAIL':
            return {...state, loading: false, error: action.payload}

        default:
            return state
    }
}

const OrderHistoryScreen = () => {

    const { state } = useContext(Store)
    const { userInfo } = state
    const navigate = useNavigate() 

    const [{ loading, error, order } , dispatch] = useReducer(reducer, {
        loading: true,
        error: '',
    })

    console.log(order)

    useEffect(() => {
        const fetchData = async() => {
            dispatch({ type: 'FETCH_REQUEST' })
            try {
                const { data } = await axios.get(`/api/orders/mine`,
                { headers: { Authorization: `Titular ${userInfo.token}` } })
                dispatch({ type: 'FETCH_SUCCESS', payload: data })
            } catch (error) {
                dispatch({
                    type: 'FETCH_FAIL',
                    payload: getError(error)
                })
            }
        }
        fetchData()
    }, [userInfo])

    return (
        <div>
            <Helmet>
                <title>Mis pedidos</title>
            </Helmet>
            <h1>Mis pedidos</h1>

            {loading ? (
                <LoadingBox></LoadingBox>
            ) : error ? (
                <MessageBox variant="danger"></MessageBox>
            ) : (
                <table className="table">
                    <thead>
                        <tr>
                            <th className="titulo-tabla">FECHA</th>
                            <th className="titulo-tabla">TOTAL</th>
                            <th className="titulo-tabla">PAGADO</th>
                            <th className="titulo-tabla">ENVIADO</th>
                            <th className="titulo-tabla">MÁS</th>
                        </tr>
                    </thead>
                    <tbody>
                        {order.map((item) => (
                            <tr key={item._id}>
                                <td className="cuerpo-tabla">{item.createdAt.substring(0, 10)}</td>
                                <td className="cuerpo-tabla">{item.totalPrice.toFixed(2)}</td>
                                <td className="cuerpo-tabla">{item.isPaid ? item.paidAt.substring(0, 10) : 'No'}</td>
                                <td className="cuerpo-tabla">{item.isDelivered ? item.deliveredAt.substring(0, 10) : 'No'}</td>
                                <td className="cuerpo-tabla">
                                    <Button
                                        type="button"
                                        className="btn-detalles"
                                        onClick={() => {
                                            navigate(`/order/${item._id}`)
                                        }}
                                    >
                                        Detalles
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

export default OrderHistoryScreen