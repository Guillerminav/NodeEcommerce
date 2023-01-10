import React, { useContext, useReducer, useState } from 'react'
import Button from 'react-bootstrap/Button'
import { Helmet } from 'react-helmet-async'
import  Form  from 'react-bootstrap/Form'
import { Store } from '../Store'
import { toast } from 'react-toastify'
import { getError } from '../utils'
import axios from 'axios'


const reducer = (state, action ) => {
    switch(action.type) {
        case 'UPDATE_REQUEST':
            return {...state, loadingUpdate: true}
        case 'UPDATE_SUCCESS':
            return {...state, loadingUpdate: false}
        case 'UPDATE_FAIL':
            return {...state, loadingUpdate: false}
        default:
            return state
    }
}

const ProfileScreen = () => {

    const { state, dispatch: ctxDispatch } = useContext(Store)
    const { userInfo } = state
    const [name, setName] = useState(userInfo.name)
    const [email, setEmail] = useState(userInfo.email)
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')

    const [{ loadingUpdate }, dispatch] = useReducer(reducer, {
        loadingUpdate: false
    })

    const submitHandler = async(e) => {
        e.preventDefault()
        try {
            const { data } = await axios.put(
                '/api/users/profile',
                {
                    name,
                    email,
                    password
                },
                {
                    headers: { Authorization: `Titular ${userInfo.token}` }
                }
            )
            dispatch({
                type: 'UPDATE_SUCCESS'
            })
            ctxDispatch({ type: 'USER_SIGNIN', payload: data })
            localStorage.setItem('userInfo', JSON.stringify(data))
            toast.success('Perfil actualizado')
        } catch (err) {
            dispatch({
                type: 'FETCH_FAIL'
            })
            toast.error(getError(err))
        }
    }

    return (
        <div className="container small-container">
            <Helmet>
                <title>Perfil</title>
            </Helmet>
            <h1 className="my-3">Perfil</h1>
            <form onSubmit={submitHandler}>
                <Form.Group className="mb-3" controlId="name">
                    <Form.Label>Nombre</Form.Label>
                    <Form.Control
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                    >
                    </Form.Control>
                </Form.Group>
                <Form.Group className="mb-3" controlId="email">
                    <Form.Label>Email</Form.Label>
                    <Form.Control
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    >
                    </Form.Control>
                </Form.Group>
                <Form.Group className="mb-3" controlId="password">
                    <Form.Label>Contraseña</Form.Label>
                    <Form.Control
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    >
                    </Form.Control>
                </Form.Group>
                <Form.Group className="mb-3" controlId="password">
                    <Form.Label>Confirmar contraseña</Form.Label>
                    <Form.Control
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                    >
                    </Form.Control>
                </Form.Group>
                <div className="mb-3">
                    <Button type="submit" className="btn-submit">Actualizar</Button>
                </div>
            </form>
        </div>
    )
}

export default ProfileScreen