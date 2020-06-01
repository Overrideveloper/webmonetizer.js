import { WebMonetizerStatus, IProgressEventDetail, IPayment } from "./types";
import { MonetizationEvents } from './enums';
import { REMOVE_META_TAG, BROWSER_UNSUPPORTED_WARNING, INJECT_META_TAG } from './utils';
import { BehaviorSubject, Subject } from 'rxjs';
import { initializeEvents, emitNewPayment, scaleAmountDown, _paymentPointer } from "./symbols";

export class WebMonetizer {
    /** Emits current monetization state */
    public state: BehaviorSubject<WebMonetizerStatus>;

    /** Emits streaming micropayments */
    public newPayment: Subject<IPayment>;

    /** Unique payment URL */
    private [_paymentPointer]: string;

    /** Create instance of WebMonetizer
     * @param {string} paymentPointer - Unique payment URL
    */
    constructor(paymentPointer: string) {
      if (!paymentPointer) {
        throw new Error("Payment pointer cannot be null");
      }

      const initialState: WebMonetizerStatus = !(document as any).monetization ? 'unsupported' : (document as any).monetization.state;

      this.newPayment = new Subject();
      this.state = new BehaviorSubject(initialState);
      this[_paymentPointer] = paymentPointer;

      this[initializeEvents]();
    }

    /** Setup listeners for monetization events */
    private [initializeEvents]() {
      if ((document as any).monetization) {
        (document as any).monetization.addEventListener(MonetizationEvents.START, () => this.state.next("started"));
        (document as any).monetization.addEventListener(MonetizationEvents.PENDING, () => this.state.next("pending"));
        (document as any).monetization.addEventListener(MonetizationEvents.STOP, () => this.state.next("stopped"));
        (document as any).monetization.addEventListener(MonetizationEvents.PROGRESS, (event: CustomEvent) => this[emitNewPayment](event.detail as IProgressEventDetail));
      }
    }

    /** Emit streamed micropayment detail via the `newPayment` Subject
     * @param {IProgressEventDetail} detail - Monetization progress event detail
    */
    private async [emitNewPayment](detail: IProgressEventDetail) {
      const payment: IPayment = {
        currency: detail.assetCode,
        amount: this[scaleAmountDown](detail.amount, detail.assetScale),
        paymentPointer: detail.paymentPointer,
        requestId: detail.requestId
      }

      this.newPayment.next(payment);
    }

    /** Scale micropayment amount down to actual value
     * @param {string} amount - Micropayment amount value
     * @param {scale} scale - Micropayment amount scale
     * @returns {number} Actual (scaled-down) amount value
    */
    private [scaleAmountDown](amount: string, scale: number) {
      return Number((Number(amount) * Math.pow(10, -scale)).toFixed(scale));
    }

    /** Begin sending micropayments */
    public stop() {
      if ((document as any).monetization) {
        REMOVE_META_TAG();
      } else {
        BROWSER_UNSUPPORTED_WARNING();
      }
    }

    /** Stop sending micropayments */
    public start() {
      if ((document as any).monetization) {
        INJECT_META_TAG(this[_paymentPointer]);
      } else {
        BROWSER_UNSUPPORTED_WARNING();
      }
    }
}