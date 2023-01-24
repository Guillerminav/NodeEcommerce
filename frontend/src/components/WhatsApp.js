import React from 'react'
import { LinkContainer } from 'react-router-bootstrap'

const WhatsApp = () => {
    return (
        <div className="wpp-container">
            <LinkContainer to='https://wa.me/message/Y2VMQ7J3KL5PG1'>
                <div>
                    <i className="fab fa-whatsapp"></i>
                </div>
            </LinkContainer>
        </div>
    )
}

export default WhatsApp