import {ApiRoot, QuoteDraft, QuoteUpdate} from '@commercetools/platform-sdk';
import {SDKError} from '../errors/sdkError';

// Read quote by ID
export const readQuoteById = async (
  apiRoot: ApiRoot,
  projectKey: string,
  id: string,
  expandArr?: string[],
  storeKey?: string
) => {
  try {
    let request;
    if (storeKey) {
      request = apiRoot
        .withProjectKey({projectKey})
        .inStoreKeyWithStoreKeyValue({storeKey})
        .quotes()
        .withId({ID: id})
        .get({
          queryArgs: {
            expand: expandArr,
          },
        });
    } else {
      request = apiRoot
        .withProjectKey({projectKey})
        .quotes()
        .withId({ID: id})
        .get({
          queryArgs: {
            expand: expandArr,
          },
        });
    }
    const quote = await request.execute();
    return quote.body;
  } catch (error: any) {
    throw new SDKError('Failed to read quote by ID', error);
  }
};

// Read quote by key
export const readQuoteByKey = async (
  apiRoot: ApiRoot,
  projectKey: string,
  key: string,
  expandArr?: string[],
  storeKey?: string
) => {
  try {
    let request;
    if (storeKey) {
      request = apiRoot
        .withProjectKey({projectKey})
        .inStoreKeyWithStoreKeyValue({storeKey})
        .quotes()
        .withKey({key})
        .get({
          queryArgs: {
            expand: expandArr,
          },
        });
    } else {
      request = apiRoot
        .withProjectKey({projectKey})
        .quotes()
        .withKey({key})
        .get({
          queryArgs: {
            expand: expandArr,
          },
        });
    }
    const quote = await request.execute();
    return quote.body;
  } catch (error: any) {
    throw new SDKError('Failed to read quote by key', error);
  }
};

// Query quotes
export const queryQuotes = async (
  apiRoot: ApiRoot,
  projectKey: string,
  queryArgs: any,
  storeKey?: string
) => {
  try {
    let request;
    if (storeKey) {
      request = apiRoot
        .withProjectKey({projectKey})
        .inStoreKeyWithStoreKeyValue({storeKey})
        .quotes()
        .get({queryArgs});
    } else {
      request = apiRoot.withProjectKey({projectKey}).quotes().get({queryArgs});
    }
    const quotes = await request.execute();
    return quotes.body;
  } catch (error: any) {
    throw new SDKError('Failed to query quotes', error);
  }
};

// Create quote
export const createQuote = async (
  apiRoot: ApiRoot,
  projectKey: string,
  quoteDraft: QuoteDraft,
  expandArr?: string[],
  storeKey?: string
) => {
  try {
    let request;
    if (storeKey) {
      request = apiRoot
        .withProjectKey({projectKey})
        .inStoreKeyWithStoreKeyValue({storeKey})
        .quotes()
        .post({
          body: quoteDraft,
          queryArgs: {
            expand: expandArr,
          },
        });
    } else {
      request = apiRoot
        .withProjectKey({projectKey})
        .quotes()
        .post({
          body: quoteDraft,
          queryArgs: {
            expand: expandArr,
          },
        });
    }
    const quote = await request.execute();
    return quote.body;
  } catch (error: any) {
    throw new SDKError('Failed to create quote', error);
  }
};

// Update quote by ID
export const updateQuoteById = async (
  apiRoot: ApiRoot,
  projectKey: string,
  id: string,
  updateData: QuoteUpdate,
  expandArr?: string[],
  storeKey?: string
) => {
  try {
    let request;
    if (storeKey) {
      request = apiRoot
        .withProjectKey({projectKey})
        .inStoreKeyWithStoreKeyValue({storeKey})
        .quotes()
        .withId({ID: id})
        .post({
          body: updateData,
          queryArgs: {
            expand: expandArr,
          },
        });
    } else {
      request = apiRoot
        .withProjectKey({projectKey})
        .quotes()
        .withId({ID: id})
        .post({
          body: updateData,
          queryArgs: {
            expand: expandArr,
          },
        });
    }
    const quote = await request.execute();
    return quote.body;
  } catch (error: any) {
    throw new SDKError('Failed to update quote by ID', error);
  }
};

