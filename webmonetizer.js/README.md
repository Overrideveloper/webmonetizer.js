# Webmonetizer-js
A Web Monetization library.

```
npm install webmonetizer-js
```

# What is Web Monetization?
Web Monetization is a proposed API standard that allows websites to request a stream of very small payments from a user. Read more on Web Monetization [here](https://webmonetization.org/docs/explainer).

# What is Webmonetizer-js?
`Webmonetizer-js` is a library that provides a quick and easy way to add Web Monetization to your web apps.

# Quickstart
Add Web Monetization to your first application by following [the quickstart guide](docs/quickstart.md).

# Example use:
```jsx
import React, { Component } from 'react';
import { WebMonetizer } from 'webmonetizer-js'

const webMonetizer = new WebMonetizer("PAYMENT_POINTER");

class App extends Component {
    constructor(props) {
        super(props);

        this.state = {
            monetizationState: null,
            total: null,
            currency: null,
            payments: [],
        }
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

    startStreamingPayments() {
        webMonetizer.start();
    }

    stopStreamingPayments() {
        webMonetizer.stop();
    }

    render() {
        const { monetizationState, currency, total, payments } = this.state;

        return (
            <div>
                <div>
                    <h4>Monetization State => {monetizationState}</h4>
                    <h4>Total => {currency} {total}</h4>

                    <div>
                        <button onClick={() => this.startStreamingPayments()}>Start</button>
                        <button onClick={() => this.stopStreamingPayments()}>End</button>
                    </div>

                    <h3>Payments</h3>
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
```

You can also use `webmonetizer-js` in a Typescript codebase:

```tsx
import * as React from 'react';
import { WebMonetizer, WebMonetizerState, IWebMonetizerPayment } from 'webmonetizer-js';

interface IState {
    monetizationState: WebMonetizerState | null;
    total: number;
    currency: string | null;
    payments: IWebMonetizerPayment[]
}

const webMonetizer = new WebMonetizer("PAYMENT_POINTER");

class App extends React.Component<{}, IState> {
    constructor(props: any) {
        super(props);

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

    startStreamingPayments() {
        webMonetizer.start();
    }

    stopStreamingPayments() {
        webMonetizer.stop();
    }

    render() {
        const { monetizationState, currency, total, payments } = this.state;

        return (
            <div>
                <h4>Monetization State => {monetizationState}</h4>
                <h4>Total => {currency} {total}</h4>

                <div>
                    <button onClick={() => this.startStreamingPayments()}>Start</button>
                    <button onClick={() => this.stopStreamingPayments()}>End</button>
                </div>

                <h3>Payments</h3>
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
        )
    }
}

export default App;
```

`webmonetizer-js` can also be used in Vanilla JS:

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <script src="https://unpkg.com/webmonetizer-js"></script>
</head>
<body>
    <div>
        <h6>Monetization State => <span id="monetization-state"></span></h6>
        <h6>Total => <span id="currency"></span> <span id="total"></span></h6>

        <button id="start">Start</button>
        <button id="stop">Stop</button>
      
        <h6>Payments</h6>
        <ol id="payments"></ol>
    </div>

    <script>
        let isCurrencySet = false;
        let total = 0;

        const monetizer = new WebMonetizerJS.WebMonetizer("POINTER");
        const paymentsList = document.getElementById('payments');

        monetizer.state.subscribe(state => document.getElementById('monetization-state').innerHTML = state);

        monetizer.newPayment.subscribe(payment => {
            total += payment.amount;

            const paymentInnerHTMl = `<ul>
                <li>Amount: ${payment.currency } ${ payment.amount }</li>
                <li>Request ID: ${ payment.requestId }</li>
                <li>Payment Pointer: ${ payment.paymentPointer }</li>
            </ul>`;

            const paymentEl = document.createElement('li');
            paymentEl.innerHTML = paymentInnerHTMl;

            paymentsList.appendChild(paymentEl);

            document.getElementById('total').innerHTML = total;
            
            if (!isCurrencySet) {
                document.getElementById('currency').innerHTML = payment.currency;
                isCurrencySet = true;
            }
        });

        document.getElementById('start').addEventListener('click', () => monetizer.start());
        document.getElementById('stop').addEventListener('click', () => monetizer.stop());
    </script>
</body>
</html>
```

# Resources
[ES6 Demo]("https://codesandbox.io/s/webmonetizer-js-es6-demo-tycpu")

[Typescript Demo]("https://codesandbox.io/s/webmonetizer-js-typescript-demo-i6jtu")

[Vanilla JS Demo]("https://codesandbox.io/s/webmonetizer-js-vanilla-js-demo-k2cpq")
