import {transformData} from '../../modelcontextprotocol/transform';

describe('transform', () => {
  describe('transformData', () => {
    test('ignores undefined values', () => {
      let testObj: any = {
        testUndefined1: undefined,
        testUndefined2: undefined,
      };

      let transformedData = transformData(testObj);
      let expectedTransformedData = ``;

      expect(transformedData).toBe(expectedTransformedData);

      testObj = {
        testUndefined1: undefined,
        testUndefined2: undefined,
        testVal: 'string',
      };

      transformedData = transformData(testObj);
      expectedTransformedData = `Test Val: string`;

      expect(transformedData).toBe(expectedTransformedData);
    });

    test('ignores function values', () => {
      let testObj: any = {
        testfunction: () => 'function',
      };

      let transformedData = transformData(testObj);
      let expectedTransformedData = ``;

      expect(transformedData).toBe(expectedTransformedData);

      testObj = {
        testfunction: () => 'function',
        testVal: 'string',
      };

      transformedData = transformData(testObj);
      expectedTransformedData = `Test Val: string`;

      expect(transformedData).toBe(expectedTransformedData);
    });

    test('transforms null values to key value pair with null as the value', () => {
      const testObj = {
        testNull: null,
        testNull2: null,
      };

      const transformedData = transformData(testObj);
      const expectedTransformedData = `Test Null: null\nTest Null2: null`;

      expect(transformedData).toBe(expectedTransformedData);
    });

    test('transforms boolean type values to key/value pair with Yes/No values', () => {
      const testObj = {
        testBool1: true,
        testBool2: false,
      };

      const transformedData = transformData(testObj);
      const expectedTransformedData = `Test Bool1: Yes\nTest Bool2: No`;

      expect(transformedData).toBe(expectedTransformedData);
    });

    test('transforms boolean type values to Yes/No in nested objects and arrays', () => {
      // TODO
      // const testObj = {
      //   nest: {
      //     testBool1: false,
      //     testBool2: true,
      //     nest2: {
      //       testBool2: true,
      //       array1: [true, false, 'string', false],
      //       array2: [
      //         {
      //           testBool1: true,
      //           testBool2: false,
      //         },
      //       ],
      //     },
      //   },
      // };
      // const transformedData = transformData(testObj);
      // const expectedTransformedData = 'TODO';
      // expect(transformedData).toBe(expectedTransformedData);
    });

    test('transforms empty string values to key/value pair with "" as value', () => {
      const testObj = {
        testString1: '',
        testString2: '',
      };

      const transformedData = transformData(testObj);
      const expectedTransformedData = `Test String1: ""\nTest String2: ""`;

      expect(transformedData).toBe(expectedTransformedData);
    });

    test('transforms string type values to key/value pair', () => {
      const testObj = {
        testString1: 'Test string one',
        testString2: '2nd test string',
      };

      const transformedData = transformData(testObj);
      const expectedTransformedData = `Test String1: Test string one\nTest String2: 2nd test string`;

      expect(transformedData).toBe(expectedTransformedData);
    });

    test('transforms number type values to key/value pair', () => {
      const testObj = {
        testNumber1: 360,
        testNumber2: 0.2342,
      };

      const transformedData = transformData(testObj);
      const expectedTransformedData = `Test Number1: 360\nTest Number2: 0.2342`;

      expect(transformedData).toBe(expectedTransformedData);
    });

    test('transforms bigint type values to key/value pair', () => {
      const testObj = {
        testBigInt1: 9007199254740991n,
        testBigInt2: BigInt('0o377777777777777777'),
      };

      const transformedData = transformData(testObj);
      const expectedTransformedData = `Test Big Int1: 9007199254740991\nTest Big Int2: 9007199254740991`;

      expect(transformedData).toBe(expectedTransformedData);
    });

    test('transforms NaN and infinity values to key/value pair with expected values', () => {
      const testObj = {
        testNaN: NaN,
        testInfinity: Infinity,
        testNegativeInfinity: -Infinity,
      };

      const transformedData = transformData(testObj);
      const expectedTransformedData = `Test Na N: NaN\nTest Infinity: Infinity\nTest Negative Infinity: -Infinity`;

      expect(transformedData).toBe(expectedTransformedData);
    });

    test('transforms empty arrays to key/value pair with "none" as value', () => {
      const testObj = {
        testEmptyArray: [],
      };

      const transformedData = transformData(testObj);
      const expectedTransformedData = `Test Empty Array: none`;

      expect(transformedData).toBe(expectedTransformedData);
    });

    test('transforms basic arrays (without objects or arrays) as expected', () => {
      const testObj = {
        basicArrayValues: [
          undefined,
          'true',
          true,
          false,
          () => 'func',
          2345,
          66573478589565456346675464n,
          null,
          '',
        ],
      };

      const transformedData = transformData(testObj);
      const expectedTransformedData = `Basic Array Values: true, Yes, No, 2345, 66573478589565456346675464, null, ""`;

      expect(transformedData).toBe(expectedTransformedData);
    });

    // test('// TODO complex arrays', () => {
    //   const testObj = {
    //     testNull: null,
    //   };

    //   const transformedData = transformData(testObj);
    //   const expectedTransformedData = `TODO`;

    //   expect(transformedData).toBe(expectedTransformedData);
    // });

    test('transforms properties containing empty objects, or only functions or undefined values to key/value pair with "no properties" value', () => {
      let testObj: Record<string, any> = {
        emptyObject: {},
      };

      let transformedData = transformData(testObj);
      let expectedTransformedData = `Empty Object: no properties`;

      expect(transformedData).toBe(expectedTransformedData);

      testObj = {
        objectWithOnlyUndefined: {
          undefinedValue: undefined,
        },
      };

      transformedData = transformData(testObj);
      expectedTransformedData = `Object With Only Undefined: no properties`;

      expect(transformedData).toBe(expectedTransformedData);

      testObj = {
        objectWithOnlyFunctions: {
          functionValue: () => {
            return '';
          },
        },
      };

      transformedData = transformData(testObj);
      expectedTransformedData = `Object With Only Functions: no properties`;

      expect(transformedData).toBe(expectedTransformedData);
    });

    test('converts objects with basic property types as expected', () => {
      let testObj = {
        customer: {
          customerId: 12345,
          firstName: 'Example',
          lastName: 'Name',
          email: 'example.name@example.com',
        },
      };

      const transformedData = transformData(testObj);
      const expectedTransformedData = `Customer: 
- Customer Id: 12345
- First Name: Example
- Last Name: Name
- Email: example.name@example.com`;

      expect(transformedData).toBe(expectedTransformedData);
    });

    // test('// TODO object with complex property types', () => {
    //   const testObj = {
    //     testNull: null,
    //   };

    //   const transformedData = transformData(testObj);
    //   const expectedTransformedData = `TODO`;

    //   expect(transformedData).toBe(expectedTransformedData);
    // });

    test('transforms camel case property names as expected', () => {
      const camelCase = {propertyName: 'camelCase'};
      const expectedOutput = 'Property Name: camelCase';
      const actualOutput = transformData(camelCase);
      expect(actualOutput).toBe(expectedOutput);
    });

    test('transforms camel case property names with acronyms as expected', () => {
      const camelCaseWithAronym = {propertyNameSDK: 'camelCaseWithAronym'};
      const expectedOutput = 'Property Name SDK: camelCaseWithAronym';
      const actualOutput = transformData(camelCaseWithAronym);
      expect(actualOutput).toBe(expectedOutput);
    });

    test('transforms snake case property names as expected', () => {
      const snakeCase = {propertyName: 'snakeCase'};
      const expectedOutput = 'Property Name: snakeCase';
      const actualOutput = transformData(snakeCase);
      expect(actualOutput).toBe(expectedOutput);
    });

    test('transforms snake case property names with acronyms as expected', () => {
      const snakeCaseWithAronym = {property_name_SDK: 'snakeCaseWithAronym'};
      const expectedOutput = 'Property Name SDK: snakeCaseWithAronym';
      const actualOutput = transformData(snakeCaseWithAronym);
      expect(actualOutput).toBe(expectedOutput);
    });

    test('transforms kebab case property names as expected', () => {
      const kebabCase = {'property-name': 'kebabCase'};
      const expectedOutput = 'Property Name: kebabCase';
      const actualOutput = transformData(kebabCase);
      expect(actualOutput).toBe(expectedOutput);
    });

    test('transforms kebab case property names with acronyms as expected', () => {
      const kebabCaseWithAronym = {'property-name-SDK': 'kebabCaseWithAronym'};
      const expectedOutput = 'Property Name SDK: kebabCaseWithAronym';
      const actualOutput = transformData(kebabCaseWithAronym);
      expect(actualOutput).toBe(expectedOutput);
    });

    test('transforms pascal case property names as expected', () => {
      const pascalCase = {PropertyName: 'pascalCase'};
      const expectedOutput = 'Property Name: pascalCase';
      const actualOutput = transformData(pascalCase);
      expect(actualOutput).toBe(expectedOutput);
    });

    test('transforms pascal case property names with acronyms as expected', () => {
      const pascalCaseWithAronym = {PropertyNameSDK: 'pascalCaseWithAronym'};
      const expectedOutput = 'Property Name SDK: pascalCaseWithAronym';
      const actualOutput = transformData(pascalCaseWithAronym);
      expect(actualOutput).toBe(expectedOutput);
    });

    test('transforms unusual property name casings as expected', () => {
      let unusualCasing: Record<string, string> = {
        '_Unusual-Case_SDK': '_Unusual-Case_SDK',
      };
      let expectedOutput = 'Unusual Case SDK: _Unusual-Case_SDK';
      let actualOutput = transformData(unusualCasing);
      expect(actualOutput).toBe(expectedOutput);

      unusualCasing = {'_unusualCase-_-234SDK': '_unusualCase-_-234SDK'};
      expectedOutput = 'Unusual Case 234 SDK: _unusualCase-_-234SDK';
      actualOutput = transformData(unusualCasing);
      expect(actualOutput).toBe(expectedOutput);
    });

    test('transforms edge case property names as expected', () => {
      const edgeCase = {' edge  Case ': ' edge  Case '};
      const expectedOutput = 'Edge Case:  edge  Case ';
      const actualOutput = transformData(edgeCase);
      expect(actualOutput).toBe(expectedOutput);
    });

    // test('//TODO removes and handles duplicated property names after transformation', () => {
    //   const testObj = {
    //     testNull: null,
    //   };

    //   const transformedData = transformData(testObj);
    //   const expectedTransformedData = `TODO`;

    //   expect(transformedData).toBe(expectedTransformedData);
    // });
  });
});
