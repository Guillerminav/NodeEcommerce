import express from 'express'
import mongoose from 'mongoose'
import dotenv from 'dotenv'
import seedRouter from './routes/seedRoutes.js'
import productRouter from './routes/productRoutes.js'
import userRouter from './routes/userRoutes.js'
import orderRouter from './routes/orderRoutes.js'
import mercadopago from 'mercadopago'

mercadopago.configure({
    access_token: "APP_USR-6505705558398191-010910-d149b41eb9e60a652fdc02e510133c39-1020907984"
})

mongoose.set('strictQuery', true)

dotenv.config()

mongoose.connect(process.env.MONGODB_URI).then(() => {
    console.log('connected to db')
}).catch(err => {
    console.log(err.message)
})

const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.get('/api/keys/paypal', (req, res) => {
    res.send(process.env.PAYPAL_CLIENT_ID || 'sb')
})

app.use('/api/seed', seedRouter)
app.use('/api/products', productRouter)
app.use('/api/users', userRouter)
app.use('/api/orders', orderRouter)


app.use((err, req, res, next) => {
    res.status(500).send({ message: err.message })
})

const port = process.env.PORT || 5000

app.listen(port, () => {
    console.log(`Server listening on port ${port}`)
})
