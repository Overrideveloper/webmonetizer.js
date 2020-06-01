import { WebMonetizerState, IWebMonetizerPayment } from '../../../../webmonetizer.js/dist'

export interface IState {
    monetizationState: WebMonetizerState | null;
    total: number;
    currency: string | null;
    payments: IWebMonetizerPayment[]
}