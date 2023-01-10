import React from 'react'
import Col from 'react-bootstrap/Col'
import Row from 'react-bootstrap/Row'

const CheckoutSteps = (props) => {
    return (
        <Row className="checkout-steps">
            <Col className={props.step1 ? 'active' : ''} >Ingresar</Col>
            <Col className={props.step2 ? 'active' : ''} >Envío</Col>
            <Col className={props.step3 ? 'active' : ''} >Pago</Col>
            <Col className={props.step4 ? 'active' : ''} >Finalizar</Col>

        </Row>
    )
}

export default CheckoutSteps