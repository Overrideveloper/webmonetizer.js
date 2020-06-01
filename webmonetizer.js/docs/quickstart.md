# `webmonetizer-js` Quickstart

### 1. Create a new project
Create a new project in your framework of choice. This quickstart uses React.

### 2. Install `webmonetizer-js`
`npm install webmonetizer-js`

Now that you have your project set up, install `webmonetizer-js` from npm.

### 3. Import and instantiate the `WebMonetizer` class passing your unique payment URL
In `App.js`:

```jsx
    ...
    import { WebMonetizer } from 'webmonetizer-js'

    const webMonetizer = new WebMonetizer("PAYMENT_POINTER");
    ...
```

### 4. Bind the Monetization State to a state property
In `App.js`:
```jsx
import React, { Component } from 'react';
import { WebMonetizer } from 'webmonetizer-js'

const webMonetizer = new WebMonetizer("PAYMENT_POINTER");

class App extends Component {
    constructor(props) {
        super(props);

        this.state = {
            monetizationState: null
        }
    }

    componentDidMount() {
        webMonetizer.state.subscribe(state => this.setState({ monetizationState: state }));
    }

    render() {
        const { monetizationState } = this.state;

        return (
            <div>
                <h4>Monetization State => {monetizationState}</h4>
            </div>
        )
    }
```

`webMonetizer.state` emits the current monetization state.

There are 4 monetization states:
- **unsupported**: The browser does not support Web Monetization.
- **pending**: `webmonetizer-js` is trying to send payments but is yet to send the first non-zero micropayment.
- **started**: `webmonetizer-js` is currently sending micropayments.
- **stopped**: `webmonetizer-js` can send payments but is not currently sending micropayments nor trying to.
<br/> This is the default monetization state (if the browser supports Web Monetization).

### 5. Store micropayment information in a list
In `App.js`:
```jsx
import React, { Component } from 'react';
import { WebMonetizer } from 'webmonetizer-js'

const webMonetizer = new WebMonetizer("PAYMENT_POINTER");

class App extends Component {
    constructor(props) {
        super(props);

        this.state = {
            monetizationState: null,
            payments: []
        }
    }

    componentDidMount() {
        webMonetizer.state.subscribe(state => this.setState({ monetizationState: state }));

        webMonetizer.newPayment.subscribe(payment => {
            this.setState({ payments: [...this.state.payments, payment] });
        });
    }

    render() {
        const { monetizationState, payments } = this.state;

        return (
            <div>
                <h4>Monetization State => {monetizationState}</h4>

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
```

`webMonetizer.newPayment` emits micropayments as they are streamed.

The attributes of a micropayment are:
- **currency**: A three-letter code that describes the currency of the micropayment, like `USD`, `EUR` or `XRP`.
<br/> This is usually the same for all micropayments made to the same payment pointer.

- **amount**: The value of the micropayment.
- **requestId**: A unique session ID for the payment session.
- **paymentPointer**: Your unique payment account URL.

### 6. Start sending payments
In `App.js`:
```jsx
import React, { Component } from 'react';
import { WebMonetizer } from 'webmonetizer-js'

const webMonetizer = new WebMonetizer("PAYMENT_POINTER");

class App extends Component {
    constructor(props) {
        super(props);

        this.state = {
            monetizationState: null,
            payments: []
        }
    }

    componentDidMount() {
        webMonetizer.state.subscribe(state => this.setState({ monetizationState: state }));

        webMonetizer.newPayment.subscribe(payment => {
            this.setState({ payments: [...this.state.payments, payment] });
        });
    }

    startStreamingPayments() {
        webMonetizer.start();
    }

    render() {
        const { monetizationState, payments } = this.state;

        return (
            <div>
                <h4>Monetization State => {monetizationState}</h4>
                
                <div>
                    <button onClick={() => this.startStreamingPayments()}>Start</button>
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
```

When `webMonetizer.start` is called, the browser resolves a unique receiving address and begins sending payments or tries to. The monetization state is also set to `started`.

### 7. Stop sending payments
In `App.js`:
```jsx
import React, { Component } from 'react';
import { WebMonetizer } from 'webmonetizer-js'

const webMonetizer = new WebMonetizer("PAYMENT_POINTER");

class App extends Component {
    constructor(props) {
        super(props);

        this.state = {
            monetizationState: null,
            payments: []
        }
    }

    componentDidMount() {
        webMonetizer.state.subscribe(state => this.setState({ monetizationState: state }));

        webMonetizer.newPayment.subscribe(payment => {
            this.setState({ payments: [...this.state.payments, payment] });
        });
    }

    startStreamingPayments() {
        webMonetizer.start();
    }

    stopStreamingPayments() {
        webMonetizer.stop();
    }

    render() {
        const { monetizationState, payments } = this.state;

        return (
            <div>
                <h4>Monetization State => {monetizationState}</h4>
                
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
```

When `webMonetizer.stop` is called, the browser stops streaming payments or trying to. The monetization state is also set to `stopped`.

### 8. Display payment total counter
In `App.js`:
```jsx
import React, { Component } from 'react';
import { WebMonetizer } from 'webmonetizer-js'

const webMonetizer = new WebMonetizer("PAYMENT_POINTER");

class App extends Component {
    constructor(props) {
        super(props);

        this.state = {
            monetizationState: null,
            payments: [],
            total: null,
            currency: null
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
        const { monetizationState, payments, currency, total } = this.state;

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
```

Now, you can run your app locally. Note that web monetization has to be supported by your browser and you need to have a valid unique payment URL.

You can check out examples for using `webmonetizer-js` in [typescript and vanilla js](../README.md#example-use) codebases.
