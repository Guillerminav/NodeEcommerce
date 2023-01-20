import axios from 'axios'
import React, { useContext, useEffect, useReducer } from 'react'
import Button from 'react-bootstrap/Button'
import { Helmet } from 'react-helmet-async'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import LoadingBox from '../components/LoadingBox'
import MessageBox from '../components/MessageBox'
import { Store } from '../Store'
import { getError } from '../utils'

function reducer(state, action) {
    switch (action.type) {
        case 'FETCH_REQUEST': 
            return {...state, loading: true}
        case 'FETCH_SUCCESS':
            return {...state, loading: false, users: action.payload}
        case 'FETCH_FAIL':
            return {...state, loading: false, error: action.payload}
        case 'DELETE_REQUEST':
            return {...state, loadingDelete: true, successDelete: false}
        case 'DELETE_SUCCESS':
            return {...state, loadingDelete: false, successDelete: true}
        case 'DELETE_FAIL':
            return {...state, loadingDelete: false} 
        case 'DELETE_RESET':
            return {...state, loadingDelete: false, successDelete: false} 
        default:
            return state
    }
}

const UserListScreen = () => {

    const navigate = useNavigate()

    const [{ loading, error, users, loadingDelete, successDelete }, dispatch] = useReducer(reducer, {
        loading: true,
        error: ''
    })

    const { state } = useContext(Store)
    const { userInfo } = state

    useEffect(() => {
        const fetchData = async() => {
            try {
                dispatch({ type: 'FETCH_REQUEST' })
                const { data } = await axios.get(`/api/users`, {
                    headers: { Authorization: `Titular ${userInfo.token}`}
                })
                dispatch({type: 'FETCH_SUCCESS', payload: data})
            } catch (err) {
                dispatch({
                    type: 'FETCH_FAIL',
                    payload: getError(err)
                })
            }
    }
    if (successDelete) {
        dispatch({ type: 'DELETE_RESET' })
    }
    fetchData()
}, [userInfo, successDelete])

    const deleteHandler = async (user) => {
        if (window.confirm('¿Eliminar usuario?')) {
            try {
                dispatch({ type: 'DELETE_REQUEST'})
                await axios.delete(`/api/users/${user._id}`, {
                    headers: { Authorization: `Titular ${userInfo.token}` }
                })
                toast.success('Usario eliminado', {
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
                <title>Clientes</title>
            </Helmet>
            <h1>Clientes</h1>
            {loadingDelete && <LoadingBox></LoadingBox>}
            {loading ? (
                <LoadingBox></LoadingBox>
            ) : error ? (
                <MessageBox variant="danger">{error}</MessageBox>
            ) : (
                <table className="table">
                    <thead>
                        <tr>
                            <th className="titulo-tabla">NOMBRE</th>
                            <th className="titulo-tabla">EMAIL</th>
                            <th className="titulo-tabla">AD</th>
                            <th className="titulo-tabla">MÁS</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map((user) => (
                            <tr key={user._id}>
                                <td className="cuerpo-tabla">{user.name}</td>
                                <td className="cuerpo-tabla">{user.email}</td>
                                <td className="cuerpo-tabla">{user.isAdmin ? 'Sí' : 'No' }</td>
                                <td className="botones-acciones">
                                    <Button 
                                        type="button"
                                        className="btn-detalles"
                                        onClick={() => navigate(`/admin/user/${user._id}`)}
                                    >
                                        Editar
                                    </Button>
                                    <Button type="button"  variant="danger" className="btn-detalles" onClick={() => {
                                        deleteHandler(user)
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

export default UserListScreen