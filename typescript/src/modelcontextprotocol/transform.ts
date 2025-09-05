export const reduceData = <T extends Record<string, unknown>>(
  data: T
): Partial<T> => {
  // TODO
  throw new Error('Not yet implemented.');
};

const emptyObjectTransformValue = 'no properties';
const emptyArrayTransformValue = 'none';

export const transformData = (
  data: Record<string, unknown>,
  key?: string
): string => {
  let transformedData = key ? `${key}: \n` : '';
  Object.keys(data).forEach((key) => {
    const transformedValue = transformPropertyValue(data[key]);
    if (transformedValue !== null) {
      transformedData += `${transformPropertyName(key)}: ${transformPropertyValue(data[key])}\n`;
    }
  });

  return transformedData.substring(0, transformedData.length - 1);
};

const transformPropertyValue = (data: any): string | null => {
  if (isPropertyTypeToBeIgnored(data)) {
    //check function/undefined
    return null;
  }
  switch (typeof data) {
    case 'string': {
      if (data === '') {
        return '""';
      }
      // else fallthough to number/bigint handling
    }
    case 'number':
    case 'bigint': {
      return data.toString();
    }
    case 'boolean': {
      return data ? 'Yes' : 'No';
    }
    case 'object': {
      if (data === null) {
        // handle null
        return 'null';
      }
      if (Array.isArray(data)) {
        // handle array
        return transformArray(data);
      }
      // handle "typical" object
      const transformedObject = transformObject(data);
      if (transformedObject === emptyObjectTransformValue) {
        return transformedObject;
      }
      return `\n${transformedObject}`;
    }
    default:
      return null;
  }
};

const transformObject = (object: Record<string, any>): string => {
  if (Object.keys(object).length === 0) {
    // handle empty object
    return emptyObjectTransformValue;
  }

  let transformedObject = '';
  let nestedObjectsAndArrays: Record<string, any> = {};

  Object.keys(object).forEach((key) => {
    if (
      typeof object[key] === 'object' &&
      (Array.isArray(object[key]) || object[key] !== null)
    ) {
      nestedObjectsAndArrays[key] = object[key];
    } else {
      // basic type
      if (!isPropertyTypeToBeIgnored(object[key])) {
        transformedObject += `- ${transformPropertyName(key)}: ${object[key]}\n`;
      }
    }
  });

  //TODO handle collected nestedObjectsAndArrays

  return transformedObject !== ''
    ? transformedObject.substring(0, transformedObject.length - 1)
    : emptyObjectTransformValue;
};

const transformArray = (array: Array<any>): string => {
  if (array.length === 0) {
    return emptyArrayTransformValue;
  }
  let isArrayWithObjectsOrArrays = false;
  for (let n = 0; n < array.length; n++) {
    if (
      typeof array[n] === 'object' &&
      (Array.isArray(array[n]) || array[n] !== null)
    ) {
      isArrayWithObjectsOrArrays = true;
      n = array.length;
    }
  }

  if (!isArrayWithObjectsOrArrays) {
    return array.reduce((aggregate, currentItem) => {
      const newValue = transformPropertyValue(currentItem);
      if (newValue === null) {
        return aggregate;
      }
      if (!aggregate) {
        return newValue;
      }
      return `${aggregate}, ${newValue}`;
    }, '');
  }

  if (isArrayWithConsistentObjectTypes(array)) {
    // TODO handle array of consistent objects
  }

  if (isArrayOfArrays(array)) {
    // TODO handle array of arrays
  }

  // TODO handle complex/weird arrays
  return '';
};

const isArrayWithConsistentObjectTypes = (
  array: Array<Record<string, any>>
): boolean => {
  // TODO
  throw new Error('Not yet implemented');
};

const isArrayOfArrays = (array: Array<Record<string, any>>): boolean => {
  // TODO
  throw new Error('Not yet implemented');
};

const isPropertyTypeToBeIgnored = (data: any): boolean =>
  typeof data === 'undefined' || typeof data === 'function';

const isUpperCase = (str: string): boolean => str !== str.toLowerCase();

const transformPropertyName = (propertyName: string): string => {
  if (!propertyName) {
    return '';
  }
  //handle snake_case, kebab-case, and _others
  propertyName = propertyName.replaceAll(/[_-]+/g, ' ').trim();
  // start new property name with capitalised first letter
  let newPropertyName = propertyName.charAt(0).toLocaleUpperCase();
  // handle PascalCase and camelCase
  for (let n = 1; n < propertyName.length; n++) {
    let char = propertyName.charAt(n);
    // if lower case
    if (!isUpperCase(char)) {
      // if space precedes current character
      if (propertyName.charAt(n - 1) === ' ') {
        // upper case letter if space precedes
        if (char !== ' ') {
          newPropertyName += char.toUpperCase();
        }
      } else {
        newPropertyName += char;
      }
    } else {
      // else is upper case
      if (propertyName.charAt(n - 1) !== ' ') {
        newPropertyName += ' ';
      }
      newPropertyName += char;
      let i = 1;
      let nextChar = propertyName.charAt(n + i);
      // handle acronym
      if (isUpperCase(nextChar)) {
        do {
          nextChar = propertyName.charAt(n + i);
          if (isUpperCase(nextChar)) {
            newPropertyName += nextChar;
            n++;
          }
        } while (nextChar !== nextChar.toLowerCase());
      }
    }
  }
  return newPropertyName;
};
