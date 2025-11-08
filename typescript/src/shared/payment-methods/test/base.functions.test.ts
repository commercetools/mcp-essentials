import * as base from '../base.functions';
import {SDKError} from '../../errors/sdkError';

// Mock the execute method
const mockExecute = jest.fn();
const mockGet = jest.fn().mockReturnValue({execute: mockExecute});
const mockPost = jest.fn().mockReturnValue({execute: mockExecute});
const mockWithId = jest.fn().mockReturnValue({
  get: mockGet,
  post: mockPost,
});
const mockWithKey = jest.fn().mockReturnValue({
  get: mockGet,
  post: mockPost,
});
const mockPaymentMethods = jest.fn().mockReturnValue({
  get: mockGet,
  post: mockPost,
  withId: mockWithId,
  withKey: mockWithKey,
});

const mockWithProjectKey = jest.fn().mockReturnValue({
  paymentMethods: mockPaymentMethods,
});

const mockApiRoot = {
  withProjectKey: mockWithProjectKey,
};

const projectKey = 'test-project';

describe('Payment Method Base Functions', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('readPaymentMethodById', () => {
    it('should read a payment method by ID', async () => {
      const mockResponse = {
        body: {
          id: 'test-id',
          key: 'test-key',
          name: {en: 'Test Payment Method'},
        },
      };
      mockExecute.mockResolvedValue(mockResponse);

      const result = await base.readPaymentMethodById(mockApiRoot, projectKey, {
        id: 'test-id',
      });

      expect(mockWithProjectKey).toHaveBeenCalledWith({projectKey});
      expect(mockPaymentMethods).toHaveBeenCalled();
      expect(mockWithId).toHaveBeenCalledWith({ID: 'test-id'});
      expect(mockGet).toHaveBeenCalledWith({queryArgs: {expand: undefined}});
      expect(result).toEqual(mockResponse.body);
      expect(mockExecute).toHaveBeenCalled();
    });

    it('should read a payment method by ID with expand', async () => {
      const mockResponse = {
        body: {
          id: 'test-id',
          key: 'test-key',
          name: {en: 'Test Payment Method'},
        },
      };
      mockExecute.mockResolvedValue(mockResponse);

      const result = await base.readPaymentMethodById(mockApiRoot, projectKey, {
        id: 'test-id',
        expand: ['custom.type'],
      });

      expect(mockWithProjectKey).toHaveBeenCalledWith({projectKey});
      expect(mockPaymentMethods).toHaveBeenCalled();
      expect(mockWithId).toHaveBeenCalledWith({ID: 'test-id'});
      expect(mockGet).toHaveBeenCalledWith({
        queryArgs: {expand: ['custom.type']},
      });
      expect(result).toEqual(mockResponse.body);
      expect(mockExecute).toHaveBeenCalled();
    });

    it('should handle errors when reading payment method by ID', async () => {
      const error = new Error('API Error');
      mockExecute.mockRejectedValue(error);

      await expect(
        base.readPaymentMethodById(mockApiRoot, projectKey, 'test-id')
      ).rejects.toThrow(SDKError);
      await expect(
        base.readPaymentMethodById(mockApiRoot, projectKey, {id: 'test-id'})
      ).rejects.toThrow('Error reading payment method by ID');
    });
  });

  describe('readPaymentMethodByKey', () => {
    it('should read a payment method by key', async () => {
      const mockResponse = {
        body: {
          id: 'test-id',
          key: 'test-key',
          name: {en: 'Test Payment Method'},
        },
      };
      mockExecute.mockResolvedValue(mockResponse);

      const result = await base.readPaymentMethodByKey(
        mockApiRoot,
        projectKey,
        {key: 'test-key'}
      );

      expect(mockWithProjectKey).toHaveBeenCalledWith({projectKey});
      expect(mockPaymentMethods).toHaveBeenCalled();
      expect(mockWithKey).toHaveBeenCalledWith({key: 'test-key'});
      expect(mockGet).toHaveBeenCalledWith({queryArgs: {expand: undefined}});
      expect(result).toEqual(mockResponse.body);
      expect(mockExecute).toHaveBeenCalled();
    });

    it('should read a payment method by key with expand', async () => {
      const mockResponse = {
        body: {
          id: 'test-id',
          key: 'test-key',
          name: {en: 'Test Payment Method'},
        },
      };
      mockExecute.mockResolvedValue(mockResponse);

      const result = await base.readPaymentMethodByKey(
        mockApiRoot,
        projectKey,
        {key: 'test-key', expand: ['custom.type']}
      );

      expect(mockWithProjectKey).toHaveBeenCalledWith({projectKey});
      expect(mockPaymentMethods).toHaveBeenCalled();
      expect(mockWithKey).toHaveBeenCalledWith({key: 'test-key'});
      expect(mockGet).toHaveBeenCalledWith({
        queryArgs: {expand: ['custom.type']},
      });
      expect(result).toEqual(mockResponse.body);
      expect(mockExecute).toHaveBeenCalled();
    });

    it('should handle errors when reading payment method by key', async () => {
      const error = new Error('API Error');
      mockExecute.mockRejectedValue(error);

      await expect(
        base.readPaymentMethodByKey(mockApiRoot, projectKey, 'test-key')
      ).rejects.toThrow(SDKError);
      await expect(
        base.readPaymentMethodByKey(mockApiRoot, projectKey, {key: 'test-key'})
      ).rejects.toThrow('Error reading payment method by key');
    });
  });

  describe('queryPaymentMethods', () => {
    it('should query payment methods', async () => {
      const mockResponse = {
        body: {
          results: [
            {id: 'test-id-1', name: {en: 'Payment Method 1'}},
            {id: 'test-id-2', name: {en: 'Payment Method 2'}},
          ],
        },
      };
      mockExecute.mockResolvedValue(mockResponse);

      const result = await base.queryPaymentMethods(mockApiRoot, projectKey, {
        limit: 10,
        offset: 0,
        sort: ['createdAt desc'],
        where: ['name.en="Credit Card"'],
        expand: ['custom.type'],
      });

      expect(mockWithProjectKey).toHaveBeenCalledWith({projectKey});
      expect(mockPaymentMethods).toHaveBeenCalled();
      expect(mockGet).toHaveBeenCalledWith({
        queryArgs: {
          limit: 10,
          offset: 0,
          sort: ['createdAt desc'],
          where: ['name.en="Credit Card"'],
          expand: ['custom.type'],
        },
      });
      expect(result).toEqual(mockResponse.body);
      expect(mockExecute).toHaveBeenCalled();
    });

    it('should handle errors when querying payment methods', async () => {
      const error = new Error('API Error');
      mockExecute.mockRejectedValue(error);

      await expect(
        base.queryPaymentMethods(mockApiRoot, projectKey, {limit: 10})
      ).rejects.toThrow(Error);
    });
  });

  describe('createPaymentMethod', () => {
    it('should create a payment method', async () => {
      const mockResponse = {
        body: {
          id: 'test-id',
          key: 'test-key',
          name: {en: 'Test Payment Method'},
        },
      };
      mockExecute.mockResolvedValue(mockResponse);

      const paymentMethodDraft = {
        key: 'test-key',
        name: {en: 'Test Payment Method'},
        description: {en: 'Test Description'},
        paymentInterface: 'stripe',
        method: 'credit_card',
      };

      const result = await base.createPaymentMethod(
        mockApiRoot,
        projectKey,
        paymentMethodDraft
      );

      expect(mockWithProjectKey).toHaveBeenCalledWith({projectKey});
      expect(mockPaymentMethods).toHaveBeenCalled();
      expect(mockPost).toHaveBeenCalledWith({body: paymentMethodDraft});
      expect(result).toEqual(mockResponse.body);
      expect(mockExecute).toHaveBeenCalled();
    });

    it('should handle errors when creating payment method', async () => {
      const error = new Error('API Error');
      mockExecute.mockRejectedValue(error);

      const paymentMethodDraft = {
        key: 'test-key',
        name: {en: 'Test Payment Method'},
      };

      await expect(
        base.createPaymentMethod(mockApiRoot, projectKey, paymentMethodDraft)
      ).rejects.toThrow(SDKError);
      await expect(
        base.createPaymentMethod(mockApiRoot, projectKey, paymentMethodDraft)
      ).rejects.toThrow('Error creating payment method');
    });
  });

  describe('updatePaymentMethodById', () => {
    it('should update a payment method by ID', async () => {
      const mockResponse = {
        body: {
          id: 'test-id',
          key: 'test-key',
          name: {en: 'Updated Payment Method'},
        },
      };
      mockExecute.mockResolvedValue(mockResponse);

      const actions = [
        {
          action: 'changeName',
          name: {en: 'Updated Payment Method'},
        },
      ];

      const result = await base.updatePaymentMethodById(
        mockApiRoot,
        projectKey,
        {id: 'test-id', version: 1, actions}
      );

      expect(mockWithProjectKey).toHaveBeenCalledWith({projectKey});
      expect(mockPaymentMethods).toHaveBeenCalled();
      expect(mockWithId).toHaveBeenCalledWith({ID: 'test-id'});
      expect(mockPost).toHaveBeenCalledWith({
        body: {
          version: 1,
          actions,
        },
      });
      expect(result).toEqual(mockResponse.body);
      expect(mockExecute).toHaveBeenCalled();
    });

    it('should handle errors when updating payment method by ID', async () => {
      const error = new Error('API Error');
      mockExecute.mockRejectedValue(error);

      const actions = [
        {
          action: 'changeName',
          name: {en: 'Updated Payment Method'},
        },
      ];

      await expect(
        base.updatePaymentMethodById(
          mockApiRoot,
          projectKey,
          'test-id',
          1,
          actions
        )
      ).rejects.toThrow(SDKError);
      await expect(
        base.updatePaymentMethodById(mockApiRoot, projectKey, {
          id: 'test-id',
          version: 1,
          actions,
        })
      ).rejects.toThrow('Error updating payment method by ID');
    });
  });

  describe('updatePaymentMethodByKey', () => {
    it('should update a payment method by key', async () => {
      const mockResponse = {
        body: {
          id: 'test-id',
          key: 'test-key',
          name: {en: 'Updated Payment Method'},
        },
      };
      mockExecute.mockResolvedValue(mockResponse);

      const actions = [
        {
          action: 'changeName',
          name: {en: 'Updated Payment Method'},
        },
      ];

      const result = await base.updatePaymentMethodByKey(
        mockApiRoot,
        projectKey,
        {key: 'test-key', version: 1, actions}
      );

      expect(mockWithProjectKey).toHaveBeenCalledWith({projectKey});
      expect(mockPaymentMethods).toHaveBeenCalled();
      expect(mockWithKey).toHaveBeenCalledWith({key: 'test-key'});
      expect(mockPost).toHaveBeenCalledWith({
        body: {
          version: 1,
          actions,
        },
      });
      expect(result).toEqual(mockResponse.body);
      expect(mockExecute).toHaveBeenCalled();
    });

    it('should handle errors when updating payment method by key', async () => {
      const error = new Error('API Error');
      mockExecute.mockRejectedValue(error);

      const actions = [
        {
          action: 'changeName',
          name: {en: 'Updated Payment Method'},
        },
      ];

      await expect(
        base.updatePaymentMethodByKey(
          mockApiRoot,
          projectKey,
          'test-key',
          1,
          actions
        )
      ).rejects.toThrow(SDKError);
      await expect(
        base.updatePaymentMethodByKey(mockApiRoot, projectKey, {
          key: 'test-key',
          version: 1,
          actions,
        })
      ).rejects.toThrow('Error updating payment method by key');
    });
  });
});
