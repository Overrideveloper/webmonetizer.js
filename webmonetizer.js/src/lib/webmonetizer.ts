import { WebMonetizerStatus, IProgressEventDetail, IPayment } from "./types";
import { MonetizationEvents } from './enums';
import { REMOVE_META_TAG, BROWSER_UNSUPPORTED_WARNING, INJECT_META_TAG } from './utils';
import { BehaviorSubject, Subject } from 'rxjs';

export class WebMonetizer {
    public state: BehaviorSubject<WebMonetizerStatus>;
    public newPayment: Subject<IPayment>;

    constructor(private paymentPointer: string) {
      const initialState: WebMonetizerStatus = !(document as any).monetization ? 'unsupported' : (document as any).monetization.state;

      this.newPayment = new Subject();
      this.state = new BehaviorSubject(initialState);

      this.initializeEvents();
    }

    private initializeEvents() {
      if ((document as any).monetization) {
        (document as any).monetization.addEventListener(MonetizationEvents.START, () => this.state.next("started"));
        (document as any).monetization.addEventListener(MonetizationEvents.PENDING, () => this.state.next("pending"));
        (document as any).monetization.addEventListener(MonetizationEvents.STOP, () => this.state.next("stopped"));
        (document as any).monetization.addEventListener(MonetizationEvents.PROGRESS, (event: CustomEvent) => this.emitNewPayment(event.detail as IProgressEventDetail));
      }
    }

    private async emitNewPayment(detail: IProgressEventDetail) {
      const payment: IPayment = {
        currency: detail.assetCode,
        amount: this.scaleAmountDown(detail.amount, detail.assetScale),
        paymentPointer: detail.paymentPointer,
        requestId: detail.requestId
      }

      this.newPayment.next(payment);
    }

    private scaleAmountDown(amount: string, scale: number) {
      return Number((Number(amount) * Math.pow(10, -scale)).toFixed(scale));
    }

    public stop() {
      if ((document as any).monetization) {
        REMOVE_META_TAG();
      } else {
        BROWSER_UNSUPPORTED_WARNING();
      }
    }

    public start() {
      if ((document as any).monetization) {
        INJECT_META_TAG(this.paymentPointer);
      } else {
        BROWSER_UNSUPPORTED_WARNING();
      }
    }
}