export const readPaymentMethodPrompt = `Read payment methods from commercetools. You can:
- Get a single payment method by providing either its ID or key
- List multiple payment methods with optional filtering, sorting, and pagination

Parameters:
- id: The ID of a specific payment method to retrieve (optional)
- key: The key of a specific payment method to retrieve (optional)
- limit: Number of results requested when listing (default: 10, max: 500)
- offset: Number of elements to skip when listing (default: 0, max: 10000)
- sort: Sort criteria for listing results (e.g., ["createdAt desc"])
- where: Query predicates for filtering when listing (e.g., ["name.en='Credit Card'"])
- expand: Reference paths to expand (e.g., ["custom.type"])

Examples:
// Get by ID
paymentMethods.read({
  id: "payment-method-id-123"
})

// Get by key
paymentMethods.read({
  key: "credit-card"
})

// List with filtering
paymentMethods.read({
  limit: 10,
  where: ["name.en='Credit Card'"]
})`;

export const createPaymentMethodPrompt = `Create a new payment method in commercetools.

Parameters:
- key: User-defined unique identifier (optional)
- name: Localized name of the payment method (required)
- description: Localized description of the payment method (optional)
- paymentInterface: Payment interface identifier (e.g., "Adyen", "Stripe") (optional)
- method: Payment method type (e.g., "Card", "PayPal", "BankTransfer") (optional)
- interfaceAccount: Interface account identifier for the payment provider (optional)
- default: Whether this is the default payment method (optional)
- paymentMethodStatus: Status of the payment method ("Active" or "Inactive") (optional)
- customer: Reference to the customer who owns this payment method (optional)
- businessUnit: Reference to the business unit that owns this payment method (optional)
- custom: Custom fields for the payment method (optional)

Example:
paymentMethods.create({
  key: "credit-card",
  name: {
    en: "Credit Card",
    de: "Kreditkarte"
  },
  description: {
    en: "Credit card payment method",
    de: "Kreditkarten-Zahlungsmethode"
  },
  paymentInterface: "stripe",
  method: "Card",
  interfaceAccount: "stripe-merchant-eu",
  default: true,
  paymentMethodStatus: "Active",
  customer: {
    id: "customer-123",
    typeId: "customer"
  },
  businessUnit: {
    id: "business-unit-456",
    typeId: "business-unit"
  }
})`;

export const updatePaymentMethodPrompt = `Update or delete a payment method in commercetools. You must identify the method using either ID or key.

Parameters:
- id: The ID of the payment method to update/delete (optional if key is provided)
- key: The key of the payment method to update/delete (optional if id is provided)
- version: Expected version of the payment method (required)
- actions: Array of update actions (required)

Available update actions:
- setKey: Set or change the key of the payment method
- setName: Set or change the localized name
- setDescription: Set or remove the localized description
- setPaymentInterface: Set or change the payment interface
- setMethod: Set or change the payment method type
- setInterfaceAccount: Set or change the interface account
- setDefault: Set or change the default status
- setPaymentMethodStatus: Set or change the payment method status ("Active" or "Inactive")
- setCustomer: Set or change the customer reference
- setBusinessUnit: Set or change the business unit reference
- setCustomType: Set or remove custom type and fields
- setCustomField: Set or remove a custom field
- delete: Delete the payment method

Examples:
// Update name and status
paymentMethods.update({
  id: "payment-method-id-123",
  version: 1,
  actions: [
    {
      action: "setName",
      name: {
        en: "Updated Payment Method",
        de: "Aktualisierte Zahlungsmethode"
      }
    },
    {
      action: "setPaymentMethodStatus",
      paymentMethodStatus: "Inactive"
    }
  ]
})

// Update interface and set as default
paymentMethods.update({
  key: "credit-card",
  version: 1,
  actions: [
    {
      action: "setPaymentInterface",
      paymentInterface: "adyen"
    },
    {
      action: "setDefault",
      default: true
    }
  ]
})

// Delete payment method
paymentMethods.update({
  id: "payment-method-id-123",
  version: 1,
  actions: [
    {
      action: "delete"
    }
  ]
})`;
