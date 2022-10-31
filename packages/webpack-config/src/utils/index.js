/**
 * Test if the given input has a trailing slash.
 * @param {string = ''} input The string to test.
 * @returns {boolean}
 */
export function hasTrailingSlash(input = '') {
  return input.endsWith('/');
}

/**
 * Make sure that a string does not end with a trailing slash.
 * @param {string = ''} input The string to test.
 * @returns {string} The string without trailing slash.
 */
export function withoutTrailingSlash(input = '') {
  return (hasTrailingSlash(input) ? input.slice(0, -1) : input) || '/';
}

/**
 * Make sure the string given ends with a trailing slash.
 * @param  {string = ''} input The string to test.
 * @returns {string} The string with a trailing slash.
 */
export function withTrailingSlash(input = '') {
  return input.endsWith('/') ? input : `${input}/`;
}

/**
 * Test if the given input has a leading slash.
 * @param {string = ''} input The string to test.
 * @returns {boolean}
 */
export function hasLeadingSlash(input = '') {
  return input.startsWith('/');
}

/**
 * Make sure the given string does not have a leading slash.
 * @param {string = ''} input The string to test.
 * @returns {string} The string without leading slash.
 */
export function withoutLeadingSlash(input = '') {
  return (hasLeadingSlash(input) ? input.slice(1) : input) || '/';
}

/**
 * Make sure the given string has a leading slash.
 * @param {string = ''} input The string to test.
 * @param {string} The string with a leading slash.
 */
export function withLeadingSlash(input = '') {
  return hasLeadingSlash(input) ? input : `/${input}`;
}
