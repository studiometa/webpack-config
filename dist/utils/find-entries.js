"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = findEntriesByGlobs;

var _slicedToArray2 = _interopRequireDefault(require("@babel/runtime/helpers/slicedToArray"));

var _toConsumableArray2 = _interopRequireDefault(require("@babel/runtime/helpers/toConsumableArray"));

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _glob = require("glob");

var _path = require("path");

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(source, true).forEach(function (key) { (0, _defineProperty2["default"])(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

/**
 * Generate an object of entries from a given glob and current workin directory
 * @param  {String} glob    The glob of files to find
 * @param  {String} cwd     The source path of the files
 * @param  {Object} options Options passed to the globSync method
 * @return {Object}         An object of entries
 */
function findEntriesByGlob(glob, cwd) {
  var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
  return (0, _glob.sync)(glob, _objectSpread({}, options, {
    cwd: cwd
  })).reduce(function (entries, filepath) {
    var ext = (0, _path.extname)(filepath).replace(/^\./, '');
    var regexp = new RegExp("\\.".concat(ext, "$"));
    var entryName = filepath.replace("".concat(cwd, "/"), '').replace(regexp, '');
    entries[entryName] = (0, _path.resolve)((0, _path.join)(cwd, filepath));
    return entries;
  }, {});
}
/**
 * Generate an object of entries from the given globs
 * @param  {String|Array} glob    The glob of files to find
 * @param  {String}       cwd     The source path of the files
 * @param  {Object}       options Options passed to the globSync method
 * @return {Object}               An object of entries
 */


function findEntriesByGlobs(glob, cwd) {
  var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

  if (Array.isArray(glob)) {
    var negatives = [];
    var allEntries = {};
    glob.forEach(function (singleGlob) {
      var isNegative = singleGlob.startsWith('!');
      var absoluteGlob = isNegative ? singleGlob.substring(1) : singleGlob;
      var entries = findEntriesByGlob(absoluteGlob, cwd, options);

      if (isNegative) {
        negatives.push.apply(negatives, (0, _toConsumableArray2["default"])(Object.keys(entries)));
      }

      allEntries = _objectSpread({}, allEntries, {}, entries);
    }); // Filter out all negatives matches before returning

    return Object.entries(allEntries).reduce(function (entries, _ref) {
      var _ref2 = (0, _slicedToArray2["default"])(_ref, 2),
          key = _ref2[0],
          path = _ref2[1];

      if (negatives.includes(key)) {
        return entries;
      }

      entries[key] = path;
      return entries;
    }, {});
  }

  return findEntriesByGlob(glob, cwd, options);
}