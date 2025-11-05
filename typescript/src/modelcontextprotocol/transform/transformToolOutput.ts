import {transformPropertyName} from './transformPropertyName';

const emptyObjectTransformValue = 'no properties';
const emptyArrayTransformValue = 'none';

const generateTabs = (tabCount: number) => {
  let tabs = '';
  for (let n = 0; n < tabCount; n++) {
    tabs += '\t';
  }
  return tabs;
};

type Format = 'tabular' | 'json';

/**
 * A method to strigify tool output into a LLM friendly and optimised format.
 *
 * @param {unknown} args.data - The response of a tool's output, in the format of an object.
 * @param {string} [args.title] - An optional string, the title or description to give the data for LLM context.
 * @param {Format} [args.format] - An optional string of either "tabular" or "JSON" defining the format output, default "tabular". Choose "tabular" for chat contexts, "json" for coding
 *
 * @returns {string} The LLM optimised tool string output.
 */
export const transformToolOutput = (args: {
  data: any;
  title?: string;
  format?: Format;
}): string => {
  let {format} = args;
  const {data, title} = args;

  if (isPropertyTypeToBeIgnored(data)) {
    return title
      ? `${transformTitle(title)}\n${emptyObjectTransformValue}`
      : emptyObjectTransformValue;
  }

  // if requested format is JSON, simply stringify and return the data
  if (format === 'json') {
    if (title) {
      return JSON.stringify({
        [transformTitle(title)]: data,
      });
    }
    return JSON.stringify(data);
  }

  // else handle default tabular format
  let transformedDataAggregate = '';
  if (title) {
    transformedDataAggregate = `${transformTitle(title)}\n`;
  }

  // negative tabCount to offset first level data
  let transformedData = transformData({data, tabCount: -1});

  return (transformedDataAggregate +=
    transformedData ?? emptyObjectTransformValue);
};

const transformTitle = (title: string) =>
  `${transformPropertyName(title).toUpperCase()}`;

/**
 * The internal method used to transform values to tabular, split by type.
 *
 * @returns {string | null} The LLM optimised tool string output, or null if data passed {@link isPropertyTypeToBeIgnored}.
 */
const transformData = (args: {data: any; tabCount: number}): string | null => {
  const {data, tabCount} = args;
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
        return handleArrayTransformation({array: data, tabCount});
      }
      // handle object/Record<string, any> (remaining possible condition)
      return handleObjectTransformation({
        data,
        tabCount,
      });
    }
    default:
      return null;
  }
};

/**
 * The internal method used to correctly loop through array values before transforming values with {@link transformObjectOrArrayContent}
 *
 * @returns {string} The LLM optimised tool string output.
 */
const handleArrayTransformation = (args: {
  array: Array<unknown>;
  tabCount: number;
}): string => {
  const {array, tabCount} = args;

  if (array.length === 0) {
    return emptyArrayTransformValue;
  }

  // handle simple arrays to be transformed into one-line format
  if (isArrayWithoutObjectsOrArrays(array)) {
    const simpleTransformedArray = array.reduce(
      (previousValue: string, currentValue) => {
        const transformedCurrentValue = transformData({
          data: currentValue,
          tabCount,
        });
        if (transformedCurrentValue === null) {
          return previousValue;
        }
        if (previousValue) {
          return `${previousValue}, ${transformedCurrentValue}`;
        } else {
          return transformedCurrentValue;
        }
      },
      ''
    );
    return simpleTransformedArray === ''
      ? emptyArrayTransformValue
      : simpleTransformedArray;
  }

  let transformedData = '';
  let unignoredArrayPropertyIndex = 0;
  array.forEach((value) => {
    if (!isPropertyTypeToBeIgnored(value)) {
      transformedData += transformObjectOrArrayContent({
        key: unignoredArrayPropertyIndex.toString(),
        value,
        tabCount,
      });
      transformedData += '\n';
      unignoredArrayPropertyIndex++;
    }
  });

  if (transformedData === '') {
    return emptyArrayTransformValue;
  }

  // remove last added "\n"
  return transformedData.substring(0, transformedData.length - 1);
};

/**
 * The internal method used to correctly loop through object values before transforming values with {@link transformObjectOrArrayContent}
 *
 * @returns {string} The LLM optimised tool string output.
 */
const handleObjectTransformation = (args: {
  data: Record<string, unknown>;
  tabCount: number;
}): string => {
  const {data, tabCount} = args;
  let transformedData = '';

  Object.keys(data).forEach((key) => {
    if (!isPropertyTypeToBeIgnored(data[key])) {
      transformedData += transformObjectOrArrayContent({
        key,
        value: data[key],
        tabCount: tabCount + 1,
      });
      transformedData += '\n';
    }
  });

  if (transformedData === '') {
    return emptyObjectTransformValue;
  }

  // remove last added "\n"
  return transformedData.substring(0, transformedData.length - 1);
};

const transformObjectOrArrayContent = (args: {
  key: string;
  value: unknown;
  tabCount: number;
}): string => {
  const {key, value, tabCount} = args;
  const transformedValue = transformData({
    data: value,
    // increase base indentation in arrays so child indices render under the parent label.
    // Objects handle their own +1 indentation internally in handleObjectTransformation.
    tabCount: Array.isArray(value) ? tabCount + 1 : tabCount,
  });
  if (transformedValue === null) {
    return '';
  }

  let transformedDataAggregate = `${generateTabs(tabCount)}${transformPropertyName(key)}:`;

  // conditions to add a space between the key/value, else new line and tab
  if (
    typeof value !== 'object' ||
    transformedValue === 'null' ||
    transformedValue === emptyArrayTransformValue ||
    transformedValue === emptyObjectTransformValue ||
    (Array.isArray(value) && isArrayWithoutObjectsOrArrays(value))
  ) {
    transformedDataAggregate += ' ';
  } else {
    transformedDataAggregate += `\n`;
  }

  return (transformedDataAggregate += transformedValue);
};

const isArrayWithoutObjectsOrArrays = (array: Array<unknown>): boolean => {
  if (array.length === 0) {
    return true;
  }
  let hasObjectOrArrayBeenFound = false;
  for (let n = 0; n < array.length; n++) {
    if (isObject(array[n]) || Array.isArray(array[n])) {
      hasObjectOrArrayBeenFound = true;
      n = array.length;
    }
  }
  return !hasObjectOrArrayBeenFound;
};

/**
 * Checks if the data type passed is one to be ignored in transformation.
 *
 * @param {unknown} data - An unknown data type to be tested.
 *
 * @returns {boolean} A boolean indictating whether or not to ignore the property
 */
const isPropertyTypeToBeIgnored = (data: any): boolean =>
  typeof data === 'undefined' || typeof data === 'function';

const isObject = (data: any): data is Record<string, any> =>
  typeof data === 'object' && data !== null && !Array.isArray(data);
