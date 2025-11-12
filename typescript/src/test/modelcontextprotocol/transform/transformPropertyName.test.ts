import {transformPropertyName} from '../../../modelcontextprotocol/transform/transformPropertyName';

describe('transformPropertyName', () => {
  test('transforms camel case property names as expected', () => {
    const input = 'propertyName';
    const expectedOutput = 'Property Name';
    const actualOutput = transformPropertyName(input);
    expect(actualOutput).toBe(expectedOutput);
  });

  test('transforms camel case property names with acronyms as expected', () => {
    const input = 'propertyNameSDK';
    const expectedOutput = 'Property Name SDK';
    const actualOutput = transformPropertyName(input);
    expect(actualOutput).toBe(expectedOutput);
  });

  test('transforms snake case property names as expected', () => {
    const input = 'property_name';
    const expectedOutput = 'Property Name';
    const actualOutput = transformPropertyName(input);
    expect(actualOutput).toBe(expectedOutput);
  });

  test('transforms snake case property names with acronyms as expected', () => {
    const input = 'property_name_SDK';
    const expectedOutput = 'Property Name SDK';
    const actualOutput = transformPropertyName(input);
    expect(actualOutput).toBe(expectedOutput);
  });

  test('transforms kebab case property names as expected', () => {
    const input = 'property-name';
    const expectedOutput = 'Property Name';
    const actualOutput = transformPropertyName(input);
    expect(actualOutput).toBe(expectedOutput);
  });

  test('transforms kebab case property names with acronyms as expected', () => {
    const input = 'property-name-SDK';
    const expectedOutput = 'Property Name SDK';
    const actualOutput = transformPropertyName(input);
    expect(actualOutput).toBe(expectedOutput);
  });

  test('transforms pascal case property names as expected', () => {
    const input = 'PropertyName';
    const expectedOutput = 'Property Name';
    const actualOutput = transformPropertyName(input);
    expect(actualOutput).toBe(expectedOutput);
  });

  test('transforms pascal case property names with acronyms as expected', () => {
    const input = 'PropertyNameSDK';
    const expectedOutput = 'Property Name SDK';
    const actualOutput = transformPropertyName(input);
    expect(actualOutput).toBe(expectedOutput);
  });

  test('transforms unusual property name casings as expected', () => {
    const input = '_Unusual-Case_SDK';
    const expectedOutput = 'Unusual Case SDK';
    const actualOutput = transformPropertyName(input);
    expect(actualOutput).toBe(expectedOutput);
  });

  test('transforms unusual property name casings with numbers as expected', () => {
    const input = '_unusualCase-_-234SDK';
    const expectedOutput = 'Unusual Case 234 SDK';
    const actualOutput = transformPropertyName(input);
    expect(actualOutput).toBe(expectedOutput);
  });

  test('transforms edge case property names as expected', () => {
    const input = ' edge  Case ';
    const expectedOutput = 'Edge Case';
    const actualOutput = transformPropertyName(input);
    expect(actualOutput).toBe(expectedOutput);
  });
});
