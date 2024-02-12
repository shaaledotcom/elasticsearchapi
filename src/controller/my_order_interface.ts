export interface MyOrderInterface {
    url: string;
    name: string;
    orderId: string;
    type?: 'subscription' | 'purchase' | 'membership';
    productName?: 'live' | 'library' | 'learn' | string;
    id?: string;
    price: Price;
    paymentDate: Date;
    couponCode: string;
    thumbnail: string;
    expiryDate: Date;
    subscriptionId?: string;
    status?: string;
    subscriptionType?: 'monthly' | 'yearly' | string;
    planId?: string;
    planName: string;
    autoRenew?: boolean;
}

export interface Price {
    amount: number;
    currency: 'INR' | 'USD' | string;
    symbol: string;
    subUnit: number;
}
