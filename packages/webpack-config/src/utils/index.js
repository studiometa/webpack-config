/**
 * Test if the given input has a trailing slash.
 * @param {string = ''} input The string to test.
 * @return {boolean}
 */
function hasTrailingSlash(input = '') {
  return input.endsWith('/');
}

/**
 * Make sure that a string does not end with a trailing slash.
 * @param {string = ''} input The string to test.
 * @return {string} The string without trailing slash.
 */
function withoutTrailingSlash(input = '') {
  return (hasTrailingSlash(input) ? input.slice(0, -1) : input) || '/';
}

/**
 * Make sure the string given ends with a trailing slash.
 * @param  {string = ''} input The string to test.
 * @return {string} The string with a trailing slash.
 */
function withTrailingSlash(input = '') {
  return input.endsWith('/') ? input : `${input}/`;
}

/**
 * Test if the given input has a leading slash.
 * @param {string = ''} input The string to test.
 * @return {boolean}
 */
function hasLeadingSlash(input = '') {
  return input.startsWith('/');
}

/**
 * Make sure the given string does not have a leading slash.
 * @param {string = ''} input The string to test.
 * @return {string} The string without leading slash.
 */
function withoutLeadingSlash(input = '') {
  return (hasLeadingSlash(input) ? input.substr(1) : input) || '/';
}

/**
 * Make sure the given string has a leading slash.
 * @param {string = ''} input The string to test.
 * @param {string} The string with a leading slash.
 */
function withLeadingSlash(input = '') {
  return hasLeadingSlash(input) ? input : `/${input}`;
}

module.exports = {
  hasTrailingSlash,
  withoutTrailingSlash,
  withTrailingSlash,
  hasLeadingSlash,
  withoutLeadingSlash,
  withLeadingSlash,
};
