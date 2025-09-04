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
  let transformedData = key ? `${key}\n` : '';
  Object.keys(data).forEach((key) => {
    const transformedValue = transformPropertyValue(data[key]);
    if (transformedValue !== null) {
      transformedData += `${transformPropertyName(key)}: ${transformPropertyValue(data[key])}\n`;
    }
  });

  return transformedData;
};

const transformPropertyValue = (data: any): string | null => {
  switch (typeof data) {
    case 'undefined':
    case 'function': {
      return null;
    }
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
      if (Object.keys(data).length === 0) {
        // handle empty object
        return emptyObjectTransformValue;
      }
      // TODO handle full object and rest
      // TODO check object isn't empty after transformation
    }
    default:
      return '';
  }
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
      return newValue !== null
        ? aggregate
          ? `${aggregate}, ${newValue}`
          : newValue
        : aggregate;
    }, '');
    // return array
    //   .map((item) => transformPropertyValue(item))
    //   .filter((value) => value !== null)
    //   .join(', ');
  } else {
    // TODO handle complex arrays
    throw new Error('Not yet implemented');
  }
};

const transformPropertyName = (propertyName: string): string => {
  //handle snake_case and kebab-case and _others
  propertyName = propertyName.replaceAll(/[_-]+/g, ' ').trim();
  // start new property name with capitalised first letter
  let newPropertyName = propertyName.charAt(0).toLocaleUpperCase();
  // handle PascalCase and camelCase
  for (let n = 1; n < propertyName.length; n++) {
    let char = propertyName.charAt(n);
    if (char === char.toLowerCase()) {
      // if lower case
      if (propertyName.charAt(n - 1) === ' ') {
        // upper case letter if space precedes
        if (char !== ' ') {
          newPropertyName += char.toUpperCase();
        }
      } else {
        newPropertyName += char;
      }
    } else {
      // is upper case
      if (propertyName.charAt(n - 1) !== ' ') {
        newPropertyName += ' ';
      }
      newPropertyName += char;
      let i = 1;
      let nextChar = propertyName.charAt(n + i);
      if (nextChar !== nextChar.toLowerCase()) {
        // handle acronym
        do {
          nextChar = propertyName.charAt(n + i);
          if (nextChar !== nextChar.toLowerCase()) {
            newPropertyName += nextChar;
            //i++;
            n++;
          }
        } while (nextChar !== nextChar.toLowerCase());
      }
    }
  }
  return newPropertyName;
};
