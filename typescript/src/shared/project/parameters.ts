import {z} from 'zod';

export const readProjectParameters = z.object({
  projectKey: z
    .string()
    .optional()
    .describe(
      'The key of the project to read. If not provided, the current project will be used.'
    ),
});

const messagesConfigurationDraftSchema = z.object({
  enabled: z
    .boolean()
    .describe('When true, the Messages Query feature is active.'),
  deleteDaysAfterCreation: z
    .number()
    .min(1)
    .max(90)
    .optional()
    .describe(
      'Specifies the number of days each Message should be available via the Messages Query API.'
    ),
});

const cartsConfigurationSchema = z.object({
  deleteDaysAfterLastModification: z
    .number()
    .min(1)
    .optional()
    .describe(
      'Default value for the deleteDaysAfterLastModification parameter of CartDraft and MyCartDraft.'
    ),
  countryTaxRateFallbackEnabled: z
    .boolean()
    .optional()
    .describe(
      'Indicates if country - no state Tax Rate fallback should be used.'
    ),
});

const shoppingListsConfigurationSchema = z.object({
  deleteDaysAfterLastModification: z
    .number()
    .min(1)
    .optional()
    .describe(
      'Default value for the deleteDaysAfterLastModification parameter of ShoppingListDraft.'
    ),
});

const customFieldLocalizedEnumValueSchema = z.object({
  key: z.string().describe('The key of the enum value.'),
  label: z
    .record(z.string())
    .describe('The localized labels for the enum value.'),
});

const shippingRateInputTypeSchema = z.discriminatedUnion('type', [
  z.object({
    type: z.literal('CartValue'),
  }),
  z.object({
    type: z.literal('CartClassification'),
    values: z
      .array(customFieldLocalizedEnumValueSchema)
      .describe('The classification items for ShippingRatePriceTier.'),
  }),
  z.object({
    type: z.literal('CartScore'),
    score: z
      .record(z.number())
      .describe('The score mapping for available shipping rate tiers.'),
  }),
]);

const externalOAuthSchema = z.object({
  url: z
    .string()
    .url()
    .describe('The URL of the token introspection endpoint.'),
  authorizationHeader: z
    .string()
    .describe(
      'The authorization header to authenticate against the introspection endpoint.'
    ),
});

const customerSearchStatusSchema = z.enum(['Activated', 'Deactivated']);
const businessUnitSearchStatusSchema = z.enum(['Activated', 'Deactivated']);
const orderSearchStatusSchema = z.enum(['Activated', 'Deactivated']);
const productSearchIndexingModeSchema = z.enum([
  'ProductProjectionsSearch',
  'ProductsSearch',
]);
const businessUnitConfigurationStatusSchema = z.enum([
  'Active',
  'Inactive',
  'Verification',
]);

const associateRoleResourceIdentifierSchema = z.object({
  typeId: z.literal('associate-role'),
  id: z.string().optional().describe('The ID of the associate role.'),
  key: z.string().optional().describe('The key of the associate role.'),
});

// Define action schemas based on the documentation
const changeNameSchema = z.object({
  action: z.literal('changeName'),
  name: z.string().describe('New value to set.'),
});

const changeCountriesSchema = z.object({
  action: z.literal('changeCountries'),
  countries: z
    .array(z.string())
    .describe('New value to set. Must not be empty.'),
});

const changeCurrenciesSchema = z.object({
  action: z.literal('changeCurrencies'),
  currencies: z
    .array(z.string())
    .describe('New value to set. Must not be empty.'),
});

const changeLanguagesSchema = z.object({
  action: z.literal('changeLanguages'),
  languages: z
    .array(z.string())
    .describe('New value to set. Must not be empty.'),
});

const changeMessagesConfigurationSchema = z.object({
  action: z.literal('changeMessagesConfiguration'),
  messagesConfiguration: messagesConfigurationDraftSchema.describe(
    'Configuration for the Messages Query feature.'
  ),
});

const changeCartsConfigurationSchema = z.object({
  action: z.literal('changeCartsConfiguration'),
  cartsConfiguration: cartsConfigurationSchema.describe(
    'Configuration for the Carts feature.'
  ),
});

