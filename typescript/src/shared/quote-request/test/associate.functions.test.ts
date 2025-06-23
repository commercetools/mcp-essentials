import {
  readQuoteRequest,
  createQuoteRequest,
  updateQuoteRequest,
} from '../associate.functions';
import {
  readQuoteRequestParameters,
  createQuoteRequestParameters,
  updateQuoteRequestParameters,
} from '../parameters';
import {z} from 'zod';

// Mock API Root
const mockExecute = jest.fn();
const mockGet = jest.fn().mockReturnValue({execute: mockExecute});
const mockPost = jest.fn().mockReturnValue({execute: mockExecute});
const mockWithId = jest.fn().mockReturnValue({get: mockGet, post: mockPost});
const mockWithKey = jest.fn().mockReturnValue({get: mockGet, post: mockPost});
const mockQuoteRequests = jest.fn().mockReturnValue({
  get: mockGet,
  post: mockPost,
  withId: mockWithId,
  withKey: mockWithKey,
});
const mockInBusinessUnitKeyWithBusinessUnitKeyValue = jest
  .fn()
  .mockReturnValue({
    quoteRequests: mockQuoteRequests,
  });
const mockWithAssociateIdValue = jest.fn().mockReturnValue({
  inBusinessUnitKeyWithBusinessUnitKeyValue:
    mockInBusinessUnitKeyWithBusinessUnitKeyValue,
});
const mockAsAssociate = jest.fn().mockReturnValue({
  withAssociateIdValue: mockWithAssociateIdValue,
});
const mockWithProjectKey = jest.fn().mockReturnValue({
  asAssociate: mockAsAssociate,
});
const mockApiRoot = {
  withProjectKey: mockWithProjectKey,
};

const context = {
  projectKey: 'test-project',
  customerId: 'associate-id',
  businessUnitKey: 'business-unit-key',
};

