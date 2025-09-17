const emptyObjectTransformValue = 'no properties';
const emptyArrayTransformValue = 'none';

type Format = 'tabled' | 'tabular';

const incrementIndent = (indent: string) => indent + ' ';

export const transformData = (args: {
  data: Record<string, unknown>;
  title?: string;
  format?: Format;
}): string => {
  let {data, title, format} = args;
  format = format ?? 'tabled';
  let transformedData = title ? `${transformPropertyName(title)}:\n` : '';

  Object.keys(data).forEach((key) => {
    const transformedValue = transformPropertyValue({
      data: data[key],
      indentSpaces: '',
      format,
    });
    if (transformedValue !== null) {
      if (title) {
        transformedData += '- ';
      }
      transformedData += `${transformPropertyName(key)}:`;
      if (
        (Array.isArray(data[key]) &&
          isArrayWithoutObjectsOrArrays(data[key])) ||
        typeof data[key] !== 'object' ||
        transformedValue === emptyObjectTransformValue ||
        transformedValue === emptyArrayTransformValue ||
        transformedValue === 'null'
      ) {
        // add a space between the key and value if property type is not array/object, or empty
        // array/object, or array with only basic types
        transformedData += ' ';
      }
      transformedData += `${transformedValue}\n`;
    }
  });

  return transformedData.substring(0, transformedData.length - 1);
};

const transformPropertyValue = (args: {
  data: any;
  indentSpaces: string;
  format: Format;
}): string | null => {
  const {data, indentSpaces, format} = args;
  if (isPropertyTypeToBeIgnored(data)) {
    // check function/undefined
    return null;
  }
  switch (typeof data) {
    case 'string': {
      if (data === '') {
        return '""';
      }
      return data;
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
        return transformArray({array: data, indentSpaces, format});
      }
      // handle object/Record<string, any> (remaining possible condition)
      return transformObject({
        object: data,
        indentSpaces: indentSpaces,
        format,
      });
    }
    default:
      return null;
  }
};

const transformObject = (args: {
  object: Record<string, any>;
  indentSpaces: string;
  format: Format;
}): string => {
  const {object, indentSpaces, format} = args;
  if (Object.keys(object).length === 0) {
    // handle empty object
    return emptyObjectTransformValue;
  }

  let transformedObject = '\n';

  Object.keys(object).forEach((key) => {
    if (isObject(object[key]) || Array.isArray(object[key])) {
      if (isObject(object[key])) {
        // handle object properties
        const transformedObjectValue = transformObject({
          object: object[key],
          indentSpaces: incrementIndent(indentSpaces),
          format,
        });
        transformedObject += `${indentSpaces}- ${transformPropertyName(key)}:`;
        if (transformedObjectValue === emptyObjectTransformValue) {
          transformedObject += ' ';
        }
        transformedObject += `${transformedObjectValue}\n`;
      } else {
        // handle arrays
        const isBasicArray = isArrayWithoutObjectsOrArrays(object[key]);
        transformedObject += `${indentSpaces}- ${transformPropertyName(key)}:`;

        if (isBasicArray) {
          // add a space between key and value for nested basic arrays
          transformedObject += ' ';
        }
        // handle arrays/objects
        transformedObject +=
          transformArray({
            array: object[key],
            indentSpaces: isBasicArray
              ? indentSpaces
              : incrementIndent(indentSpaces),
            format,
          }) + '\n';
      }
    } else {
      // handle basic types
      if (!isPropertyTypeToBeIgnored(object[key])) {
        transformedObject +=
          `${indentSpaces}- ${transformPropertyName(key)}: ` +
          `${transformPropertyValue({data: object[key], indentSpaces, format})}\n`;
      }
    }
  });
  // if nothing was added to '\n' starting string then object had only properties which are ignored,
  // so return emptyObjectTransformValue. Otherwise return the transformed object with the
  // last \n removed
  return transformedObject === '\n'
    ? emptyObjectTransformValue
    : transformedObject.substring(0, transformedObject.length - 1);
};

const transformArray = (args: {
  array: Array<any>;
  indentSpaces: string;
  commaSeperated?: boolean;
  format: Format;
}): string => {
  let {array, indentSpaces, commaSeperated, format} = args;
  commaSeperated = commaSeperated ?? true;
  if (array.length === 0) {
    return emptyArrayTransformValue;
  }

  // if array is of basic types only, comma seperate and return as single line formatted string
  if (isArrayWithoutObjectsOrArrays(array)) {
    const transformedArray = array.reduce((aggregate, currentItem) => {
      if (isPropertyTypeToBeIgnored(currentItem)) {
        return aggregate;
      }
      const newValue = transformPropertyValue({
        data: currentItem,
        indentSpaces,
        format,
      });
      if (!aggregate) {
        return newValue;
      }
      return `${aggregate}${commaSeperated ? ', ' : ''}${newValue}`;
    }, '');

    return transformedArray ? transformedArray : emptyArrayTransformValue;
  }

  const propertyQuantities = seperatePropertyQuantitiesWithinObjectArray(array);
  if (
    propertyQuantities !== null &&
    isArrayWithConsistentObjectProperties(propertyQuantities)
  ) {
    // handle array of consistent objects
    const propertyNames = propertyQuantities.map(
      (arrayEval) => arrayEval.propName
    );
    return transformArrayOfConsistentObjectTypes({
      array,
      propertyNames,
      indentSpaces,
      format,
    });
  }

  if (isArrayOfArrays(array) && format === 'tabled') {
    // TODO handle array of arrays for tabled format
  }

  // If no prior conditions are met, this leaves arrays of arrays, and arrays with
  // inconsistent contents. These are handled the same way, as this inconsistency is
  // incompatible with tabled format
  return transformArraysOfArraysAndObjectsToTabular({
    array,
    indentSpaces,
    format,
  });
};

