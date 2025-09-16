import {transformData} from '../../modelcontextprotocol/transform';
import {complexObject} from './transform.mock-data';

const emptyObjectTransformValue = 'no properties';
const emptyArrayTransformValue = 'none';

describe('transform', () => {
  describe('transformPropertyName', () => {
    test('transforms camel case property names as expected', () => {
      const camelCase = {propertyName: 'camelCase'};
      const expectedOutput = 'Property Name: camelCase';
      const actualOutput = transformData({data: camelCase});
      expect(actualOutput).toBe(expectedOutput);
    });

    test('transforms camel case property names with acronyms as expected', () => {
      const camelCaseWithAronym = {propertyNameSDK: 'camelCaseWithAronym'};
      const expectedOutput = 'Property Name SDK: camelCaseWithAronym';
      const actualOutput = transformData({data: camelCaseWithAronym});
      expect(actualOutput).toBe(expectedOutput);
    });

    test('transforms snake case property names as expected', () => {
      const snakeCase = {propertyName: 'snakeCase'};
      const expectedOutput = 'Property Name: snakeCase';
      const actualOutput = transformData({data: snakeCase});
      expect(actualOutput).toBe(expectedOutput);
    });

    test('transforms snake case property names with acronyms as expected', () => {
      const snakeCaseWithAronym = {property_name_SDK: 'snakeCaseWithAronym'};
      const expectedOutput = 'Property Name SDK: snakeCaseWithAronym';
      const actualOutput = transformData({data: snakeCaseWithAronym});
      expect(actualOutput).toBe(expectedOutput);
    });

    test('transforms kebab case property names as expected', () => {
      const kebabCase = {'property-name': 'kebabCase'};
      const expectedOutput = 'Property Name: kebabCase';
      const actualOutput = transformData({data: kebabCase});
      expect(actualOutput).toBe(expectedOutput);
    });

    test('transforms kebab case property names with acronyms as expected', () => {
      const kebabCaseWithAronym = {'property-name-SDK': 'kebabCaseWithAronym'};
      const expectedOutput = 'Property Name SDK: kebabCaseWithAronym';
      const actualOutput = transformData({data: kebabCaseWithAronym});
      expect(actualOutput).toBe(expectedOutput);
    });

    test('transforms pascal case property names as expected', () => {
      const pascalCase = {PropertyName: 'pascalCase'};
      const expectedOutput = 'Property Name: pascalCase';
      const actualOutput = transformData({data: pascalCase});
      expect(actualOutput).toBe(expectedOutput);
    });

    test('transforms pascal case property names with acronyms as expected', () => {
      const pascalCaseWithAronym = {PropertyNameSDK: 'pascalCaseWithAronym'};
      const expectedOutput = 'Property Name SDK: pascalCaseWithAronym';
      const actualOutput = transformData({data: pascalCaseWithAronym});
      expect(actualOutput).toBe(expectedOutput);
    });

    test('transforms unusual property name casings as expected', () => {
      let unusualCasing: Record<string, string> = {
        '_Unusual-Case_SDK': '_Unusual-Case_SDK',
      };
      let expectedOutput = 'Unusual Case SDK: _Unusual-Case_SDK';
      let actualOutput = transformData({data: unusualCasing});
      expect(actualOutput).toBe(expectedOutput);

      unusualCasing = {'_unusualCase-_-234SDK': '_unusualCase-_-234SDK'};
      expectedOutput = 'Unusual Case 234 SDK: _unusualCase-_-234SDK';
      actualOutput = transformData({data: unusualCasing});
      expect(actualOutput).toBe(expectedOutput);
    });

    test('transforms edge case property names as expected', () => {
      const edgeCase = {' edge  Case ': ' edge  Case '};
      const expectedOutput = 'Edge Case:  edge  Case ';
      const actualOutput = transformData({data: edgeCase});
      expect(actualOutput).toBe(expectedOutput);
    });

    test('removes and handles duplicated property names after transformation', () => {
      const testObj = {
        testNull: null,
      };

      const transformedData = transformData({data: testObj});
      const expectedTransformedData = `TODO`;

      // TODO
      // expect(transformedData).toBe(expectedTransformedData);
    });
  });

  describe('transformData', () => {
    test('ignores undefined values', () => {
      let testObj: Record<string, any> = {
        testUndefined1: undefined,
        testUndefined2: undefined,
      };

      let transformedData = transformData({data: testObj});
      let expectedTransformedData = ``;

      expect(transformedData).toBe(expectedTransformedData);

      testObj = {
        testUndefined1: undefined,
        testUndefined2: undefined,
        testVal: 'string',
      };

      transformedData = transformData({data: testObj});
      expectedTransformedData = `Test Val: string`;

      expect(transformedData).toBe(expectedTransformedData);
    });

    test('ignores function values', () => {
      let testObj: Record<string, any> = {
        testfunction: () => 'function',
      };

      let transformedData = transformData({data: testObj});
      let expectedTransformedData = ``;

      expect(transformedData).toBe(expectedTransformedData);

      testObj = {
        testfunction: () => 'function',
        testVal: 'string',
      };

      transformedData = transformData({data: testObj});
      expectedTransformedData = `Test Val: string`;

      expect(transformedData).toBe(expectedTransformedData);
    });

    test('transforms null values to key value pair with null as the value', () => {
      const testObj = {
        testNull: null,
        testNull2: null,
      };

      const transformedData = transformData({data: testObj});
      const expectedTransformedData = `Test Null: null\nTest Null2: null`;

      expect(transformedData).toBe(expectedTransformedData);
    });

    test('transforms boolean type values to key/value pair with Yes/No values', () => {
      const testObj = {
        testBool1: true,
        testBool2: false,
      };

      const transformedData = transformData({data: testObj});
      const expectedTransformedData = `Test Bool1: Yes\nTest Bool2: No`;

      expect(transformedData).toBe(expectedTransformedData);
    });

    test('transforms boolean type values to Yes/No in nested objects and arrays', () => {
      const testObj = {
        nest: {
          testBool1: false,
          testBool2: true,
          nest2: {
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
      const transformedData = transformData({data: testObj});

      const expectedTransformedData = `Nest:
- Test Bool1: No
- Test Bool2: Yes
- Nest2:
 - Test Bool2: Yes
 - Array1: Yes, No, string, No
 - Array2:
  - 0:
   - Test Bool1: Yes
   - Test Bool2: No`;

      console.log(transformedData);
      expect(transformedData).toBe(expectedTransformedData);
    });

    test('transforms empty string values to key/value pair with "" as value', () => {
      const testObj = {
        testString1: '',
        testString2: '',
      };

      const transformedData = transformData({data: testObj});
      const expectedTransformedData = `Test String1: ""\nTest String2: ""`;

      expect(transformedData).toBe(expectedTransformedData);
    });

    test('transforms string type values to key/value pair', () => {
      const testObj = {
        testString1: 'Test string one',
        testString2: '2nd test string',
      };

      const transformedData = transformData({data: testObj});
      const expectedTransformedData = `Test String1: Test string one\nTest String2: 2nd test string`;

      expect(transformedData).toBe(expectedTransformedData);
    });

    test('transforms number type values to key/value pair', () => {
      const testObj = {
        testNumber1: 360,
        testNumber2: 0.2342,
      };

      const transformedData = transformData({data: testObj});
      const expectedTransformedData = `Test Number1: 360\nTest Number2: 0.2342`;

      expect(transformedData).toBe(expectedTransformedData);
    });

    test('transforms bigint type values to key/value pair', () => {
      const testObj = {
        testBigInt1: 9007199254740991n,
        testBigInt2: BigInt('0o377777777777777777'),
      };

      const transformedData = transformData({data: testObj});
      const expectedTransformedData = `Test Big Int1: 9007199254740991\nTest Big Int2: 9007199254740991`;

      expect(transformedData).toBe(expectedTransformedData);
    });

    test('transforms NaN and infinity values to key/value pair with expected values', () => {
      const testObj = {
        testNaN: NaN,
        testInfinity: Infinity,
        testNegativeInfinity: -Infinity,
      };

      const transformedData = transformData({data: testObj});
      const expectedTransformedData = `Test Na N: NaN\nTest Infinity: Infinity\nTest Negative Infinity: -Infinity`;

      expect(transformedData).toBe(expectedTransformedData);
    });

    test(`transforms empty arrays to key/value pair with "${emptyArrayTransformValue}" as value`, () => {
      const testObj = {
        testEmptyArray: [],
      };

      const transformedData = transformData({data: testObj});
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

      const transformedData = transformData({data: testObj});
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

      const transformedData = transformData({data: testObj});
      const expectedTransformedData = `Array Of Inconsistent Types:
0: No
1:
- Different Name String Prop: differentNameStringProp
- Different Name Bool Prop: No
2: some string
3: null
4:
 0: Yes
 1: test
 2:
  0: Yes
  1:
  - Prop: string
 3:
 - Some Prop: What's a data structure?
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

      const transformedData = transformData({data: testObj});
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

      let transformedData = transformData({data: testObj});
      let expectedTransformedData = `Empty Object: ${emptyObjectTransformValue}`;

      expect(transformedData).toBe(expectedTransformedData);

      testObj = {
        objectWithOnlyUndefined: {
          undefinedValue: undefined,
        },
      };

      transformedData = transformData({data: testObj});
      expectedTransformedData = `Object With Only Undefined: ${emptyObjectTransformValue}`;

      expect(transformedData).toBe(expectedTransformedData);

      testObj = {
        objectWithOnlyFunctions: {
          functionValue: () => {
            return '';
          },
        },
      };

      transformedData = transformData({data: testObj});
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

      const transformedData = transformData({data: testObj});
      const expectedTransformedData = `Customer:
- Customer Id: 12345
- First Name: Example
- Last Name: Name
- Email: example.name@example.com
- Is Active: Yes`;

      expect(transformedData).toBe(expectedTransformedData);
    });

    describe('format: tables', () => {
      test('transforms arrays of objects with consistent property names and without nested objects or arrays as expected', () => {
        let facets = complexObject.facets;
        // delete array parameters within array
        facets.forEach((facet) => {
          delete facet.terms;
        });
        const testObj = {
          facets: facets,
        };

        const transformedData = transformData({data: testObj});
        const expectedTransformedData = `Facets:
|Type|Identifier|Label|Key|Selected|Min|Max|
|---|---|---|---|---|---|---|
|term|variants.attributes.color-code|Color Code|variants.attributes.color-code|No|---|---|
|term|variants.attributes.finish-code|Finish Color Code|variants.attributes.finish-code|No|---|---|
|term|variants.attributes.size|Size|variants.attributes.size|No|---|---|
|range|variants.prices|---|variants.prices|No|0|9007199254740991|
|term|variants.attributes.search-color|Search Color|variants.attributes.search-color|No|---|---|`;

        expect(transformedData).toBe(expectedTransformedData);
      });

      test('transforms arrays of arrays as expected', () => {
        const testObj = {
          facets: complexObject.facets,
        };

        const transformedData = transformData({data: testObj});
        const expectedTransformedData = `Facets: TODO`;

        // TODO
        // expect(transformedData).toBe(expectedTransformedData);
      });

      test('transforms objects with nested objects and arrays as expected', () => {
        const testObj = complexObject;

        const transformedData = transformData({data: testObj});
        const expectedTransformedData = `TODO`;

        // TODO
        // console.log(transformedData);
        // expect(transformedData).toBe(expectedTransformedData);
      });
    });

    describe('format: tabular', () => {
      test('transforms arrays of objects with consistent property names and without nested objects or arrays as expected', () => {
        let facets = complexObject.facets;
        // delete array parameters within array
        facets.forEach((facet) => {
          delete facet.terms;
        });
        const testObj = {
          facets: facets,
        };

        const transformedData = transformData({
          data: testObj,
          format: 'tabular',
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

        const transformedData = transformData({
          data: testObj,
          title: 'my data title',
          format: 'tabular',
        });
        const expectedTransformedData = `My Data Title:
- Some Other Prop: someOtherProp
- My Array:
0: 0, 2, 45, 345
1: ${emptyArrayTransformValue}
2:
 0:
 - Prop1: prop1
 - Prop2: 11111
 1:
 - Prop1: prop1 obj2
 - Prop2: 22222
 2:
 - Prop1: prop1 obj3
 - Prop2: 33333
 3:
 - Prop1: prop1 obj4
 - Another Nested Array: 2, 6, 23, 63, 3
 - Another Nested Obj Array:
  0:
  - My Prop: 4
  - My Prop2: null
  - Arr:
   0:
   - Prop: Yes
- Matrix Array:
0: 1, 2, 3, 4
1: 1, 2, 3, 4
2: 1, 2, 3, 4
3: 1, 2, 3, 4
- Another Prop: anotherProp`;

        console.log(transformedData);
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

        const transformedData = transformData({
          title: 'Title of data',
          data: testObj,
          format: 'tabular',
        });
        const expectedTransformedData = `Title Of Data:
- My String: myString
- My Bool: Yes
- My Object:
 - My Nested String: myNestedString
 - My Nested Bool: No
 - My Nested Obj:
  - My Nested Obj String: myNestedObjString
  - My Nested Nested Obj:
   - My Nested Nested Obj Bool: Yes
 - My Nested Empty Object: no properties
 - My Nested Object With Only Ignored Types: no properties`;

        expect(transformedData).toBe(expectedTransformedData);
      });
    });
  });
});