describe('Associate Quote Request Functions', () => {
  beforeEach(() => {
    jest.clearAllMocks();

    // Set up default successful response
    mockExecute.mockResolvedValue({body: {id: 'mocked-quote-request-id'}});

    // Set up proper chaining
    mockGet.mockReturnValue({execute: mockExecute});
    mockPost.mockReturnValue({execute: mockExecute});
    mockWithId.mockReturnValue({get: mockGet, post: mockPost});
    mockWithKey.mockReturnValue({get: mockGet, post: mockPost});
    mockQuoteRequests.mockReturnValue({
      get: mockGet,
      post: mockPost,
      withId: mockWithId,
      withKey: mockWithKey,
    });
    mockInBusinessUnitKeyWithBusinessUnitKeyValue.mockReturnValue({
      quoteRequests: mockQuoteRequests,
    });
    mockWithAssociateIdValue.mockReturnValue({
      inBusinessUnitKeyWithBusinessUnitKeyValue:
        mockInBusinessUnitKeyWithBusinessUnitKeyValue,
    });
    mockAsAssociate.mockReturnValue({
      withAssociateIdValue: mockWithAssociateIdValue,
    });
    mockWithProjectKey.mockReturnValue({
      asAssociate: mockAsAssociate,
    });
  });

  describe('readQuoteRequest', () => {
    it('should read a quote request by ID as associate', async () => {
      const params = {id: 'quote-request-id'} as z.infer<
        typeof readQuoteRequestParameters
      >;

      const mockResult = {id: 'quote-request-id', version: 1};
      mockExecute.mockResolvedValueOnce({body: mockResult});

      const result = await readQuoteRequest(
        mockApiRoot as any,
        context,
        params
      );

      expect(result).toEqual(mockResult);
      expect(mockWithProjectKey).toHaveBeenCalledWith({
        projectKey: 'test-project',
      });
      expect(mockAsAssociate).toHaveBeenCalled();
      expect(mockWithAssociateIdValue).toHaveBeenCalledWith({
        associateId: 'associate-id',
      });
      expect(
        mockInBusinessUnitKeyWithBusinessUnitKeyValue
      ).toHaveBeenCalledWith({
        businessUnitKey: 'business-unit-key',
      });
      expect(mockQuoteRequests).toHaveBeenCalled();
      expect(mockWithId).toHaveBeenCalledWith({ID: 'quote-request-id'});
      expect(mockGet).toHaveBeenCalledWith({queryArgs: {}});
    });

    it('should read a quote request by key as associate', async () => {
      const params = {key: 'quote-request-key'} as z.infer<
        typeof readQuoteRequestParameters
      >;

      const mockResult = {key: 'quote-request-key', version: 1};
      mockExecute.mockResolvedValueOnce({body: mockResult});

      const result = await readQuoteRequest(
        mockApiRoot as any,
        context,
        params
      );

      expect(result).toEqual(mockResult);
      expect(mockWithKey).toHaveBeenCalledWith({key: 'quote-request-key'});
      expect(mockGet).toHaveBeenCalledWith({queryArgs: {}});
    });

    it('should query quote requests as associate', async () => {
      const params = {
        where: ['quoteRequestState="Submitted"'],
        limit: 20,
      } as z.infer<typeof readQuoteRequestParameters>;

      const mockResult = {
        results: [{id: 'quote-request-id', quoteRequestState: 'Submitted'}],
        total: 1,
      };
      mockExecute.mockResolvedValueOnce({body: mockResult});

      const result = await readQuoteRequest(
        mockApiRoot as any,
        context,
        params
      );

      expect(result).toEqual(mockResult);
      expect(mockGet).toHaveBeenCalledWith({
        queryArgs: {
          where: ['quoteRequestState="Submitted"'],
          limit: 20,
        },
      });
    });

    it('should handle expand parameter', async () => {
      const params = {
        id: 'quote-request-id',
        expand: ['customer', 'cart'],
      } as z.infer<typeof readQuoteRequestParameters>;

      await readQuoteRequest(mockApiRoot as any, context, params);

      expect(mockGet).toHaveBeenCalledWith({
        queryArgs: {expand: ['customer', 'cart']},
      });
    });

    it('should throw error if customerId is missing', async () => {
      const params = {id: 'quote-request-id'} as z.infer<
        typeof readQuoteRequestParameters
      >;

      const contextWithoutCustomerId = {
        projectKey: 'test-project',
        businessUnitKey: 'business-unit-key',
      };

      await expect(
        readQuoteRequest(mockApiRoot as any, contextWithoutCustomerId, params)
      ).rejects.toThrow(
        'Associate ID (customerId) is required for associate operations'
      );
    });

    it('should throw error if businessUnitKey is missing', async () => {
      const params = {id: 'quote-request-id'} as z.infer<
        typeof readQuoteRequestParameters
      >;

      const contextWithoutBusinessUnit = {
        projectKey: 'test-project',
        customerId: 'associate-id',
      };

      await expect(
        readQuoteRequest(mockApiRoot as any, contextWithoutBusinessUnit, params)
      ).rejects.toThrow(
        'Business Unit key is required for associate operations'
      );
    });
  });

  describe('createQuoteRequest', () => {
    it('should create a quote request as associate', async () => {
      const params = {
        cart: {id: 'cart-id', typeId: 'cart' as const},
        cartVersion: 1,
        comment: 'Test comment',
      } as z.infer<typeof createQuoteRequestParameters>;

      const mockResult = {id: 'quote-request-id', version: 1};
      mockExecute.mockResolvedValueOnce({body: mockResult});

      const result = await createQuoteRequest(
        mockApiRoot as any,
        context,
        params
      );

      expect(result).toEqual(mockResult);
      expect(mockPost).toHaveBeenCalledWith({
        body: {
          cart: {id: 'cart-id', typeId: 'cart'},
          cartVersion: 1,
          comment: 'Test comment',
        },
      });
    });

    it('should create a quote request with minimal parameters', async () => {
      const params = {
        cart: {id: 'cart-id', typeId: 'cart' as const},
        cartVersion: 1,
      } as z.infer<typeof createQuoteRequestParameters>;

      const mockResult = {id: 'quote-request-id', version: 1};
      mockExecute.mockResolvedValueOnce({body: mockResult});

      const result = await createQuoteRequest(
        mockApiRoot as any,
        context,
        params
      );

      expect(result).toEqual(mockResult);
      expect(mockPost).toHaveBeenCalledWith({
        body: {
          cart: {id: 'cart-id', typeId: 'cart'},
          cartVersion: 1,
        },
      });
    });

    it('should create a quote request with all optional fields', async () => {
      const params = {
        cart: {id: 'cart-id', typeId: 'cart' as const},
        cartVersion: 1,
        comment: 'Test comment',
        key: 'my-quote-request',
        custom: {type: {key: 'custom-type'}, fields: {priority: 'high'}},
      } as z.infer<typeof createQuoteRequestParameters>;

      const mockResult = {id: 'quote-request-id', version: 1};
      mockExecute.mockResolvedValueOnce({body: mockResult});

      const result = await createQuoteRequest(
        mockApiRoot as any,
        context,
        params
      );

      expect(result).toEqual(mockResult);
      expect(mockPost).toHaveBeenCalledWith({
        body: {
          cart: {id: 'cart-id', typeId: 'cart'},
          cartVersion: 1,
          comment: 'Test comment',
          key: 'my-quote-request',
          custom: {type: {key: 'custom-type'}, fields: {priority: 'high'}},
        },
      });
    });

    it('should handle errors when creating quote request', async () => {
      const params = {
        cart: {id: 'cart-id', typeId: 'cart' as const},
        cartVersion: 1,
      } as z.infer<typeof createQuoteRequestParameters>;

      const mockError = new Error('Creation failed');
      mockExecute.mockRejectedValueOnce(mockError);

      await expect(
        createQuoteRequest(mockApiRoot as any, context, params)
      ).rejects.toThrow('Failed to create quote request as associate');
    });

    it('should throw error if customerId is missing', async () => {
      const params = {
        cart: {id: 'cart-id', typeId: 'cart' as const},
        cartVersion: 1,
      } as z.infer<typeof createQuoteRequestParameters>;

      const contextWithoutCustomerId = {
        projectKey: 'test-project',
        businessUnitKey: 'business-unit-key',
      };

      await expect(
        createQuoteRequest(mockApiRoot as any, contextWithoutCustomerId, params)
      ).rejects.toThrow(
        'Associate ID (customerId) is required for associate operations'
      );
    });

    it('should throw error if businessUnitKey is missing', async () => {
      const params = {
        cart: {id: 'cart-id', typeId: 'cart' as const},
        cartVersion: 1,
      } as z.infer<typeof createQuoteRequestParameters>;

      const contextWithoutBusinessUnit = {
        projectKey: 'test-project',
        customerId: 'associate-id',
      };

      await expect(
        createQuoteRequest(
          mockApiRoot as any,
          contextWithoutBusinessUnit,
          params
        )
      ).rejects.toThrow(
        'Business Unit key is required for associate operations'
      );
    });
  });

  describe('updateQuoteRequest', () => {
    it('should update a quote request by ID as associate', async () => {
      const params = {
        id: 'quote-request-id',
        version: 1,
        actions: [
          {action: 'changeQuoteRequestState', quoteRequestState: 'Submitted'},
        ],
      } as z.infer<typeof updateQuoteRequestParameters>;

      const mockResult = {id: 'quote-request-id', version: 2};
      mockExecute.mockResolvedValueOnce({body: mockResult});

      const result = await updateQuoteRequest(
        mockApiRoot as any,
        context,
        params
      );

      expect(result).toEqual(mockResult);
      expect(mockWithId).toHaveBeenCalledWith({ID: 'quote-request-id'});
      expect(mockPost).toHaveBeenCalledWith({
        body: {
          version: 1,
          actions: [
            {action: 'changeQuoteRequestState', quoteRequestState: 'Submitted'},
          ],
        },
      });
    });

    it('should update a quote request by key as associate', async () => {
      const params = {
        key: 'quote-request-key',
        version: 1,
        actions: [{action: 'setComment', comment: 'Updated comment'}],
      } as z.infer<typeof updateQuoteRequestParameters>;

      const mockResult = {key: 'quote-request-key', version: 2};
      mockExecute.mockResolvedValueOnce({body: mockResult});

      const result = await updateQuoteRequest(
        mockApiRoot as any,
        context,
        params
      );

      expect(result).toEqual(mockResult);
      expect(mockWithKey).toHaveBeenCalledWith({key: 'quote-request-key'});
      expect(mockPost).toHaveBeenCalledWith({
        body: {
          version: 1,
          actions: [{action: 'setComment', comment: 'Updated comment'}],
        },
      });
    });

    it('should throw error if neither id nor key is provided', async () => {
      const params = {
        version: 1,
        actions: [
          {action: 'changeQuoteRequestState', quoteRequestState: 'Submitted'},
        ],
      } as z.infer<typeof updateQuoteRequestParameters>;

      await expect(
        updateQuoteRequest(mockApiRoot as any, context, params)
      ).rejects.toThrow(
        'Either id or key must be provided for update operations'
      );
    });

    it('should throw error if customerId is missing', async () => {
      const params = {
        id: 'quote-request-id',
        version: 1,
        actions: [
          {action: 'changeQuoteRequestState', quoteRequestState: 'Submitted'},
        ],
      } as z.infer<typeof updateQuoteRequestParameters>;

      const contextWithoutCustomerId = {
        projectKey: 'test-project',
        businessUnitKey: 'business-unit-key',
      };

      await expect(
        updateQuoteRequest(mockApiRoot as any, contextWithoutCustomerId, params)
      ).rejects.toThrow(
        'Associate ID (customerId) is required for associate operations'
      );
    });

    it('should throw error if businessUnitKey is missing', async () => {
      const params = {
        id: 'quote-request-id',
        version: 1,
        actions: [
          {action: 'changeQuoteRequestState', quoteRequestState: 'Submitted'},
        ],
      } as z.infer<typeof updateQuoteRequestParameters>;

      const contextWithoutBusinessUnit = {
        projectKey: 'test-project',
        customerId: 'associate-id',
      };

      await expect(
        updateQuoteRequest(
          mockApiRoot as any,
          contextWithoutBusinessUnit,
          params
        )
      ).rejects.toThrow(
        'Business Unit key is required for associate operations'
      );
    });

    it('should handle errors when updating quote request', async () => {
      const params = {
        id: 'quote-request-id',
        version: 1,
        actions: [
          {action: 'changeQuoteRequestState', quoteRequestState: 'Submitted'},
        ],
      } as z.infer<typeof updateQuoteRequestParameters>;

      const mockError = new Error('Update failed');
      mockExecute.mockRejectedValueOnce(mockError);

      await expect(
        updateQuoteRequest(mockApiRoot as any, context, params)
      ).rejects.toThrow('Failed to update quote request as associate');
    });
  });
});
