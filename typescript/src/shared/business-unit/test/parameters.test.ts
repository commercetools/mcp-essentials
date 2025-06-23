import {
  readBusinessUnitParameters,
  createBusinessUnitParameters,
  updateBusinessUnitParameters,
} from '../parameters';

describe('Business Unit Parameters', () => {
  describe('readBusinessUnitParameters', () => {
    it('should validate valid read parameters with id', () => {
      const validParams = {
        id: 'bu-123',
        expand: ['associates[*].customer'],
      };

      const result = readBusinessUnitParameters.safeParse(validParams);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toEqual(validParams);
      }
    });

    it('should validate valid read parameters with key', () => {
      const validParams = {
        key: 'test-business-unit',
        limit: 20,
        offset: 10,
      };

      const result = readBusinessUnitParameters.safeParse(validParams);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toEqual(validParams);
      }
    });

    it('should validate valid read parameters with where conditions', () => {
      const validParams = {
        where: ['status="Active"', 'unitType="Company"'],
        sort: ['createdAt desc'],
        limit: 50,
      };

      const result = readBusinessUnitParameters.safeParse(validParams);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toEqual(validParams);
      }
    });

    it('should reject invalid limit values', () => {
      const invalidParams = {
        limit: 600, // exceeds max limit of 500
      };

      const result = readBusinessUnitParameters.safeParse(invalidParams);
      expect(result.success).toBe(false);
    });

    it('should reject negative offset values', () => {
      const invalidParams = {
        offset: -1,
      };

      const result = readBusinessUnitParameters.safeParse(invalidParams);
      expect(result.success).toBe(false);
    });

    it('should validate with store key', () => {
      const validParams = {
        storeKey: 'test-store',
        where: ['status="Active"'],
      };

      const result = readBusinessUnitParameters.safeParse(validParams);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toEqual(validParams);
      }
    });
  });

  describe('createBusinessUnitParameters', () => {
    it('should validate valid create parameters', () => {
      const validParams = {
        key: 'test-business-unit',
        name: 'Test Business Unit',
        unitType: 'Company' as const,
        contactEmail: 'test@example.com',
        status: 'Active' as const,
      };

      const result = createBusinessUnitParameters.safeParse(validParams);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toEqual(validParams);
      }
    });

    it('should validate create parameters with addresses', () => {
      const validParams = {
        key: 'test-business-unit',
        name: 'Test Business Unit',
        unitType: 'Company' as const,
        addresses: [
          {
            id: 'addr-1',
            country: 'US',
            city: 'New York',
            streetName: 'Broadway',
            streetNumber: '123',
            postalCode: '10001',
          },
        ],
        shippingAddressIds: ['addr-1'],
        defaultShippingAddressId: 'addr-1',
      };

      const result = createBusinessUnitParameters.safeParse(validParams);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toEqual(validParams);
      }
    });

    it('should validate create parameters with associates', () => {
      const validParams = {
        key: 'test-business-unit',
        name: 'Test Business Unit',
        unitType: 'Division' as const,
        associates: [
          {
            customer: {
              id: 'customer-123',
              typeId: 'customer' as const,
            },
            associateRoleAssignments: [
              {
                associateRole: {
                  key: 'admin-role',
                  typeId: 'associate-role' as const,
                },
                inheritance: 'Enabled' as const,
              },
            ],
          },
        ],
        associateMode: 'Explicit' as const,
      };

      const result = createBusinessUnitParameters.safeParse(validParams);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toEqual(validParams);
      }
    });

    it('should validate create parameters with parent unit', () => {
      const validParams = {
        key: 'child-division',
        name: 'Child Division',
        unitType: 'Division' as const,
        parentUnit: {
          key: 'parent-company',
          typeId: 'business-unit' as const,
        },
        storeMode: 'FromParent' as const,
      };

      const result = createBusinessUnitParameters.safeParse(validParams);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toEqual(validParams);
      }
    });

    it('should validate create parameters with stores', () => {
      const validParams = {
        key: 'test-business-unit',
        name: 'Test Business Unit',
        unitType: 'Company' as const,
        stores: [
          {
            key: 'store-1',
            typeId: 'store' as const,
          },
          {
            key: 'store-2',
            typeId: 'store' as const,
          },
        ],
        storeMode: 'Explicit' as const,
      };

      const result = createBusinessUnitParameters.safeParse(validParams);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toEqual(validParams);
      }
    });

    it('should reject invalid key format', () => {
      const invalidParams = {
        key: 'invalid key with spaces',
        name: 'Test Business Unit',
        unitType: 'Company',
      };

      const result = createBusinessUnitParameters.safeParse(invalidParams);
      expect(result.success).toBe(false);
    });

    it('should reject key that is too short', () => {
      const invalidParams = {
        key: 'a', // minimum length is 2
        name: 'Test Business Unit',
        unitType: 'Company',
      };

      const result = createBusinessUnitParameters.safeParse(invalidParams);
      expect(result.success).toBe(false);
    });

    it('should reject key that is too long', () => {
      const invalidParams = {
        key: 'a'.repeat(257), // maximum length is 256
        name: 'Test Business Unit',
        unitType: 'Company',
      };

      const result = createBusinessUnitParameters.safeParse(invalidParams);
      expect(result.success).toBe(false);
    });

    it('should reject invalid email format', () => {
      const invalidParams = {
        key: 'test-business-unit',
        name: 'Test Business Unit',
        unitType: 'Company',
        contactEmail: 'invalid-email',
      };

      const result = createBusinessUnitParameters.safeParse(invalidParams);
      expect(result.success).toBe(false);
    });

    it('should reject invalid unit type', () => {
      const invalidParams = {
        key: 'test-business-unit',
        name: 'Test Business Unit',
        unitType: 'InvalidType',
      };

      const result = createBusinessUnitParameters.safeParse(invalidParams);
      expect(result.success).toBe(false);
    });

    it('should reject invalid status', () => {
      const invalidParams = {
        key: 'test-business-unit',
        name: 'Test Business Unit',
        unitType: 'Company',
        status: 'InvalidStatus',
      };

      const result = createBusinessUnitParameters.safeParse(invalidParams);
      expect(result.success).toBe(false);
    });

    it('should require country in address', () => {
      const invalidParams = {
        key: 'test-business-unit',
        name: 'Test Business Unit',
        unitType: 'Company',
        addresses: [
          {
            city: 'New York',
            streetName: 'Broadway',
            // missing required country field
          },
        ],
      };

      const result = createBusinessUnitParameters.safeParse(invalidParams);
      expect(result.success).toBe(false);
    });
  });

  describe('updateBusinessUnitParameters', () => {
    it('should validate valid update parameters with id', () => {
      const validParams = {
        id: 'bu-123',
        version: 1,
        actions: [
          {
            action: 'changeName',
            name: 'Updated Business Unit Name',
          },
        ],
      };

      const result = updateBusinessUnitParameters.safeParse(validParams);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toEqual(validParams);
      }
    });

    it('should validate valid update parameters with key', () => {
      const validParams = {
        key: 'test-business-unit',
        version: 2,
        actions: [
          {
            action: 'changeStatus',
            status: 'Inactive',
          },
        ],
      };

      const result = updateBusinessUnitParameters.safeParse(validParams);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toEqual(validParams);
      }
    });

    it('should validate update parameters with multiple actions', () => {
      const validParams = {
        id: 'bu-123',
        version: 1,
        actions: [
          {
            action: 'changeName',
            name: 'Updated Name',
          },
          {
            action: 'setContactEmail',
            contactEmail: 'new-email@example.com',
          },
          {
            action: 'addAddress',
            address: {
              country: 'US',
              city: 'San Francisco',
              streetName: 'Market Street',
              streetNumber: '456',
              postalCode: '94105',
            },
          },
        ],
      };

      const result = updateBusinessUnitParameters.safeParse(validParams);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toEqual(validParams);
      }
    });

    it('should validate update parameters with store key', () => {
      const validParams = {
        key: 'test-business-unit',
        version: 1,
        actions: [
          {
            action: 'changeName',
            name: 'Updated Name',
          },
        ],
        storeKey: 'test-store',
      };

      const result = updateBusinessUnitParameters.safeParse(validParams);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toEqual(validParams);
      }
    });

    it('should validate valid update parameters with version', () => {
      const validParams = {
        id: 'bu-123',
        version: 1,
        actions: [{action: 'changeName', name: 'Updated BU'}],
      };

      const result = updateBusinessUnitParameters.safeParse(validParams);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toEqual(validParams);
      }
    });

    it('should validate valid update parameters without version', () => {
      const validParams = {
        id: 'bu-123',
        actions: [{action: 'changeName', name: 'Updated BU'}],
      };

      const result = updateBusinessUnitParameters.safeParse(validParams);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toEqual(validParams);
      }
    });

    it('should reject negative version numbers', () => {
      const invalidParams = {
        id: 'bu-123',
        version: -1,
        actions: [{action: 'changeName', name: 'Updated BU'}],
      };

      const result = updateBusinessUnitParameters.safeParse(invalidParams);
      expect(result.success).toBe(false);
    });

    it('should require actions array', () => {
      const invalidParams = {
        id: 'bu-123',
        version: 1,
        // missing required actions field
      };

      const result = updateBusinessUnitParameters.safeParse(invalidParams);
      expect(result.success).toBe(false);
    });

    it('should require action field in each action object', () => {
      const invalidParams = {
        id: 'bu-123',
        version: 1,
        actions: [
          {
            // missing required action field
            name: 'Updated Name',
          },
        ],
      };

      const result = updateBusinessUnitParameters.safeParse(invalidParams);
      expect(result.success).toBe(false);
    });

    it('should reject non-integer version', () => {
      const invalidParams = {
        id: 'bu-123',
        version: 1.5,
        actions: [
          {
            action: 'changeName',
            name: 'Updated Name',
          },
        ],
      };

      const result = updateBusinessUnitParameters.safeParse(invalidParams);
      expect(result.success).toBe(false);
    });
  });
});
