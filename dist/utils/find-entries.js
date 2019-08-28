"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _glob = require("glob");

var _path = _interopRequireDefault(require("path"));

/**
 * Generate an object of entries from a src and a glob
 * @param  {String} src  The source of the files
 * @param  {String} glob The glob of files to find
 * @return {Object}      An object of entries
 */
var _default = function _default(src) {
  var glob = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '**/*.js';
  return (0, _glob.sync)(_path["default"].resolve(src, glob)).reduce(function (entries, filepath) {
    var filename = _path["default"].basename(filepath);

    if (filename.startsWith('_')) {
      return entries;
    }

    var extname = _path["default"].extname(filepath).replace(/^\./, '');

    var regexp = new RegExp("\\.".concat(extname, "$"));
    var entryName = filepath.replace("".concat(src, "/"), '').replace(regexp, '');
    entries[entryName] = filepath;
    return entries;
  }, {});
};

exports["default"] = _default;