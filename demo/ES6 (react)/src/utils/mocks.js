import { MonetizationEvents } from '../../../../webmonetizer.js/dist'

// Mock Monetization Progress
function MOCK_PROGRESS(detail) {
    const event = new CustomEvent("monetizationprogress", { detail });
    document["monetization"].dispatchEvent(event);
}

// Mock Monetization Stop
export function MOCK_STOP() {
    const event = new CustomEvent(MonetizationEvents.STOP);
    document["monetization"].dispatchEvent(event);
}

// Mock Monetization Pending
export function MOCK_PENDING() {
    const event = new CustomEvent(MonetizationEvents.PENDING);
    document["monetization"].dispatchEvent(event);
}

// Mock Monetization Start
export function MOCK_START() {
    document["monetization"]._requestId = "fc23b14d-70e4-4d55-b0a0-dd86f70ce402";

    const event = new CustomEvent(MonetizationEvents.START);
    document["monetization"].dispatchEvent(event);
}

export function MOCK_PAYMENT() {
    const detail = {
        paymentPointer: "PAYMENT_POINTER",
        requestId: document.monetization._requestId,
        amount: String(Math.floor(30000 + Math.random() * 100000)),
        assetCode: "USD",
        assetScale: 9
    };

    MOCK_PROGRESS(detail);
}

// Mock Monetization
export function MOCK_MONETIZATION() {
    document["monetization"] = document.createDocumentFragment();
    document["monetization"]["state"] = "stopped";

    document["monetization"].addEventListener('monetizationstart', () => document["monetization"]["state"] = "started");
    document["monetization"].addEventListener('monetizationpending', () => document["monetization"]["state"] = "pending");
    document["monetization"].addEventListener('monetizationstop', () => document["monetization"]["state"] = "stopped");
}
    