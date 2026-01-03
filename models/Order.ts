import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IOrder extends Document {
    orderNumber: string;
    customer: {
        name: string;
        surname: string;
        email: string;
        phone: string;
        address: string;
    };
    items: {
        product: mongoose.Types.ObjectId;
        quantity: number;
        price: number;
    }[];
    totalAmount: number;
    user?: mongoose.Types.ObjectId;
    status: 'Pending' | 'PaymentReceived' | 'Shipped' | 'Delivered' | 'Cancelled';
    paymentMethod: string;
    createdAt: Date;
    updatedAt: Date;
}

const OrderSchema: Schema = new Schema(
    {
        orderNumber: { type: String, required: true, unique: true },
        customer: {
            name: { type: String, required: true },
            surname: { type: String, required: true },
            email: { type: String, required: true },
            phone: { type: String, required: true },
            address: { type: String, required: true },
        },
        items: [
            {
                product: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
                quantity: { type: Number, required: true },
                price: { type: Number, required: true },
            },
        ],
        totalAmount: { type: Number, required: true },
        user: { type: Schema.Types.ObjectId, ref: 'User', required: false },
        status: {
            type: String,
            enum: ['Pending', 'PaymentReceived', 'Shipped', 'Delivered', 'Cancelled'],
            default: 'Pending',
        },
        paymentMethod: { type: String, default: 'Havale/EFT', required: true },
    },
    { timestamps: true }
);

const Order: Model<IOrder> =
    mongoose.models.Order || mongoose.model<IOrder>('Order', OrderSchema);

export default Order;