// Update quote by key
export const updateQuoteByKey = async (
  apiRoot: ApiRoot,
  projectKey: string,
  key: string,
  updateData: QuoteUpdate,
  expandArr?: string[],
  storeKey?: string
) => {
  try {
    let request;
    if (storeKey) {
      request = apiRoot
        .withProjectKey({projectKey})
        .inStoreKeyWithStoreKeyValue({storeKey})
        .quotes()
        .withKey({key})
        .post({
          body: updateData,
          queryArgs: {
            expand: expandArr,
          },
        });
    } else {
      request = apiRoot
        .withProjectKey({projectKey})
        .quotes()
        .withKey({key})
        .post({
          body: updateData,
          queryArgs: {
            expand: expandArr,
          },
        });
    }
    const quote = await request.execute();
    return quote.body;
  } catch (error: any) {
    throw new SDKError('Failed to update quote by key', error);
  }
};

// Associate functions for business units
export const readQuoteByIdAsAssociate = async (
  apiRoot: ApiRoot,
  projectKey: string,
  associateId: string,
  businessUnitKey: string,
  id: string,
  expandArr?: string[]
) => {
  try {
    const request = apiRoot
      .withProjectKey({projectKey})
      .asAssociate()
      .withAssociateIdValue({associateId})
      .inBusinessUnitKeyWithBusinessUnitKeyValue({businessUnitKey})
      .quotes()
      .withId({ID: id})
      .get({
        queryArgs: {
          expand: expandArr,
        },
      });
    const quote = await request.execute();
    return quote.body;
  } catch (error: any) {
    throw new SDKError('Failed to read quote by ID as associate', error);
  }
};

export const readQuoteByKeyAsAssociate = async (
  apiRoot: ApiRoot,
  projectKey: string,
  associateId: string,
  businessUnitKey: string,
  key: string,
  expandArr?: string[]
) => {
  try {
    const request = apiRoot
      .withProjectKey({projectKey})
      .asAssociate()
      .withAssociateIdValue({associateId})
      .inBusinessUnitKeyWithBusinessUnitKeyValue({businessUnitKey})
      .quotes()
      .withKey({key})
      .get({
        queryArgs: {
          expand: expandArr,
        },
      });
    const quote = await request.execute();
    return quote.body;
  } catch (error: any) {
    throw new SDKError('Failed to read quote by key as associate', error);
  }
};

export const queryQuotesAsAssociate = async (
  apiRoot: ApiRoot,
  projectKey: string,
  associateId: string,
  businessUnitKey: string,
  queryArgs: any
) => {
  try {
    const request = apiRoot
      .withProjectKey({projectKey})
      .asAssociate()
      .withAssociateIdValue({associateId})
      .inBusinessUnitKeyWithBusinessUnitKeyValue({businessUnitKey})
      .quotes()
      .get({queryArgs});
    const quotes = await request.execute();
    return quotes.body;
  } catch (error: any) {
    throw new SDKError('Failed to query quotes as associate', error);
  }
};

export const updateQuoteByIdAsAssociate = async (
  apiRoot: ApiRoot,
  projectKey: string,
  associateId: string,
  businessUnitKey: string,
  id: string,
  updateData: QuoteUpdate,
  expandArr?: string[]
) => {
  try {
    const request = apiRoot
      .withProjectKey({projectKey})
      .asAssociate()
      .withAssociateIdValue({associateId})
      .inBusinessUnitKeyWithBusinessUnitKeyValue({businessUnitKey})
      .quotes()
      .withId({ID: id})
      .post({
        body: updateData,
        queryArgs: {
          expand: expandArr,
        },
      });
    const quote = await request.execute();
    return quote.body;
  } catch (error: any) {
    throw new SDKError('Failed to update quote by ID as associate', error);
  }
};

export const updateQuoteByKeyAsAssociate = async (
  apiRoot: ApiRoot,
  projectKey: string,
  associateId: string,
  businessUnitKey: string,
  key: string,
  updateData: QuoteUpdate,
  expandArr?: string[]
) => {
  try {
    const request = apiRoot
      .withProjectKey({projectKey})
      .asAssociate()
      .withAssociateIdValue({associateId})
      .inBusinessUnitKeyWithBusinessUnitKeyValue({businessUnitKey})
      .quotes()
      .withKey({key})
      .post({
        body: updateData,
        queryArgs: {
          expand: expandArr,
        },
      });
    const quote = await request.execute();
    return quote.body;
  } catch (error: any) {
    throw new SDKError('Failed to update quote by key as associate', error);
  }
};
