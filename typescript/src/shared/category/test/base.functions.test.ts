import {
  readCategoryById,
  readCategoryByKey,
  queryCategories,
  createCategory,
  updateCategoryById,
  updateCategoryByKey,
} from '../base.functions';
import {ApiRoot} from '@commercetools/platform-sdk';

// Mock category data
const mockCategory = {
  id: 'test-category-id',
  version: 1,
  key: 'test-category',
  name: {
    en: 'Test Category',
  },
  slug: {
    en: 'test-category',
  },
  createdAt: '2023-01-01T00:00:00.000Z',
  lastModifiedAt: '2023-01-01T00:00:00.000Z',
};

// Mock category list result
const mockCategoryList = {
  limit: 20,
  offset: 0,
  count: 1,
  total: 1,
  results: [mockCategory],
};

// Mock ApiRoot
const createMockApiRoot = () => {
  const mockWithId = {
    get: jest.fn().mockReturnValue({
      execute: jest.fn().mockResolvedValue({
        body: mockCategory,
      }),
    }),
    post: jest.fn().mockReturnValue({
      execute: jest.fn().mockResolvedValue({
        body: {...mockCategory, version: 2},
      }),
    }),
  };

  const mockWithKey = {
    get: jest.fn().mockReturnValue({
      execute: jest.fn().mockResolvedValue({
        body: mockCategory,
      }),
    }),
    post: jest.fn().mockReturnValue({
      execute: jest.fn().mockResolvedValue({
        body: {...mockCategory, version: 2},
      }),
    }),
  };

  const mockCategories = {
    withId: jest.fn().mockReturnValue(mockWithId),
    withKey: jest.fn().mockReturnValue(mockWithKey),
    get: jest.fn().mockReturnValue({
      execute: jest.fn().mockResolvedValue({
        body: mockCategoryList,
      }),
    }),
    post: jest.fn().mockReturnValue({
      execute: jest.fn().mockResolvedValue({
        body: mockCategory,
      }),
    }),
  };

  const mockWithProjectKey = {
    categories: jest.fn().mockReturnValue(mockCategories),
  };

  return {
    withProjectKey: jest.fn().mockReturnValue(mockWithProjectKey),
  } as unknown as ApiRoot;
};

describe('Category Base Functions', () => {
  let mockApiRoot: ApiRoot;
  const projectKey = 'test-project';

  beforeEach(() => {
    mockApiRoot = createMockApiRoot();
    jest.clearAllMocks();
  });

  describe('readCategoryById', () => {
    it('should read a category by ID', async () => {
      const result = await readCategoryById(
        mockApiRoot,
        projectKey,
        'test-category-id'
      );

      expect(result).toEqual(mockCategory);
      expect(mockApiRoot.withProjectKey).toHaveBeenCalledWith({projectKey});
      expect(
        mockApiRoot.withProjectKey({projectKey}).categories
      ).toHaveBeenCalled();
      expect(
        mockApiRoot.withProjectKey({projectKey}).categories().withId
      ).toHaveBeenCalledWith({ID: 'test-category-id'});
    });

    it('should read a category by ID with expand', async () => {
      const expand = ['parent'];
      const result = await readCategoryById(
        mockApiRoot,
        projectKey,
        'test-category-id',
        expand
      );

      expect(result).toEqual(mockCategory);
      const withIdMock = mockApiRoot
        .withProjectKey({projectKey})
        .categories().withId;
      const getMock = withIdMock({ID: 'test-category-id'}).get;
      expect(getMock).toHaveBeenCalledWith({
        queryArgs: {expand},
      });
    });
  });

  describe('readCategoryByKey', () => {
    it('should read a category by key', async () => {
      const result = await readCategoryByKey(
        mockApiRoot,
        projectKey,
        'test-category'
      );

      expect(result).toEqual(mockCategory);
      expect(
        mockApiRoot.withProjectKey({projectKey}).categories().withKey
      ).toHaveBeenCalledWith({key: 'test-category'});
    });

    it('should read a category by key with expand', async () => {
      const expand = ['parent'];
      const result = await readCategoryByKey(
        mockApiRoot,
        projectKey,
        'test-category',
        expand
      );

      expect(result).toEqual(mockCategory);
      const withKeyMock = mockApiRoot
        .withProjectKey({projectKey})
        .categories().withKey;
      const getMock = withKeyMock({key: 'test-category'}).get;
      expect(getMock).toHaveBeenCalledWith({
        queryArgs: {expand},
      });
    });
  });

  describe('queryCategories', () => {
    it('should query categories with default parameters', async () => {
      const result = await queryCategories(mockApiRoot, projectKey);

      expect(result).toEqual(mockCategoryList);
      expect(
        mockApiRoot.withProjectKey({projectKey}).categories().get
      ).toHaveBeenCalledWith({
        queryArgs: {limit: 10},
      });
    });

    it('should query categories with all parameters', async () => {
      const limit = 5;
      const offset = 10;
      const sort = ['name.en asc'];
      const where = ['name(en = "Test Category")'];
      const expand = ['parent'];

      const result = await queryCategories(
        mockApiRoot,
        projectKey,
        limit,
        offset,
        sort,
        where,
        expand
      );

      expect(result).toEqual(mockCategoryList);
      expect(
        mockApiRoot.withProjectKey({projectKey}).categories().get
      ).toHaveBeenCalledWith({
        queryArgs: {
          limit,
          offset,
          sort,
          where,
          expand,
        },
      });
    });
  });

  describe('createCategory', () => {
    it('should create a category', async () => {
      const categoryDraft = {
        name: {en: 'Test Category'},
        slug: {en: 'test-category'},
      };

      const result = await createCategory(
        mockApiRoot,
        projectKey,
        categoryDraft
      );

      expect(result).toEqual(mockCategory);
      expect(
        mockApiRoot.withProjectKey({projectKey}).categories().post
      ).toHaveBeenCalledWith({
        body: categoryDraft,
      });
    });
  });

  describe('updateCategoryById', () => {
    it('should update a category by ID', async () => {
      const version = 1;
      const actions = [{action: 'changeName', name: {en: 'Updated Category'}}];

      const result = await updateCategoryById(
        mockApiRoot,
        projectKey,
        'test-category-id',
        version,
        actions as any
      );

      expect(result).toEqual({...mockCategory, version: 2});
      const withIdMock = mockApiRoot
        .withProjectKey({projectKey})
        .categories().withId;
      const postMock = withIdMock({ID: 'test-category-id'}).post;
      expect(postMock).toHaveBeenCalledWith({
        body: {
          version,
          actions,
        },
      });
    });
  });

  describe('updateCategoryByKey', () => {
    it('should update a category by key', async () => {
      const version = 1;
      const actions = [{action: 'changeName', name: {en: 'Updated Category'}}];

      const result = await updateCategoryByKey(
        mockApiRoot,
        projectKey,
        'test-category',
        version,
        actions as any
      );

      expect(result).toEqual({...mockCategory, version: 2});
      const withKeyMock = mockApiRoot
        .withProjectKey({projectKey})
        .categories().withKey;
      const postMock = withKeyMock({key: 'test-category'}).post;
      expect(postMock).toHaveBeenCalledWith({
        body: {
          version,
          actions,
        },
      });
    });
  });
});
