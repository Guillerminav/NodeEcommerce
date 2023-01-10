import React, { useContext, useEffect, useState } from 'react'
import { Helmet } from 'react-helmet-async'
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { useNavigate } from 'react-router-dom';
import { Store } from '../Store';
import CheckoutSteps from '../components/CheckoutSteps.js';


const ShippingAddressScreen = () => {

    const navigate = useNavigate()
    const { state, dispatch: ctxDispatch } = useContext(Store)

    const {
        userInfo,
        cart: { shippingAddress },
    } = state

    const [fullName, setFullName] = useState(shippingAddress.fullName || '')
    const [address, setAddress] = useState(shippingAddress.address || '')
    const [city, setCity] = useState(shippingAddress.city || '')
    const [postalCode, setPostalCode] = useState(shippingAddress.postalCode || '')
    const [country, setCountry] = useState(shippingAddress.country || '')
    const [mobile, setMobile] = useState(shippingAddress.mobile || '')

    useEffect(() => {
        if (!userInfo) {
            navigate('/signin?redirect=/shipping')
        }
    }, [userInfo, navigate])

    const submitHandler = (e) => {
        e.preventDefault()
        ctxDispatch({
            type: 'SAVE_SHIPPING_ADDRESS',
            payload: {
                fullName,
                address,
                city,
                postalCode,
                country,
                mobile
            }
        })
        localStorage.setItem(
            'shippingAddress',
            JSON.stringify({
                fullName,
                address,
                city,
                postalCode,
                country,
                mobile
            })
        )
        navigate('/payment')
    }

    return (
        <div>
            <Helmet>
                <title>Información de envío</title>
            </Helmet>
            <CheckoutSteps step1 step2></CheckoutSteps>
            <div className="container small-container">
                <h1 className="my-3">Información de envío</h1>
                <Form onSubmit={submitHandler}>
                    <Form.Group className='my-2'>
                        <Form.Label>Nombre completo</Form.Label>
                        <Form.Control 
                            value={fullName}
                            onChange={(e) => setFullName(e.target.value)}
                            required    
                        />
                    </Form.Group>
                    <Form.Group className='my-2'>
                        <Form.Label>Dirección</Form.Label>
                        <Form.Control 
                            value={address}
                            onChange={(e) => setAddress(e.target.value)}
                            required    
                        />
                    </Form.Group>
                    <Form.Group className='my-2'>
                        <Form.Label>Ciudad</Form.Label>
                        <Form.Control 
                            value={city}
                            onChange={(e) => setCity(e.target.value)}
                            required    
                        />
                    </Form.Group>
                    <Form.Group className='my-2'>
                        <Form.Label>Código postal</Form.Label>
                        <Form.Control 
                            value={postalCode}
                            onChange={(e) => setPostalCode(e.target.value)}
                            required    
                        />
                    </Form.Group>
                    <Form.Group className='my-2'>
                        <Form.Label>País</Form.Label>
                        <Form.Control 
                            value={country}
                            onChange={(e) => setCountry(e.target.value)}
                            required    
                        />
                    </Form.Group>
                    <Form.Group className='my-2'>
                        <Form.Label>Celular</Form.Label>
                        <Form.Control 
                            value={mobile}
                            onChange={(e) => setMobile(e.target.value)}
                            required    
                        />
                    </Form.Group>
                    <div className="mb-3 mt-3">
                        <Button type="submit" className="btn-submit">Continuar</Button>
                    </div>
                </Form>
            </div>
            
        </div>
    )
}

export default ShippingAddressScreen