const transformArrayOfConsistentObjectTypes = (args: {
  array: Record<string, any>[];
  propertyNames: string[];
  indentSpaces: string;
  format: Format;
}): string => {
  const {array, propertyNames, indentSpaces, format} = args;
  if (format === 'tabled') {
    return transformArrayOfConsistentObjectTypesToTabled({
      array,
      propertyNames,
      indentSpaces,
      format,
    });
  }
  // object/array consistency isn't important in tabular format
  return transformArraysOfArraysAndObjectsToTabular({
    array,
    indentSpaces,
    format,
  });
};

const transformArrayOfConsistentObjectTypesToTabled = (args: {
  array: Record<string, any>[];
  propertyNames: string[];
  indentSpaces: string;
  format: Format;
}): string => {
  const {array, propertyNames, indentSpaces, format} = args;
  let aggregatedArrayString = '\n|';

  propertyNames.forEach((propName) => {
    aggregatedArrayString += `${transformPropertyName(propName)}|`;
  });
  aggregatedArrayString += '\n|';
  for (let n = 0; n < propertyNames.length; n++) {
    aggregatedArrayString += '---|';
  }
  array.forEach((element) => {
    aggregatedArrayString += `\n|`;
    propertyNames.forEach((propName) => {
      if (isObject(element[propName])) {
        // TODO handle nested object/array
        aggregatedArrayString += `OBJECT OR ARRAY|`;
      } else {
        const transformedPropertyValue = transformPropertyValue({
          data: element[propName],
          indentSpaces,
          format,
        });
        aggregatedArrayString += `${transformedPropertyValue === null ? '---' : transformedPropertyValue}|`;
      }
    });
  });
  return aggregatedArrayString;
};

const transformArraysOfArraysAndObjectsToTabular = (args: {
  array: Array<any>;
  indentSpaces: string;
  format: Format;
}): string => {
  const {array, indentSpaces, format} = args;

  const transformedArray = array.reduce((aggregate, currentValue) => {
    let stringValue = `\n${indentSpaces + aggregate.length}:`;

    if (
      (!isObject(currentValue) && !Array.isArray(currentValue)) ||
      (Array.isArray(currentValue) &&
        isArrayWithoutObjectsOrArrays(currentValue))
    ) {
      stringValue += ' ';
    }

    if (Array.isArray(currentValue)) {
      stringValue += transformArray({
        array: currentValue,
        indentSpaces: incrementIndent(indentSpaces),
        format,
      });
    } else {
      const transformedValue = transformPropertyValue({
        data: currentValue,
        indentSpaces,
        format,
      });
      if (transformedValue === null) {
        return aggregate;
      }
      stringValue += transformedValue;
    }
    aggregate.push(stringValue);
    return aggregate;
  }, [] as string[]);

  return transformArray({
    array: transformedArray,
    indentSpaces,
    commaSeperated: false,
    format,
  });
};

const seperatePropertyQuantitiesWithinObjectArray = (
  array: Array<Record<string, any>>
): {propName: string; numberOfOccurances: number}[] | null => {
  if (array.length === 1 && isObject(array[0])) {
    return Object.keys(array[0]).map((key) => ({
      propName: key,
      numberOfOccurances: 1,
    }));
  }
  const propertyOccurances: {propName: string; numberOfOccurances: number}[] =
    [];

  for (let n = 0; n < array.length; n++) {
    // if any element is not an object, return null
    if (!isObject(array[n])) {
      n = array.length;
      return null;
    }

    Object.keys(array[n]).forEach((key) => {
      let index = propertyOccurances.findIndex((prop) => prop.propName === key);
      if (index === -1) {
        propertyOccurances.push({propName: key, numberOfOccurances: 1});
      } else {
        propertyOccurances[index].numberOfOccurances += 1;
      }
    });
  }

  return propertyOccurances;
};

// TODO reevaluate this criteria before submission, currently returns true if more
// than half of the properties have more than a single occurance or array length of 1
const isArrayWithConsistentObjectProperties = (
  propertyOccurances: {propName: string; numberOfOccurances: number}[] | null
): boolean => {
  if (propertyOccurances === null || propertyOccurances.length === 0) {
    return false;
  }
  if (propertyOccurances.length === 1) {
    return true;
  }
  return (
    propertyOccurances.filter((prop) => prop.numberOfOccurances === 1).length <
    propertyOccurances.length / 2
  );
};

const isArrayOfArrays = (array: Array<Record<string, any>>): boolean => {
  if (array?.length === 0) {
    return false;
  }
  let isArrayArray = true;
  for (let n = 0; n < array.length; n++) {
    if (!Array.isArray(array[n])) {
      isArrayArray = false;
      n = array.length;
    }
  }
  return isArrayArray;
};

const isArrayWithoutObjectsOrArrays = (
  array: Array<Record<string, any>>
): boolean => {
  if (array?.length === 0) {
    return true;
  }
  let hasNoObjectsOrArrays = true;
  for (let n = 0; n < array.length; n++) {
    if (isObject(array[n]) || Array.isArray(array[n])) {
      hasNoObjectsOrArrays = false;
      n = array.length;
    }
  }
  return hasNoObjectsOrArrays;
};

const isObject = (data: any): data is Record<string, any> =>
  typeof data === 'object' && data !== null && !Array.isArray(data);

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
