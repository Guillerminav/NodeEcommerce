import mongoose from 'mongoose'

const orderSchema = new mongoose.Schema(
    {
        orderItems: [
            {
                slug: { type: String, required: true },
                name: { type: String, required: true },
                quantity: { type: Number, required: true },
                image: { type: String, required: true },
                price: { type: Number, required: true },
                product: { 
                    type: mongoose.Schema.Types.ObjectId, 
                    required: true,
                    ref: 'Product'
                },

            }
        ],
        shippingAddress: {
            fullName: { type: String, required: true },
            address: { type: String, required: true },
            city: { type: String, required: true },
            postalCode: { type: String, required: true },
            country: { type: String, required: true },
            mobile: { type: Number, required: true },
        },
        paymentMethod: { type: String, required: true },
        paymentResult: {
            id: String,
            status: String,
            update_time: String,
            email_address: String
        },
        itemsPrice: { type: Number, required: true },
        shippingPrice: { type: Number, required: true },
        platformTax: { type: Number, required: true },
        totalPrice: { type: Number, required: true },
        user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', requried: true },
        isPaid: { type: Boolean, default: false },
        paidAt: { type: Date },
        isDelivered: { type: Boolean, defalut: false },
        deliveredAt: { type: Date }
    },
    {
        timestamps: true
    }
)

const Order = mongoose.model('Order', orderSchema)
export default Order