import React from 'react'

const Footer = () => {
    return (
        <div className="footer-container">
            <div className="vigan-links">
                <a href="https://www.instagram.com/viganrosario/?hl=cs" className="redes-link"><i className="fab fa-instagram" target="_blank" rel="noreferrer" ></i> @viganrosario</a>
            </div>
            <div className="guille-links">
                <p>Creado con <i className="fas fa-heart"></i> por <a href="https://guillerminabousono.vercel.app/" className="portfolio-link" target="_blank" rel="noreferrer" >Guille</a></p>
            </div>
        </div>
    )
}

export default Footer