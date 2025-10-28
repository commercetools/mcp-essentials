const emptyObjectTransformValue = 'no properties';
const emptyArrayTransformValue = 'none';

type Format = 'tabular' | 'json';

const incrementIndent = (indent: string) => indent + ' ';

/**
 * The method to strigify tool output into a LLM friendly and optimised format.
 *
 * @param {Record<string, unknown>} args.data - The response of a tool's output, in the format of an object.
 * @param {string} [args.title] - An optional string, the title or description to give the data for LLM context.
 * @param {Format} [args.format] - An optional string of either "tabular" or "JSON" defining the format output, default "tabular".
 *
 * @returns {string} The LLM optimised tool string output.
 */
export const transformToolOutput = (args: {
  data: Record<string, unknown>;
  title?: string;
  format?: Format;
}): string => {
  let {format} = args;
  const {data, title} = args;
  if (format === 'json') {
    // if requested format is JSON, simply stringify and return the data
    if (title) {
      return JSON.stringify({[title]: data});
    }
    JSON.stringify(data);
  }

  let transformedData = title ? `${transformPropertyName(title)}:\n` : '';

  Object.keys(data).forEach((key) => {
    const transformedValue = transformPropertyValue({
      data: data[key],
      indentSpaces: '',
      hasTitle: !!title,
    });
    if (transformedValue !== null) {
      if (title) {
        transformedData += '- ';
      }
      transformedData += `${transformPropertyName(key)}:`;
      if (
        typeof data[key] !== 'object' ||
        transformedValue === 'null' ||
        isArrayWithoutObjectsOrArrays(data[key]) ||
        transformedValue === emptyObjectTransformValue ||
        transformedValue === emptyArrayTransformValue
      ) {
        // add a space between the key and value if property type is not object,
        // value is not null, is array with only basic types that'll sit on one
        // line, or an empty object/array - the transform value of which will sit
        // on one line
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
  hasTitle?: boolean;
}): string | null => {
  const {data, indentSpaces, hasTitle} = args;
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
        return transformArray({array: data, indentSpaces});
      }
      // handle object/Record<string, any> (remaining possible condition)
      return transformObject({
        object: data,
        indentSpaces: hasTitle ? ' ' : indentSpaces,
      });
    }
    default:
      return null;
  }
};

const transformObject = (args: {
  object: Record<string, any>;
  indentSpaces: string;
}): string => {
  const {object, indentSpaces} = args;
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
        transformedObject +=
          transformArray({
            array: object[key],
            indentSpaces: isBasicArray
              ? indentSpaces
              : incrementIndent(indentSpaces),
          }) + '\n';
      }
    } else {
      // handle basic types
      if (!isPropertyTypeToBeIgnored(object[key])) {
        transformedObject +=
          `${indentSpaces}- ${transformPropertyName(key)}: ` +
          `${transformPropertyValue({data: object[key], indentSpaces})}\n`;
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
}): string => {
  let {commaSeperated} = args;
  const {array, indentSpaces} = args;
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
      });
      if (!aggregate) {
        return newValue;
      }
      return `${aggregate}${commaSeperated ? ', ' : ''}${newValue}`;
    }, '');

    return transformedArray ? transformedArray : emptyArrayTransformValue;
  }

  return transformArraysOfArraysAndObjectsToTabular({
    array,
    indentSpaces,
  });
};

const transformArraysOfArraysAndObjectsToTabular = (args: {
  array: Array<any>;
  indentSpaces: string;
}): string => {
  const {array, indentSpaces} = args;

  const transformedArray = array.reduce((aggregate, currentValue) => {
    let stringValue = `\n${indentSpaces + aggregate.length}:`;

    if (
      (!isObject(currentValue) && !Array.isArray(currentValue)) ||
      isArrayWithoutObjectsOrArrays(currentValue)
    ) {
      stringValue += ' ';
    }

    if (Array.isArray(currentValue)) {
      stringValue += transformArray({
        array: currentValue,
        indentSpaces: incrementIndent(indentSpaces),
      });
    } else {
      const transformedValue = transformPropertyValue({
        data: currentValue,
        indentSpaces,
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
  });
};

const isArrayWithoutObjectsOrArrays = (data: any): boolean => {
  if (!Array.isArray(data)) {
    return false;
  }
  if (data.length === 0) {
    return true;
  }
  let hasNoObjectsOrArrays = true;
  for (let n = 0; n < data.length; n++) {
    if (isObject(data[n]) || Array.isArray(data[n])) {
      hasNoObjectsOrArrays = false;
      n = data.length;
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
  // handle snake_case, kebab-case, and _others
  propertyName = propertyName.replaceAll(/[_-]+/g, ' ').trim();
  // start new property name with capitalised first letter
  let newPropertyName = propertyName.charAt(0).toLocaleUpperCase();
  // handle PascalCase and camelCase
  for (let n = 1; n < propertyName.length; n++) {
    const char = propertyName.charAt(n);
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
      const i = 1;
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