const changeCountryTaxRateFallbackEnabledSchema = z.object({
  action: z.literal('changeCountryTaxRateFallbackEnabled'),
  countryTaxRateFallbackEnabled: z
    .boolean()
    .describe('When true, country - no state Tax Rate is used as fallback.'),
});

const changeShoppingListsConfigurationSchema = z.object({
  action: z.literal('changeShoppingListsConfiguration'),
  shoppingListsConfiguration: shoppingListsConfigurationSchema.describe(
    'Configuration for the Shopping Lists feature.'
  ),
});

const changeMyBusinessUnitStatusOnCreationSchema = z.object({
  action: z.literal('changeMyBusinessUnitStatusOnCreation'),
  status: businessUnitConfigurationStatusSchema.describe(
    'Status for Business Units created using the My Business Unit endpoint.'
  ),
});

const setMyBusinessUnitAssociateRoleOnCreationSchema = z.object({
  action: z.literal('setMyBusinessUnitAssociateRoleOnCreation'),
  associateRole: associateRoleResourceIdentifierSchema.describe(
    'Default Associate Role assigned to the Associate creating a Business Unit.'
  ),
});

const setShippingRateInputTypeSchema = z.object({
  action: z.literal('setShippingRateInputType'),
  shippingRateInputType: shippingRateInputTypeSchema
    .optional()
    .describe('Value to set. If empty, any existing value will be removed.'),
});

const setExternalOAuthSchema = z.object({
  action: z.literal('setExternalOAuth'),
  externalOAuth: externalOAuthSchema
    .optional()
    .describe('Value to set. If empty, any existing value will be removed.'),
});

const changeProductSearchIndexingEnabledSchema = z.object({
  action: z.literal('changeProductSearchIndexingEnabled'),
  enabled: z
    .boolean()
    .describe('If false, the indexing of Product information will stop.'),
  mode: productSearchIndexingModeSchema
    .optional()
    .describe(
      'Controls whether the action should apply to Product Projection Search or to Product Search.'
    ),
});

const changeOrderSearchStatusSchema = z.object({
  action: z.literal('changeOrderSearchStatus'),
  status: orderSearchStatusSchema.describe(
    'Activates or deactivates the Order Search feature.'
  ),
});

const changeCustomerSearchStatusSchema = z.object({
  action: z.literal('changeCustomerSearchStatus'),
  status: customerSearchStatusSchema.describe(
    'Activates or deactivates the Customer Search feature.'
  ),
});

const changeBusinessUnitSearchStatusSchema = z.object({
  action: z.literal('changeBusinessUnitSearchStatus'),
  status: businessUnitSearchStatusSchema.describe(
    'Activates or deactivates the Search Business Units feature.'
  ),
});

// Union of all possible update actions
const updateActionSchema = z.discriminatedUnion('action', [
  changeNameSchema,
  changeCountriesSchema,
  changeCurrenciesSchema,
  changeLanguagesSchema,
  changeMessagesConfigurationSchema,
  changeCartsConfigurationSchema,
  changeCountryTaxRateFallbackEnabledSchema,
  changeShoppingListsConfigurationSchema,
  changeMyBusinessUnitStatusOnCreationSchema,
  setMyBusinessUnitAssociateRoleOnCreationSchema,
  setShippingRateInputTypeSchema,
  setExternalOAuthSchema,
  changeProductSearchIndexingEnabledSchema,
  changeOrderSearchStatusSchema,
  changeCustomerSearchStatusSchema,
  changeBusinessUnitSearchStatusSchema,
]);

export const updateProjectParameters = z.object({
  version: z
    .number()
    .optional()
    .describe(
      'The current version of the project. If not provided, the current version will be fetched automatically.'
    ),
  actions: z
    .array(updateActionSchema)
    .describe('The list of update actions to apply to the project.'),
  projectKey: z
    .string()
    .optional()
    .describe(
      'The key of the project to update. If not provided, the current project will be used.'
    ),
});
