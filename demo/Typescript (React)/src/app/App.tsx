import * as React from 'react';
import * as mocks from '../mocks';
import { IState } from '../types'
import { WebMonetizer } from '../../../../webmonetizer.js/dist';
import './App.css';

mocks.MOCK_MONETIZATION();

let paymentSimulator;
const webMonetizer = new WebMonetizer("PAYMENT_POINTER");

class App extends React.Component<any, IState> {
    constructor() {
        super({});

        this.state = {
            monetizationState: null,
            total: 0,
            currency: null,
            payments: []
        };
    }

    componentDidMount() {
        webMonetizer.state.subscribe(state => this.setState({ monetizationState: state }));
        webMonetizer.newPayment.subscribe(payment => {
            this.setState({ total: this.state.total + payment.amount, payments: [...this.state.payments, payment] });

            if (!this.state.currency) {
                this.setState({ currency: payment.currency });
            }
        });
    }

    startStreamingPayments(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
        webMonetizer.start();
        mocks.MOCK_PENDING();

        setTimeout(() => {
            mocks.MOCK_START();
            paymentSimulator = setInterval(() => mocks.MOCK_PAYMENT(), 1000);
        }, 1500);

        (e.target as HTMLButtonElement).disabled = true;
        (document.getElementById('end-btn') as HTMLButtonElement).disabled = false;
    }

    stopStreamingPayments(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
        webMonetizer.stop();
        clearInterval(paymentSimulator);
        mocks.MOCK_STOP();

        (e.target as HTMLButtonElement).disabled = true;
        (document.getElementById('start-btn') as HTMLButtonElement).disabled = false;
    }


    render() {
        const { monetizationState, currency, total, payments } = this.state;
        const btnsDisabled = monetizationState === 'unsupported';

        return (
            <div>
                <div className="app">
                    <header className="app-header">
                        Webmonetizer.js Demo
                    </header>
                </div>

                <div style={{ textAlign: 'center', margin: '2rem auto' }}>
                    <h4>Monetization State => {monetizationState}</h4>
                    <h4>Total => {currency} {total}</h4>

                    <div style={{margin: '1rem auto'}}>
                        <button id="start-btn" disabled={btnsDisabled} style={{ margin: 'auto 4px'}} onClick={($event) => this.startStreamingPayments($event)}>Start</button>
                        <button id="end-btn" disabled={btnsDisabled} style={{ margin: 'auto 4px'}} onClick={($event) => this.stopStreamingPayments($event)}>End</button>
                    </div>

                    <h3 style={{ margin: '1rem auto'}}>Payments</h3>
                    <ol>
                        { payments.map((payment, index) => {
                            return (<li key={index}>
                                <ul>
                                    <li>Amount: {payment.currency } { payment.amount }</li>
                                    <li>Request ID: { payment.requestId }</li>
                                    <li>Payment Pointer: { payment.paymentPointer }</li>
                                </ul>
                            </li>)
                        })}
                    </ol>
                </div>
            </div>
        )
    }
}

export default App;