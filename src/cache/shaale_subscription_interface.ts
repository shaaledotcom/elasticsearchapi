export interface ShaaleSubscriptionInterface {
    subscription: SubscriptionDetailsInterface[];
    trialDays?: number | null;
    reviews?: Array<{ name: string, review: string, stars: number }>;
    faqs?: Array<{ content: string, title: string }>;
}

export interface SubscriptionDetailsInterface {
    price?: {
        amount: number;
        currency?: string,
        subUnit?: number,
        symbol?: string,
    };
    id?: string;
    orderName?: string;
    type?: string;
    couponCode?:string;
    showPlan?: boolean;
}

export interface SubscriptionDataInterface {
    isActive: boolean;
    type: 'yearly' | 'monthly' | string;
    amount: number;
    couponCode: string | null;
    showPlan: boolean;
    planOrderName: string;
    planId: string;
    currency: string;
}
