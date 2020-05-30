let paymentSimulator;
let isCurrencySet = false;
let total = 0;

const paymentsList = document.getElementById('payments');

const monetizer = new WebMonetizerJS.WebMonetizer("POINTER");
const MonetizationEvents = WebMonetizerJS.MonetizationEvents;

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

// Mock Monetization Progress
function MOCK_PROGRESS(detail) {
    const event = new CustomEvent("monetizationprogress", { detail });
    document["monetization"].dispatchEvent(event);
}

// Mock Monetization Stop
function MOCK_STOP() {
    const event = new CustomEvent(MonetizationEvents.STOP);
    document["monetization"].dispatchEvent(event);
}

// Mock Monetization Pending
function MOCK_PENDING() {
    const event = new CustomEvent(MonetizationEvents.PENDING);
    document["monetization"].dispatchEvent(event);
}

// Mock Monetization Start
function MOCK_START() {
    document["monetization"]._requestId = "fc23b14d-70e4-4d55-b0a0-dd86f70ce402";

    const event = new CustomEvent(MonetizationEvents.START);
    document["monetization"].dispatchEvent(event);
}

function MOCK_PAYMENT() {
    const detail = {
        paymentPointer: "PAYMENT_POINTER",
        requestId: document.monetization._requestId,
        amount: String(Math.floor(30000 + Math.random() * 100000)),
        assetCode: "USD",
        assetScale: 9
    };

    MOCK_PROGRESS(detail);
}

function startStreamingPayments() {
    monetizer.start();
    MOCK_PENDING();

    setTimeout(() => {
        MOCK_START();
        paymentSimulator = setInterval(() => MOCK_PAYMENT(), 1000);
    }, 1500);
}

function stopStreamingPayments() {
    monetizer.stop();
    clearInterval(paymentSimulator);
    MOCK_STOP();
}

document.getElementById('start').addEventListener('click', event => {
    event.srcElement.disabled = true;
    document.getElementById('stop').disabled = false;
    startStreamingPayments();
});

document.getElementById('stop').addEventListener('click', event => {
    event.srcElement.disabled = true;
    document.getElementById('start').disabled = false;
    stopStreamingPayments()
});
    