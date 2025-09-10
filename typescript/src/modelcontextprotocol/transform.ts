const emptyObjectTransformValue = 'no properties';
const emptyArrayTransformValue = 'none';

type Format = 'tables' | 'tabular';

const incrementIndent = (indent: string) => indent + ' ';

export const transformData = (args: {
  data: Record<string, unknown>;
  key?: string;
  format?: Format;
}): string => {
  let {data, key, format} = args;
  format = format ?? 'tables';
  let transformedData = key ? `${key}: \n` : '';

  Object.keys(data).forEach((key) => {
    const transformedValue = transformPropertyValue({
      data: data[key],
      indentSpaces: '',
      format,
    });
    if (transformedValue !== null) {
      transformedData += `${transformPropertyName(key)}:`;
      if (
        (Array.isArray(data[key]) && isArrayWithOnlyBasicTypes(data[key])) ||
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
        return 'null';
      }
      if (Array.isArray(data)) {
        return transformArray({array: data, indentSpaces, format});
      }
      // handle "typical" object
      const transformedObject = transformObject({
        object: data,
        indentSpaces,
        format,
      });
      if (transformedObject === emptyObjectTransformValue) {
        return transformedObject;
      }
      return `\n${transformedObject}`;
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

  let transformedObject = '';

  Object.keys(object).forEach((key) => {
    if (
      typeof object[key] === 'object' &&
      (Array.isArray(object[key]) || object[key] !== null)
    ) {
      // TODO handle collected nestedObjectsAndArrays
      // nested objects and arrays
      transformedObject += `${indentSpaces}- ${transformPropertyName(key)}: ${transformPropertyValue({data: object[key], indentSpaces: incrementIndent(indentSpaces), format})}\n`;
    } else {
      // basic type
      if (!isPropertyTypeToBeIgnored(object[key])) {
        transformedObject += `${indentSpaces}- ${transformPropertyName(key)}: ${transformPropertyValue({data: object[key], indentSpaces, format})}\n`;
      }
    }
  });

  return transformedObject !== ''
    ? transformedObject.substring(0, transformedObject.length - 1)
    : emptyObjectTransformValue;
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
  const isBasicArray = isArrayWithOnlyBasicTypes(array);

  // if array is of basic types only, format and return
  if (isBasicArray) {
    return array.reduce((aggregate, currentItem) => {
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
  }

  const arrayConsistencyEval = evaluateObjectArrayConsistency(array);
  if (
    arrayConsistencyEval !== null &&
    isArrayWithConsistentObjectProperties(arrayConsistencyEval)
  ) {
    // handle array of consistent objects
    const propertyNames = arrayConsistencyEval.map(
      (arrayEval) => arrayEval.propName
    );
    return transformArrayOfConsistentObjectTypes({
      array,
      propertyNames,
      indentSpaces,
      format,
    });
  }

  if (isArrayOfArrays(array)) {
    // TODO handle array of arrays
  }

  // if no prior conditions are met, handle remaining arrays with inconsistent property
  // types and arrays of objects with inconsistent property names
  return transformInconsistentArrays({array, indentSpaces, format});
};

const transformArrayOfConsistentObjectTypes = (args: {
  array: Record<string, any>[];
  propertyNames: string[];
  indentSpaces: string;
  format: Format;
}): string => {
  const {array, propertyNames, indentSpaces, format} = args;
  if (format === 'tables') {
    return transformArrayOfConsistentObjectTypesToTables({
      array,
      propertyNames,
      indentSpaces,
      format,
    });
  }
  return transformArrayOfConsistentObjectTypesToTabular({
    array,
    propertyNames,
    indentSpaces,
    format,
  });
};

const transformArrayOfConsistentObjectTypesToTables = (args: {
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
      if (typeof element[propName] === 'object' && element[propName] !== null) {
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

const transformArrayOfConsistentObjectTypesToTabular = (args: {
  array: Record<string, any>[];
  propertyNames: string[];
  indentSpaces: string;
  format: Format;
}): string => {
  const {array, propertyNames, indentSpaces, format} = args;
  // TODO
  return 'Not yet implemented';
};

const transformInconsistentArrays = (args: {
  array: Array<any>;
  indentSpaces: string;
  format: Format;
}): string => {
  const {array, indentSpaces, format} = args;

  const transformedArray = array.reduce((aggregate, currentvalue) => {
    let stringValue = `\n${indentSpaces + aggregate.length}:`;
    if (
      currentvalue === null ||
      typeof currentvalue !== 'object' ||
      (Array.isArray(currentvalue) && isArrayWithOnlyBasicTypes(currentvalue))
    ) {
      stringValue += ' ';
    }
    if (Array.isArray(currentvalue)) {
      stringValue += transformArray({
        array: currentvalue,
        indentSpaces: incrementIndent(indentSpaces),
        format,
      });
    } else {
      const transformedValue = transformPropertyValue({
        data: currentvalue,
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

const isArrayWithOnlyBasicTypes = (
  array: Array<Record<string, any>>
): boolean => {
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
  return !isArrayWithObjectsOrArrays;
};

const evaluateObjectArrayConsistency = (
  array: Array<Record<string, any>>
): {propName: string; numberOfOccurances: number}[] | null => {
  if (array.length === 1 && typeof array[0] === 'object' && array[0] !== null) {
    return Object.keys(array).map((key) => ({
      propName: key,
      numberOfOccurances: 1,
    }));
  }
  const propertyOccurances: {propName: string; numberOfOccurances: number}[] =
    [];

  for (let n = 0; n < array.length; n++) {
    // if any element is not an object, return null
    if (typeof array[n] !== 'object' || array[n] === null) {
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

const isArrayWithConsistentObjectProperties = (
  propertyOccurances: {propName: string; numberOfOccurances: number}[] | null
): boolean => {
  // TODO reevaluate this criteria before submission
  // return true if more than half of the properties have more than a single occurance
  if (propertyOccurances === null || propertyOccurances.length === 0) {
    return false;
  }
  return (
    propertyOccurances.filter((prop) => prop.numberOfOccurances === 1).length <
    propertyOccurances.length / 2
  );
};

const isArrayOfArrays = (array: Array<Record<string, any>>): boolean => {
  let hasValuesOtherThanArrays = false;
  for (let n = 0; n < array.length; n++) {
    if (!Array.isArray(array[n])) {
      hasValuesOtherThanArrays = true;
      n = array.length;
    }
  }
  return hasValuesOtherThanArrays;
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
