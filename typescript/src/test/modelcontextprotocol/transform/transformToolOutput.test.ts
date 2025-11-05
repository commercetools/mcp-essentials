import {transformToolOutput} from '../../../modelcontextprotocol/transform';
import {complexObject} from './transform.mock-data';

const emptyObjectTransformValue = 'no properties';
const emptyArrayTransformValue = 'none';
const tab = '\t';

describe('transformToolOutput', () => {
  describe('default', () => {
    test('transforms to tabular format by default', () => {
      let testObj: Record<string, any> = {
        testString: 'test string',
        testObject: {
          testNumber: 35673,
        },
      };

      let transformedData = transformToolOutput({data: testObj});
      let expectedTransformedData = `Test String: ${testObj.testString}\nTest Object:\n${tab}Test Number: ${testObj.testObject.testNumber}`;

      expect(transformedData).toBe(expectedTransformedData);
    });
  });

  describe('format: tabular', () => {
    const format = 'tabular';
    test('ignores undefined values', () => {
      let testObj: Record<string, any> = {
        testUndefined1: undefined,
        testUndefined2: undefined,
      };

      let transformedData = transformToolOutput({data: testObj, format});
      let expectedTransformedData = emptyObjectTransformValue;

      expect(transformedData).toBe(expectedTransformedData);

      testObj = {
        testUndefined1: undefined,
        testUndefined2: undefined,
        testVal: 'string',
      };

      transformedData = transformToolOutput({data: testObj, format});
      expectedTransformedData = `Test Val: string`;

      expect(transformedData).toBe(expectedTransformedData);
    });

    test('ignores function values', () => {
      let testObj: Record<string, any> = {
        testfunction: () => 'function',
      };

      let transformedData = transformToolOutput({data: testObj, format});
      let expectedTransformedData = emptyObjectTransformValue;

      expect(transformedData).toBe(expectedTransformedData);

      testObj = {
        testfunction: () => 'function',
        testVal: 'string',
      };

      transformedData = transformToolOutput({data: testObj, format});
      expectedTransformedData = `Test Val: string`;

      expect(transformedData).toBe(expectedTransformedData);
    });

    test('transforms null values to key value pair with null as the value', () => {
      const testObj = {
        testNull: null,
        testNull2: null,
      };

      const transformedData = transformToolOutput({data: testObj, format});
      const expectedTransformedData = `Test Null: null\nTest Null2: null`;

      expect(transformedData).toBe(expectedTransformedData);
    });

    test('transforms boolean type values to key/value pair with Yes/No values', () => {
      const testObj = {
        testBool1: true,
        testBool2: false,
      };

      const transformedData = transformToolOutput({data: testObj, format});
      const expectedTransformedData = `Test Bool1: Yes\nTest Bool2: No`;

      expect(transformedData).toBe(expectedTransformedData);
    });

    test('indents arrays, objects and nested arrays and objects as expected', () => {
      const title = 'Nested objects and arrays';
      const testObject = {
        l1Object: {
          l2Object: {
            l3Object: {
              l4StringVal: 'my string',
              l4Array: [1, 2, 3],
            },
          },
          l2Object2: {
            l3Array: [
              {
                l4StringVal: 'my string',
                l4Array: [
                  {
                    l5StringVal: 'my string',
                  },
                  {
                    l5StringVal2: 'my string',
                  },
                ],
              },
            ],
          },
        },
        l1Array: [
          {
            l2StringVal: 'my string',
            l2NumberVal: 123,
          },
          {
            l2StringVal: 'my second string',
            l2NumberVal: 321,
          },
        ],
      };

      const expectedTransformedData = `${title.toUpperCase()}
L1 Object:
${tab}L2 Object:
${tab}${tab}L3 Object:
${tab}${tab}${tab}L4 String Val: my string
${tab}${tab}${tab}L4 Array: 1, 2, 3
${tab}L2 Object2:
${tab}${tab}L3 Array:
${tab}${tab}${tab}0:
${tab}${tab}${tab}${tab}L4 String Val: my string
${tab}${tab}${tab}${tab}L4 Array:
${tab}${tab}${tab}${tab}${tab}0:
${tab}${tab}${tab}${tab}${tab}${tab}L5 String Val: my string
${tab}${tab}${tab}${tab}${tab}1:
${tab}${tab}${tab}${tab}${tab}${tab}L5 String Val2: my string
L1 Array:
${tab}0:
${tab}${tab}L2 String Val: my string
${tab}${tab}L2 Number Val: 123
${tab}1:
${tab}${tab}L2 String Val: my second string
${tab}${tab}L2 Number Val: 321`;

      const transformedData = transformToolOutput({
        data: testObject,
        title,
        format,
      });
      expect(transformedData).toBe(expectedTransformedData);
    });

    test('transforms boolean type values to Yes/No in nested objects and arrays', () => {
      const testObj = {
        obj: {
          testBool1: false,
          testBool2: true,
          nestedObj: {
            testBool2: true,
            array1: [true, false, 'string', false],
            objArray: [
              {
                testBool1: true,
                testBool2: false,
              },
              {
                testBool1: false,
                testBool2: true,
              },
            ],
          },
        },
      };
      const transformedData = transformToolOutput({data: testObj, format});

      const expectedTransformedData = `Obj:
${tab}Test Bool1: No
${tab}Test Bool2: Yes
${tab}Nested Obj:
${tab}${tab}Test Bool2: Yes
${tab}${tab}Array1: Yes, No, string, No
${tab}${tab}Obj Array:
${tab}${tab}${tab}0:
${tab}${tab}${tab}${tab}Test Bool1: Yes
${tab}${tab}${tab}${tab}Test Bool2: No
${tab}${tab}${tab}1:
${tab}${tab}${tab}${tab}Test Bool1: No
${tab}${tab}${tab}${tab}Test Bool2: Yes`;

      expect(transformedData).toBe(expectedTransformedData);
    });

    test('transforms empty string values to key/value pair with "" as value', () => {
      const testObj = {
        testString1: '',
        testString2: '',
      };

      const transformedData = transformToolOutput({data: testObj, format});
      const expectedTransformedData = `Test String1: ""\nTest String2: ""`;

      expect(transformedData).toBe(expectedTransformedData);
    });

    test('transforms string type values to key/value pair', () => {
      const testObj = {
        testString1: 'Test string one',
        testString2: '2nd test string',
      };

      const transformedData = transformToolOutput({data: testObj, format});
      const expectedTransformedData = `Test String1: Test string one\nTest String2: 2nd test string`;

      expect(transformedData).toBe(expectedTransformedData);
    });

    test('transforms number type values to key/value pair', () => {
      const testObj = {
        testNumber1: 360,
        testNumber2: 0.2342,
      };

      const transformedData = transformToolOutput({data: testObj, format});
      const expectedTransformedData = `Test Number1: 360\nTest Number2: 0.2342`;

      expect(transformedData).toBe(expectedTransformedData);
    });

    test('transforms bigint type values to key/value pair', () => {
      const testObj = {
        testBigInt1: 9007199254740991n,
        testBigInt2: BigInt('0o377777777777777777'),
      };

      const transformedData = transformToolOutput({data: testObj, format});
      const expectedTransformedData = `Test Big Int1: 9007199254740991\nTest Big Int2: 9007199254740991`;

      expect(transformedData).toBe(expectedTransformedData);
    });

    test('transforms NaN and infinity values to key/value pair with expected values', () => {
      const testObj = {
        testNaN: NaN,
        testInfinity: Infinity,
        testNegativeInfinity: -Infinity,
      };

      const transformedData = transformToolOutput({data: testObj, format});
      const expectedTransformedData = `Test Na N: NaN\nTest Infinity: Infinity\nTest Negative Infinity: -Infinity`;

      expect(transformedData).toBe(expectedTransformedData);
    });

    test(`transforms empty arrays to key/value pair with "${emptyArrayTransformValue}" as value`, () => {
      const testObj = {
        testEmptyArray: [],
      };

      const transformedData = transformToolOutput({data: testObj, format});
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

      const transformedData = transformToolOutput({data: testObj, format});
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

      const transformedData = transformToolOutput({data: testObj, format});
      const expectedTransformedData = `Array Of Inconsistent Types:
${tab}0: No
${tab}1:
${tab}${tab}Different Name String Prop: differentNameStringProp
${tab}${tab}Different Name Bool Prop: No
${tab}2: some string
${tab}3: null
${tab}4:
${tab}${tab}0: Yes
${tab}${tab}1: test
${tab}${tab}2:
${tab}${tab}${tab}0: Yes
${tab}${tab}${tab}1:
${tab}${tab}${tab}${tab}Prop: string
${tab}${tab}3:
${tab}${tab}${tab}Some Prop: What's a data structure?
${tab}5: Some other string`;

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

      const transformedData = transformToolOutput({data: testObj, format});
      const expectedTransformedData = `Array Of Inconsistent Objects:
${tab}0:
${tab}${tab}String Prop: stringProp
${tab}${tab}Bool Prop: Yes
${tab}1:
${tab}${tab}Different Name String Prop: differentNameStringProp
${tab}${tab}Different Name Bool Prop: No
${tab}2:
${tab}${tab}Another Name String Prop: anotherNameStringProp
${tab}${tab}Another Name Bool Prop: Yes`;

      expect(transformedData).toBe(expectedTransformedData);
    });

    test(`transforms properties containing empty objects, or only functions or undefined values to key/value pair with "${emptyObjectTransformValue}" value`, () => {
      let testObj: Record<string, any> = {
        emptyObject: {},
      };

      let transformedData = transformToolOutput({data: testObj, format});
      let expectedTransformedData = `Empty Object: ${emptyObjectTransformValue}`;

      expect(transformedData).toBe(expectedTransformedData);

      testObj = {
        objectWithOnlyUndefined: {
          undefinedValue: undefined,
        },
      };

      transformedData = transformToolOutput({data: testObj, format});
      expectedTransformedData = `Object With Only Undefined: ${emptyObjectTransformValue}`;

      expect(transformedData).toBe(expectedTransformedData);

      testObj = {
        objectWithOnlyFunctions: {
          functionValue: () => {
            return '';
          },
        },
      };

      transformedData = transformToolOutput({data: testObj, format});
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

      const transformedData = transformToolOutput({data: testObj, format});
      const expectedTransformedData = `Customer:
${tab}Customer Id: 12345
${tab}First Name: Example
${tab}Last Name: Name
${tab}Email: example.name@example.com
${tab}Is Active: Yes`;

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
        format,
      });
      const expectedTransformedData = `Facets:
${tab}0:
${tab}${tab}Type: term
${tab}${tab}Identifier: variants.attributes.color-code
${tab}${tab}Label: Color Code
${tab}${tab}Key: variants.attributes.color-code
${tab}${tab}Selected: No
${tab}1:
${tab}${tab}Type: term
${tab}${tab}Identifier: variants.attributes.finish-code
${tab}${tab}Label: Finish Color Code
${tab}${tab}Key: variants.attributes.finish-code
${tab}${tab}Selected: No
${tab}2:
${tab}${tab}Type: term
${tab}${tab}Identifier: variants.attributes.size
${tab}${tab}Label: Size
${tab}${tab}Key: variants.attributes.size
${tab}${tab}Selected: No
${tab}3:
${tab}${tab}Type: range
${tab}${tab}Identifier: variants.prices
${tab}${tab}Key: variants.prices
${tab}${tab}Min: 0
${tab}${tab}Max: 9007199254740991
${tab}${tab}Selected: No
${tab}4:
${tab}${tab}Type: term
${tab}${tab}Identifier: variants.attributes.search-color
${tab}${tab}Label: Search Color
${tab}${tab}Key: variants.attributes.search-color
${tab}${tab}Selected: No`;

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

      const title = 'my data title';
      const transformedData = transformToolOutput({
        data: testObj,
        title,
        format,
      });
      const expectedTransformedData = `${title.toUpperCase()}
Some Other Prop: someOtherProp
My Array:
${tab}0: 0, 2, 45, 345
${tab}1: ${emptyArrayTransformValue}
${tab}2:
${tab}${tab}0:
${tab}${tab}${tab}Prop1: prop1
${tab}${tab}${tab}Prop2: 11111
${tab}${tab}1:
${tab}${tab}${tab}Prop1: prop1 obj2
${tab}${tab}${tab}Prop2: 22222
${tab}${tab}2:
${tab}${tab}${tab}Prop1: prop1 obj3
${tab}${tab}${tab}Prop2: 33333
${tab}${tab}3:
${tab}${tab}${tab}Prop1: prop1 obj4
${tab}${tab}${tab}Another Nested Array: 2, 6, 23, 63, 3
${tab}${tab}${tab}Another Nested Obj Array:
${tab}${tab}${tab}${tab}0:
${tab}${tab}${tab}${tab}${tab}My Prop: 4
${tab}${tab}${tab}${tab}${tab}My Prop2: null
${tab}${tab}${tab}${tab}${tab}Arr:
${tab}${tab}${tab}${tab}${tab}${tab}0:
${tab}${tab}${tab}${tab}${tab}${tab}${tab}Prop: Yes
Matrix Array:
${tab}0: 1, 2, 3, 4
${tab}1: 1, 2, 3, 4
${tab}2: 1, 2, 3, 4
${tab}3: 1, 2, 3, 4
Another Prop: anotherProp`;

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

      const title = 'Title of data';

      const transformedData = transformToolOutput({
        title,
        data: testObj,
        format,
      });
      const expectedTransformedData = `${title.toLocaleUpperCase()}
My String: myString
My Bool: Yes
My Object:
${tab}My Nested String: myNestedString
${tab}My Nested Bool: No
${tab}My Nested Obj:
${tab}${tab}My Nested Obj String: myNestedObjString
${tab}${tab}My Nested Nested Obj:
${tab}${tab}${tab}My Nested Nested Obj Bool: Yes
${tab}My Nested Empty Object: no properties
${tab}My Nested Object With Only Ignored Types: no properties`;

      expect(transformedData).toBe(expectedTransformedData);
    });
  });

  describe('format: json', () => {
    const format = 'json';
    test('returns the data passed stringified into JSON', () => {
      const testObj: Record<string, any> = {
        testString: undefined,
        testObject: {
          testNumber: 3453,
        },
      };

      let transformedData = transformToolOutput({data: testObj, format});
      let expectedTransformedData = JSON.stringify(testObj);

      expect(transformedData).toBe(expectedTransformedData);
    });

    test('when property passed returns the data passed stringified into JSON, in additional object with title property', () => {
      const testObj: Record<string, any> = {
        testString: undefined,
        testObject: {
          testNumber: 3453,
        },
      };

      const title = 'My test object title';

      let transformedData = transformToolOutput({data: testObj, title, format});
      let expectedTransformedData = JSON.stringify({
        [title.toUpperCase()]: testObj,
      });

      expect(transformedData).toBe(expectedTransformedData);
    });
  });
});
