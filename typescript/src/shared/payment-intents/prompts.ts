export const updatePaymentIntentPrompt = `
Manage payment intents from the commercetools Checkout platform. You can capture, refund, reverse, or cancel an authorized Payment.

Parameters:
- paymentId: The ID of the payment to manage (string, required)
- actions: Array of actions to execute (array, required, min: 1, max: 1)

Available actions:
- capturePayment: Captures the given Payment amount
  - amount: Amount to be captured with centAmount and currencyCode (object, required)
  - merchantReference: A merchant-defined identifier for tracking (string, optional)
- refundPayment: Refunds the given Payment amount
  - amount: Amount to be refunded with centAmount and currencyCode (object, required)
  - transactionId: The identifier of the capture transaction (string, optional)
  - merchantReference: A merchant-defined identifier for tracking (string, optional)
- cancelPayment: Cancels an authorized Payment
  - merchantReference: A merchant-defined identifier for tracking (string, optional)
- reversePayment: Reverses a Payment
  - merchantReference: A merchant-defined identifier for tracking (string, optional)

Examples:
// Capture payment
paymentIntent.update({
  paymentId: "payment-123",
  actions: [
    {
      action: "capturePayment",
      amount: {
        centAmount: 10000,
        currencyCode: "EUR"
      },
      merchantReference: "invoice-123"
    }
  ]
})

// Refund payment
paymentIntent.update({
  paymentId: "payment-123",
  actions: [
    {
      action: "refundPayment",
      amount: {
        centAmount: 5000,
        currencyCode: "EUR"
      },
      transactionId: "transaction-123",
      merchantReference: "refund-123"
    }
  ]
})

// Cancel payment
paymentIntent.update({
  paymentId: "payment-123",
  actions: [
    {
      action: "cancelPayment",
      merchantReference: "cancel-123"
    }
  ]
})

// Reverse payment
paymentIntent.update({
  paymentId: "payment-123",
  actions: [
    {
      action: "reversePayment",
      merchantReference: "reverse-123"
    }
  ]
})
`;
