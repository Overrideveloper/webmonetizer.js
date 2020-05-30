import { JSDOM } from 'jsdom';
import { WebMonetizer } from './webmonetizer';
import { MonetizationEvents } from './enums';
import { IPayment } from './types';

const PAYMENT_POINTER = 'RANDOM_STRING';
const BROWSER_UNSUPPORTED_WARNING = 'Your browser does not support Web Monetization. See https://webmonetization.org/docs/explainer#browsers to learn how to enable Web Monetization on your browser';

const dom = new JSDOM(`<!DOCTYPE html><html><head></head><body></body></html>`);
global.document = dom.window.document;

let webMonetizer: WebMonetizer;


function initialize() {
    webMonetizer = new WebMonetizer(PAYMENT_POINTER);
}

function mockMonetization() {
    (<any>document)["monetization"] = document.createElement("div");
    (<any>document)["monetization"]["state"] = "stopped";
    (<any>document)["monetization"]["_requestId"] = "fc23b14d-70e4-4d55-b0a0-dd86f70ce402'";
}

function removeMonetizationMock() {
    (<any>document)["monetization"] = undefined;
}

function createCustomEvent (name: string, opts: any = {}) {
    const e: any = document.createEvent('HTMLEvents');
    e.detail = opts.detail;
    e.initEvent(name, opts.bubbles, opts.cancelable);
    return e;
}

describe('WebmonetizerJS', () => {
    afterEach(() => {
        removeMonetizationMock();
    });

    it('should be created', () => {
        initialize();
        expect(webMonetizer).toBeTruthy();
    });

    it('should set first state to `unsupported`', () => {
        initialize();
        expect(webMonetizer.state.getValue()).toBe('unsupported');
    });

    it('should set first state to `stopped`', () => {
        mockMonetization();
        initialize();
        expect(webMonetizer.state.getValue()).toBe('stopped');
    });

    it('should inject meta tag if `start` is called monetization is supported', () => {
        mockMonetization();
        initialize();
        webMonetizer.start();

        const metaTag = <HTMLMetaElement> document.querySelector('meta[name="monetization"]');

        expect(metaTag).toBeTruthy();
        expect(metaTag.content).toBe(PAYMENT_POINTER);
    });

    it('should remove meta tag if `stop` is called and monetization is supported', () => {
      mockMonetization();
      initialize();
      webMonetizer.start();
  
      let metaTag = <HTMLMetaElement> document.querySelector('meta[name="monetization"]');
  
      expect(metaTag).toBeTruthy();
  
      webMonetizer.stop();
  
      metaTag = <HTMLMetaElement> document.querySelector('meta[name="monetization"]');
  
      expect(metaTag).toBeFalsy();
    });
  
    it('should set state to `started` on START monetization event', () => {
      mockMonetization();
      initialize();
  
      const event: any = createCustomEvent(MonetizationEvents.START);
      (<any>document)["monetization"].dispatchEvent(event);
  
      expect(webMonetizer.state.getValue()).toBe('started');
    });
  
    it('should set state to `pending` on PENDING monetization event', () => {
      mockMonetization();
      initialize();
  
      const event: any = createCustomEvent(MonetizationEvents.PENDING);
      (<any>document)["monetization"].dispatchEvent(event);
  
      expect(webMonetizer.state.getValue()).toBe('pending');
    });
  
    it('should set state to `stopped` on STOP monetization event', () => {
      mockMonetization();
      initialize();
  
      const event: any = createCustomEvent(MonetizationEvents.STOP);
      (<any>document)["monetization"].dispatchEvent(event);
  
      expect(webMonetizer.state.getValue()).toBe('stopped');
    });
  
    it('should emit new payment object on PROGRESS monetization event', () => {
      mockMonetization();
      initialize();
  
      let payment;
  
      webMonetizer.newPayment.subscribe(_payment => payment = _payment);
  
      const detail = {
        paymentPointer: PAYMENT_POINTER,
        requestId: (<any>document)["monetization"]["_requestId"],
        amount: String(Math.floor(30000 + Math.random() * 100000)),
        assetCode: 'USD',
        assetScale: 9
      };
  
      const expectedPayment: IPayment = {
        amount: Number((Number(detail.amount) * Math.pow(10, -detail.assetScale)).toFixed(detail.assetScale)),
        currency: detail.assetCode,
        paymentPointer: PAYMENT_POINTER,
        requestId: (<any>document)["monetization"]._requestId
      };
  
      const event: any = createCustomEvent("monetizationprogress", { detail });
      (<any>document)["monetization"].dispatchEvent(event);
  
      expect(payment).toBeTruthy();
      expect(payment).toEqual(expectedPayment);
    });

    it('should output BROWSER_UNSUPPORTED_WARNING if `start` is called and monetization is unsupported', () => {
      initialize();
      spyOn(console, 'warn');
      webMonetizer.start();
  
      expect(console.warn).toHaveBeenCalledTimes(1);
      expect(console.warn).toHaveBeenCalledWith(BROWSER_UNSUPPORTED_WARNING);
    });

    it('should output BROWSER_UNSUPPORTED_WARNING if `stop` is called and monetization is unsupported', () => {
      initialize();
      spyOn(console, 'warn');
      webMonetizer.stop();
  
      expect(console.warn).toHaveBeenCalledTimes(1);
      expect(console.warn).toHaveBeenCalledWith(BROWSER_UNSUPPORTED_WARNING);
    });
});
