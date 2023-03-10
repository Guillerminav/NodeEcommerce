import axios from 'axios'
import React, { useContext, useEffect, useReducer } from 'react'
import Col from 'react-bootstrap/Col'
import Row from 'react-bootstrap/Row'
import Card from 'react-bootstrap/Card'
import LoadingBox from '../components/LoadingBox'
import MessageBox from '../components/MessageBox'
import { Store } from '../Store'
import { getError } from '../utils'
import { Helmet } from 'react-helmet-async'
import Chart from 'react-google-charts'

const reducer = (state, action) => {
    switch (action.type) {
        case 'FETCH_REQUEST':
            return {...state, loading: true}
        case 'FETCH_SUCCESS':
            return {
                ...state,
                summary: action.payload,
                loading: false
            }
        case 'FETC_FAIL':
            return {...state, loading: false, error: action.payload} 
        default:
            return state
    }
}


const DashboardScreen = () => {

    const [{ loading, summary, error }, dispatch] = useReducer(reducer, {
        loading: true,
        error: ''
    })

    const { state } = useContext(Store)
    const { userInfo } = state

    useEffect(() => {
        const fetchData = async() => {
            try {
                const { data } = await axios.get('/api/orders/summary', {
                    headers: { Authorization: `Titular ${userInfo.token}`}
                })
                dispatch({
                    type: 'FETCH_SUCCESS',
                    payload: data
                })
            } catch (err) {
                dispatch({
                    type: 'FETCH_FAIL',
                    payload: getError(err)
                })
            }
        }
        fetchData()
    }, [userInfo])

    return (
        <div>
            <Helmet>
                <title>Dashboard</title>
            </Helmet>
            <h1>Dashboard</h1>
            {loading ? (<LoadingBox/>)
            : error ? (<MessageBox />)
            : (
                <div>
                    <Row className="dash-row-container">
                        <Col md={4} className="dashboard-card-container">
                            <Card className="card-dashboard">
                                <div className="dashboard-item">
                                    <Card.Title className="card-body-dash">{summary.users && summary.users[0] ? summary.users[0].numUsers : 0}</Card.Title>
                                    <Card.Text className="card-body-dash">Clientes</Card.Text>
                                </div>
                            </Card>
                        </Col>
                        <Col md={4} className="dashboard-card-container">
                            <Card className="card-dashboard">
                                <div className="dashboard-item">
                                    <Card.Title className="card-body-dash">{summary.orders && summary.orders[0] ? summary.orders[0].numOrders : 0}</Card.Title>
                                    <Card.Text className="card-body-dash">Pedidos</Card.Text>
                                </div>
                            </Card>
                        </Col>
                        <Col md={4} className="dashboard-card-container">
                            <Card className="card-dashboard">
                                <div className="dashboard-item">
                                    <Card.Title className="card-body-dash">${summary.orders && summary.users[0] ? summary.orders[0].totalSales.toFixed(2) : 0}</Card.Title>
                                    <Card.Text className="card-body-dash">Total</Card.Text>
                                </div>
                            </Card>
                        </Col>
                        
                    </Row>
                    <div className="my-3">
                        <h2>Ventas</h2>
                        {summary.dailyOrders.length === 0 ? (
                            <MessageBox>No hay ventas</MessageBox>
                        ) : (
                            <Chart
                                width="100%"
                                height="300px"
                                chartType="AreaChart"
                                loader={<div>Cargando...</div>}
                                data={[
                                    ['Fecha', 'Ventas'], 
                                    ...summary.dailyOrders.map((x) => [x._id, x.orders])
                                ]}
                            >
                            </Chart>
                        )}
                    </div>
                    <div className="my-3">
                        <h2>Categor??as</h2>
                        {summary.productCategories.length === 0 ? (
                            <MessageBox>No categor??a</MessageBox>
                        ) : (
                            <Chart
                                width="100%"
                                height="300px"
                                chartType="PieChart"
                                loader={<div>Cargando...</div>}
                                data={[
                                    ['Categor??a', 'Productos'], 
                                    ...summary.productCategories.map((x) => [x._id, x.count])
                                ]}
                            >
                            </Chart>
                        )}
                    </div>
                </div>
            )
            }

        </div>
    )
}

export default DashboardScreen