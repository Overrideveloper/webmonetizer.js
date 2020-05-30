export type WebMonetizerStatus = 'unsupported' | 'pending' | 'started' | 'stopped'

export interface IProgressEventDetail {
    paymentPointer: string;
    requestId: string;
    amount: string;
    assetCode: string;
    assetScale: number;
}

export interface IPayment {
    currency: string;
    amount: number;
    requestId: string;
    paymentPointer: string;
}
