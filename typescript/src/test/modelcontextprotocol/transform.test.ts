import {transformToolOutput} from '../../modelcontextprotocol/transform';
import {complexObject} from './transform.mock-data';

const emptyObjectTransformValue = 'no properties';
const emptyArrayTransformValue = 'none';
const indent = ' ';

describe('transform', () => {
  describe('transformPropertyName', () => {
    test('transforms camel case property names as expected', () => {
      const camelCase = {propertyName: 'camelCase'};
      const expectedOutput = 'Property Name: camelCase';
      const actualOutput = transformToolOutput({data: camelCase});
      expect(actualOutput).toBe(expectedOutput);
    });

    test('transforms camel case property names with acronyms as expected', () => {
      const camelCaseWithAronym = {propertyNameSDK: 'camelCaseWithAronym'};
      const expectedOutput = 'Property Name SDK: camelCaseWithAronym';
      const actualOutput = transformToolOutput({data: camelCaseWithAronym});
      expect(actualOutput).toBe(expectedOutput);
    });

    test('transforms snake case property names as expected', () => {
      const snakeCase = {propertyName: 'snakeCase'};
      const expectedOutput = 'Property Name: snakeCase';
      const actualOutput = transformToolOutput({data: snakeCase});
      expect(actualOutput).toBe(expectedOutput);
    });

    test('transforms snake case property names with acronyms as expected', () => {
      const snakeCaseWithAronym = {property_name_SDK: 'snakeCaseWithAronym'};
      const expectedOutput = 'Property Name SDK: snakeCaseWithAronym';
      const actualOutput = transformToolOutput({data: snakeCaseWithAronym});
      expect(actualOutput).toBe(expectedOutput);
    });

    test('transforms kebab case property names as expected', () => {
      const kebabCase = {'property-name': 'kebabCase'};
      const expectedOutput = 'Property Name: kebabCase';
      const actualOutput = transformToolOutput({data: kebabCase});
      expect(actualOutput).toBe(expectedOutput);
    });

    test('transforms kebab case property names with acronyms as expected', () => {
      const kebabCaseWithAronym = {'property-name-SDK': 'kebabCaseWithAronym'};
      const expectedOutput = 'Property Name SDK: kebabCaseWithAronym';
      const actualOutput = transformToolOutput({data: kebabCaseWithAronym});
      expect(actualOutput).toBe(expectedOutput);
    });

    test('transforms pascal case property names as expected', () => {
      const pascalCase = {PropertyName: 'pascalCase'};
      const expectedOutput = 'Property Name: pascalCase';
      const actualOutput = transformToolOutput({data: pascalCase});
      expect(actualOutput).toBe(expectedOutput);
    });

    test('transforms pascal case property names with acronyms as expected', () => {
      const pascalCaseWithAronym = {PropertyNameSDK: 'pascalCaseWithAronym'};
      const expectedOutput = 'Property Name SDK: pascalCaseWithAronym';
      const actualOutput = transformToolOutput({data: pascalCaseWithAronym});
      expect(actualOutput).toBe(expectedOutput);
    });

    test('transforms unusual property name casings as expected', () => {
      let unusualCasing: Record<string, string> = {
        '_Unusual-Case_SDK': '_Unusual-Case_SDK',
      };
      let expectedOutput = 'Unusual Case SDK: _Unusual-Case_SDK';
      let actualOutput = transformToolOutput({data: unusualCasing});
      expect(actualOutput).toBe(expectedOutput);

      unusualCasing = {'_unusualCase-_-234SDK': '_unusualCase-_-234SDK'};
      expectedOutput = 'Unusual Case 234 SDK: _unusualCase-_-234SDK';
      actualOutput = transformToolOutput({data: unusualCasing});
      expect(actualOutput).toBe(expectedOutput);
    });

    test('transforms edge case property names as expected', () => {
      const edgeCase = {' edge  Case ': ' edge  Case '};
      const expectedOutput = 'Edge Case:  edge  Case ';
      const actualOutput = transformToolOutput({data: edgeCase});
      expect(actualOutput).toBe(expectedOutput);
    });
  });

  describe('transformToolOutput', () => {
    describe('format: default tabular', () => {
      test('ignores undefined values', () => {
        let testObj: Record<string, any> = {
          testUndefined1: undefined,
          testUndefined2: undefined,
        };

        let transformedData = transformToolOutput({data: testObj});
        let expectedTransformedData = ``;

        expect(transformedData).toBe(expectedTransformedData);

        testObj = {
          testUndefined1: undefined,
          testUndefined2: undefined,
          testVal: 'string',
        };

        transformedData = transformToolOutput({data: testObj});
        expectedTransformedData = `Test Val: string`;

        expect(transformedData).toBe(expectedTransformedData);
      });

      test('ignores function values', () => {
        let testObj: Record<string, any> = {
          testfunction: () => 'function',
        };

        let transformedData = transformToolOutput({data: testObj});
        let expectedTransformedData = ``;

        expect(transformedData).toBe(expectedTransformedData);

        testObj = {
          testfunction: () => 'function',
          testVal: 'string',
        };

        transformedData = transformToolOutput({data: testObj});
        expectedTransformedData = `Test Val: string`;

        expect(transformedData).toBe(expectedTransformedData);
      });

      test('transforms null values to key value pair with null as the value', () => {
        const testObj = {
          testNull: null,
          testNull2: null,
        };

        const transformedData = transformToolOutput({data: testObj});
        const expectedTransformedData = `Test Null: null\nTest Null2: null`;

        expect(transformedData).toBe(expectedTransformedData);
      });

      test('transforms boolean type values to key/value pair with Yes/No values', () => {
        const testObj = {
          testBool1: true,
          testBool2: false,
        };

        const transformedData = transformToolOutput({data: testObj});
        const expectedTransformedData = `Test Bool1: Yes\nTest Bool2: No`;

        expect(transformedData).toBe(expectedTransformedData);
      });

      test('transforms boolean type values to Yes/No in nested objects and arrays', () => {
        const testObj = {
          obj: {
            testBool1: false,
            testBool2: true,
            nest: {
              testBool2: true,
              array1: [true, false, 'string', false],
              array2: [
                {
                  testBool1: true,
                  testBool2: false,
                },
              ],
            },
          },
        };
        const transformedData = transformToolOutput({data: testObj});

        const expectedTransformedData = `Obj:
- Test Bool1: No
- Test Bool2: Yes
- Nest:
${indent}- Test Bool2: Yes
${indent}- Array1: Yes, No, string, No
${indent}- Array2:
${indent}${indent}0:
${indent}${indent}- Test Bool1: Yes
${indent}${indent}- Test Bool2: No`;

        expect(transformedData).toBe(expectedTransformedData);
      });

      test('transforms empty string values to key/value pair with "" as value', () => {
        const testObj = {
          testString1: '',
          testString2: '',
        };

        const transformedData = transformToolOutput({data: testObj});
        const expectedTransformedData = `Test String1: ""\nTest String2: ""`;

        expect(transformedData).toBe(expectedTransformedData);
      });

      test('transforms string type values to key/value pair', () => {
        const testObj = {
          testString1: 'Test string one',
          testString2: '2nd test string',
        };

        const transformedData = transformToolOutput({data: testObj});
        const expectedTransformedData = `Test String1: Test string one\nTest String2: 2nd test string`;

        expect(transformedData).toBe(expectedTransformedData);
      });

      test('transforms number type values to key/value pair', () => {
        const testObj = {
          testNumber1: 360,
          testNumber2: 0.2342,
        };

        const transformedData = transformToolOutput({data: testObj});
        const expectedTransformedData = `Test Number1: 360\nTest Number2: 0.2342`;

        expect(transformedData).toBe(expectedTransformedData);
      });

      test('transforms bigint type values to key/value pair', () => {
        const testObj = {
          testBigInt1: 9007199254740991n,
          testBigInt2: BigInt('0o377777777777777777'),
        };

        const transformedData = transformToolOutput({data: testObj});
        const expectedTransformedData = `Test Big Int1: 9007199254740991\nTest Big Int2: 9007199254740991`;

        expect(transformedData).toBe(expectedTransformedData);
      });

      test('transforms NaN and infinity values to key/value pair with expected values', () => {
        const testObj = {
          testNaN: NaN,
          testInfinity: Infinity,
          testNegativeInfinity: -Infinity,
        };

        const transformedData = transformToolOutput({data: testObj});
        const expectedTransformedData = `Test Na N: NaN\nTest Infinity: Infinity\nTest Negative Infinity: -Infinity`;

        expect(transformedData).toBe(expectedTransformedData);
      });

      test(`transforms empty arrays to key/value pair with "${emptyArrayTransformValue}" as value`, () => {
        const testObj = {
          testEmptyArray: [],
        };

        const transformedData = transformToolOutput({data: testObj});
        const expectedTransformedData = `Test Empty Array: ${emptyArrayTransformValue}`;

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

        const transformedData = transformToolOutput({data: testObj});
        const expectedTransformedData = `Basic Array Values: true, Yes, No, 2345, 66573478589565456346675464, null, ""`;

        expect(transformedData).toBe(expectedTransformedData);
      });

      test('transforms inconsistent arrays as expected', () => {
        const testObj = {
          arrayOfInconsistentTypes: [
            false,
            {
              differentNameStringProp: 'differentNameStringProp',
              differentNameBoolProp: false,
            },
            'some string',
            null,
            // undefined and function below expected to be removed
            undefined,
            () => 'func',
            [
              true,
              'test',
              [true, {prop: 'string'}],
              {someProp: "What's a data structure?"},
            ],
            'Some other string',
          ],
        };

        const transformedData = transformToolOutput({data: testObj});
        const expectedTransformedData = `Array Of Inconsistent Types:
0: No
1:
- Different Name String Prop: differentNameStringProp
- Different Name Bool Prop: No
2: some string
3: null
4:
${indent}0: Yes
${indent}1: test
${indent}2:
${indent}${indent}0: Yes
${indent}${indent}1:
${indent}${indent}- Prop: string
${indent}3:
${indent}- Some Prop: What's a data structure?
5: Some other string`;

        expect(transformedData).toBe(expectedTransformedData);
      });

      test('transforms arrays of inconsistent objects as expected', () => {
        const testObj = {
          arrayOfInconsistentObjects: [
            {
              stringProp: 'stringProp',
              boolProp: true,
            },
            {
              differentNameStringProp: 'differentNameStringProp',
              differentNameBoolProp: false,
            },
            {
              anotherNameStringProp: 'anotherNameStringProp',
              anotherNameBoolProp: true,
            },
          ],
        };

        const transformedData = transformToolOutput({data: testObj});
        const expectedTransformedData = `Array Of Inconsistent Objects:
0:
- String Prop: stringProp
- Bool Prop: Yes
1:
- Different Name String Prop: differentNameStringProp
- Different Name Bool Prop: No
2:
- Another Name String Prop: anotherNameStringProp
- Another Name Bool Prop: Yes`;

        expect(transformedData).toBe(expectedTransformedData);
      });

      test(`transforms properties containing empty objects, or only functions or undefined values to key/value pair with "${emptyObjectTransformValue}" value`, () => {
        let testObj: Record<string, any> = {
          emptyObject: {},
        };

        let transformedData = transformToolOutput({data: testObj});
        let expectedTransformedData = `Empty Object: ${emptyObjectTransformValue}`;

        expect(transformedData).toBe(expectedTransformedData);

        testObj = {
          objectWithOnlyUndefined: {
            undefinedValue: undefined,
          },
        };

        transformedData = transformToolOutput({data: testObj});
        expectedTransformedData = `Object With Only Undefined: ${emptyObjectTransformValue}`;

        expect(transformedData).toBe(expectedTransformedData);

        testObj = {
          objectWithOnlyFunctions: {
            functionValue: () => {
              return '';
            },
          },
        };

        transformedData = transformToolOutput({data: testObj});
        expectedTransformedData = `Object With Only Functions: ${emptyObjectTransformValue}`;

        expect(transformedData).toBe(expectedTransformedData);
      });

      test('transforms objects with basic property types as expected', () => {
        let testObj = {
          customer: {
            customerId: 12345,
            firstName: 'Example',
            lastName: 'Name',
            email: 'example.name@example.com',
            isActive: true,
          },
        };

        const transformedData = transformToolOutput({data: testObj});
        const expectedTransformedData = `Customer:
- Customer Id: 12345
- First Name: Example
- Last Name: Name
- Email: example.name@example.com
- Is Active: Yes`;

        expect(transformedData).toBe(expectedTransformedData);
      });

      test('transforms arrays of objects with consistent property names and without nested objects or arrays as expected', () => {
        let facets = complexObject.facets;
        // delete array parameters within array
        facets.forEach((facet) => {
          delete facet.terms;
        });
        const testObj = {
          facets: facets,
        };

        const transformedData = transformToolOutput({
          data: testObj,
        });
        const expectedTransformedData = `Facets:
0:
- Type: term
- Identifier: variants.attributes.color-code
- Label: Color Code
- Key: variants.attributes.color-code
- Selected: No
1:
- Type: term
- Identifier: variants.attributes.finish-code
- Label: Finish Color Code
- Key: variants.attributes.finish-code
- Selected: No
2:
- Type: term
- Identifier: variants.attributes.size
- Label: Size
- Key: variants.attributes.size
- Selected: No
3:
- Type: range
- Identifier: variants.prices
- Key: variants.prices
- Min: 0
- Max: 9007199254740991
- Selected: No
4:
- Type: term
- Identifier: variants.attributes.search-color
- Label: Search Color
- Key: variants.attributes.search-color
- Selected: No`;

        expect(transformedData).toBe(expectedTransformedData);
      });

      test('transforms arrays of arrays with nested objects, arrays, and basic types as expected', () => {
        const testObj = {
          someOtherProp: 'someOtherProp',
          myArray: [
            [0, 2, 45, 345, undefined],
            [() => 'sdf'],
            [
              {prop1: 'prop1', prop2: 11111},
              {prop1: 'prop1 obj2', prop2: 22222},
              {prop1: 'prop1 obj3', prop2: 33333, someFunc: () => 'hello'},
              {
                prop1: 'prop1 obj4',
                anotherNestedArray: [2, 6, 23, 63, 3, undefined],
                anotherNestedObjArray: [
                  {myProp: 4, myProp2: null, arr: [{prop: true}]},
                ],
              },
            ],
          ],
          matrixArray: [
            [1, 2, 3, 4],
            [1, 2, 3, 4],
            [1, 2, 3, 4],
            [1, 2, 3, 4],
          ],
          anotherProp: 'anotherProp',
        };

        const transformedData = transformToolOutput({
          data: testObj,
          title: 'my data title',
        });
        const expectedTransformedData = `My Data Title:
- Some Other Prop: someOtherProp
- My Array:
0: 0, 2, 45, 345
1: ${emptyArrayTransformValue}
2:
${indent}0:
${indent}- Prop1: prop1
${indent}- Prop2: 11111
${indent}1:
${indent}- Prop1: prop1 obj2
${indent}- Prop2: 22222
${indent}2:
${indent}- Prop1: prop1 obj3
${indent}- Prop2: 33333
${indent}3:
${indent}- Prop1: prop1 obj4
${indent}- Another Nested Array: 2, 6, 23, 63, 3
${indent}- Another Nested Obj Array:
${indent}${indent}0:
${indent}${indent}- My Prop: 4
${indent}${indent}- My Prop2: null
${indent}${indent}- Arr:
${indent}${indent}${indent}0:
${indent}${indent}${indent}- Prop: Yes
- Matrix Array:
0: 1, 2, 3, 4
1: 1, 2, 3, 4
2: 1, 2, 3, 4
3: 1, 2, 3, 4
- Another Prop: anotherProp`;

        expect(transformedData).toBe(expectedTransformedData);
      });

      test('transforms objects with nested objects and arrays as expected', () => {
        const testObj = {
          myString: 'myString',
          myBool: true,
          myObject: {
            myNestedString: 'myNestedString',
            myNestedBool: false,
            myNestedObj: {
              myNestedObjString: 'myNestedObjString',
              myNestedNestedObj: {myNestedNestedObjBool: true, func: () => {}},
            },
            myNestedEmptyObject: {},
            myNestedObjectWithOnlyIgnoredTypes: {
              und: undefined,
              func: () => {},
            },
          },
        };

        const transformedData = transformToolOutput({
          title: 'Title of data',
          data: testObj,
        });
        const expectedTransformedData = `Title Of Data:
- My String: myString
- My Bool: Yes
- My Object:
${indent}- My Nested String: myNestedString
${indent}- My Nested Bool: No
${indent}- My Nested Obj:
${indent}${indent}- My Nested Obj String: myNestedObjString
${indent}${indent}- My Nested Nested Obj:
${indent}${indent}${indent}- My Nested Nested Obj Bool: Yes
${indent}- My Nested Empty Object: no properties
${indent}- My Nested Object With Only Ignored Types: no properties`;

        expect(transformedData).toBe(expectedTransformedData);
      });
    });

    describe('format: JSON', () => {
      // TODO
    });
  });
});
