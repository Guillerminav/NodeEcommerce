import React, { useContext, useEffect, useState } from 'react'
import { Helmet } from 'react-helmet-async'
import Form from 'react-bootstrap/Form'
import CheckoutSteps from '../components/CheckoutSteps'
import Button from 'react-bootstrap/Button'
import { Store } from '../Store'
import { useNavigate } from 'react-router-dom'

const PaymentMethodScreen = () => {

    const navigate = useNavigate()

    const { state, dispatch: ctxDispatch } = useContext(Store)
    const {
        cart: { shippingAddress, paymentMethod },
    } = state

    const [paymentMethodName, setPaymentMethodName] = useState(
        paymentMethod || 'MercadoPago'
    )

    useEffect(() => {
        if (!shippingAddress.address) {
            navigate('/shipping')
        }
    }, [shippingAddress, navigate])

    const submitHandler = (e) => {
        e.preventDefault()
        ctxDispatch({ type:'SAVE_PAYMENT_METHOD', payload: paymentMethodName })
        localStorage.setItem('paymentMethod', paymentMethodName)
        navigate('/placeorder')
    }

    return (
        <div>
            <CheckoutSteps step1 step2 step3></CheckoutSteps>
            <div className="container small-container">
                <Helmet>
                    <title>Método de pago</title>
                </Helmet>
                <h1 className="my-3">Método de pago</h1>
                <Form onSubmit={submitHandler}>
                    {/* <div className="mb-3">
                        <Form.Check
                            type="radio"
                            id="MercadoPago"
                            label="MercadoPago"
                            value="MercadoPago"
                            checked={paymentMethodName === "MercadoPago"}
                            onChange={(e) => setPaymentMethodName(e.target.value)}
                        />
                    </div> */}
                    <div className="mb-3">
                        <Form.Check
                            type="radio"
                            id="PayPal"
                            label="PayPal"
                            value="PayPal"
                            checked={paymentMethodName === "PayPal"}
                            onChange={(e) => setPaymentMethodName(e.target.value)}
                        />
                    </div>
                    <div className="mb-3">
                        <Form.Check
                            type="radio"
                            id="Transferencia"
                            label="Transferencia"
                            value="Transferencia"
                            checked={paymentMethodName === "Transferencia"}
                            onChange={(e) => setPaymentMethodName(e.target.value)}
                        />
                    </div>
                    <div className="mb-3">
                        <Form.Check
                            type="radio"
                            id="Efectivo"
                            label="Efectivo"
                            value="Efectivo"
                            checked={paymentMethodName === "Efectivo"}
                            onChange={(e) => setPaymentMethodName(e.target.value)}
                        />
                    </div>
                    <div>
                        <Button type="submit" className="btn-submit">Continuar</Button>
                    </div>
                </Form>
            </div>
        </div>
    )
}

export default PaymentMethodScreen