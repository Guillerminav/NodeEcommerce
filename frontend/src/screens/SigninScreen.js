import React from 'react'
import Container from 'react-bootstrap/Container'
import Button from 'react-bootstrap/esm/Button'
import Form from 'react-bootstrap/Form'
import { Helmet } from 'react-helmet-async'
import { Link, useLocation } from 'react-router-dom'

const SigninScreen = () => {

    const { search } = useLocation()
    const redirectInUrl = new URLSearchParams(search).get('redirect')
    const redirect = redirectInUrl ? redirectInUrl : '/'

    return (
        <Container className="small-container">
            <Helmet>
                <title>Iniciar sesión</title>
            </Helmet>
            <h1 className="my-3">Iniciar sesión</h1>
            <Form>
                <Form.Group className="mb-3" controlId="email">
                    <Form.Label>Email</Form.Label>
                    <Form.Control type="email" required />
                </Form.Group>
                <Form.Group className="mb-3" controlId="password">
                    <Form.Label>Contraseña</Form.Label>
                    <Form.Control type="password" required />
                </Form.Group>
                <div className="mb-3">
                    <Button type="submit">Ingresar</Button>
                </div>
                <div className="mb-3">
                    ¿Todavía no tenes cuenta?{' '}
                    <Link to={`/signup?redirect=${redirect}`}>Crear cuenta</Link>
                </div>
            </Form>
        </Container>
    )
}

export default SigninScreen