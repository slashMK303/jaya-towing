import midtransClient from 'midtrans-client';

export const snap = new midtransClient.Snap({
    isProduction: process.env.MIDTRANS_IS_PRODUCTION === 'true',
    serverKey: process.env.MIDTRANS_SERVER_KEY || '',
    clientKey: process.env.MIDTRANS_CLIENT_KEY || '',
});

export interface BookingData {
    orderId: string;
    totalAmount: number;
    customerName: string;
    customerEmail?: string;
    customerPhone: string;
    serviceId: string;
    serviceName: string;
}

export async function createTransaction(bookingData: BookingData) {
    const parameter = {
        transaction_details: {
            order_id: bookingData.orderId,
            gross_amount: bookingData.totalAmount,
        },
        customer_details: {
            first_name: bookingData.customerName,
            email: bookingData.customerEmail,
            phone: bookingData.customerPhone,
        },
        item_details: [{
            id: bookingData.serviceId,
            price: bookingData.totalAmount,
            quantity: 1,
            name: bookingData.serviceName,
        }],
    };

    const transaction = await snap.createTransaction(parameter);
    return transaction.token;
}
