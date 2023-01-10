import React, { useContext, useEffect, useState } from 'react'
import Container from 'react-bootstrap/Container'
import Button from 'react-bootstrap/esm/Button'
import Form from 'react-bootstrap/Form'
import { Helmet } from 'react-helmet-async'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { Store } from '../Store.js'
import { toast } from 'react-toastify'
import { getError } from '../utils.js'

const SignupScreen = () => {

    const navigate = useNavigate()

    const { search } = useLocation()
    const redirectInUrl = new URLSearchParams(search).get('redirect')
    const redirect = redirectInUrl ? redirectInUrl : '/'

    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')

    const { state, dispatch: ctxDispatch } = useContext(Store)
    const { userInfo } = state

    const submitHandler = async (e) => {
        
        e.preventDefault()

        if (password !== confirmPassword) {
            toast.error('Las contraseñas no coinciden')
            return
        }

        try {
            const { data } = await axios.post('/api/users/signup', {
                name,
                email,
                password
            })
            ctxDispatch({ type: 'USER_SIGNIN', payload: data })
            localStorage.setItem('userInfo', JSON.stringify(data))
            navigate(redirect || '/')
        } catch (err) {
            toast.error(getError(err))
        }
    }

    useEffect(() => {
        if (userInfo) {
            navigate(redirect)
        }
    }, [navigate, redirect, userInfo])

    return (
        <Container className="small-container">
            <Helmet>
                <title>Registrarse</title>
            </Helmet>
            <h1 className="my-3">Iniciar sesión</h1>
            <Form onSubmit={submitHandler}>
                <Form.Group className="mb-3" controlId="email">
                    <Form.Label>Nombre</Form.Label>
                    <Form.Control type="name" required onChange={(e) => setName(e.target.value)} />
                </Form.Group>
                <Form.Group className="mb-3" controlId="email">
                    <Form.Label>Email</Form.Label>
                    <Form.Control type="email" required onChange={(e) => setEmail(e.target.value)} />
                </Form.Group>
                <Form.Group className="mb-3" controlId="password">
                    <Form.Label>Contraseña</Form.Label>
                    <Form.Control type="password" required onChange={(e) => setPassword(e.target.value)} />
                </Form.Group>
                <Form.Group className="mb-3" controlId="password">
                    <Form.Label>Repetir contraseña</Form.Label>
                    <Form.Control type="confirmPassword" required onChange={(e) => setConfirmPassword(e.target.value)} />
                </Form.Group>
                <div className="mb-3">
                    <Button type="submit" className="btn-submit">Registrarme</Button>
                </div>
                <div className="mb-3">
                    ¿Ya tenes una cuenta?{' '}
                    <Link to={`/signin?redirect=${redirect}`}>Iniciar sesión</Link>
                </div>
            </Form>
        </Container>
    )
}

export default SignupScreen