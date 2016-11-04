"use strict";
var mainRE = /System\.register\(\[(.*?)\]/;
var isRelativePath = require('is-relative-path');
var Path = require('path');
var createNormalize = function (filePath, srcRoot) {
    return function (name) {
        var result = Path.resolve(filePath, name);
        result = Path.relative(srcRoot, result);
        result = unixify(result);
        return result;
    };
};
var trim = require('lodash.trim');
var unixify = require('unixify');
function systemRegisterName(filePath, srcRoot, contents) {
    var matches = contents.match(mainRE) || [];
    var fullMatch = matches[0], nameList = matches[1];
    var normalize = createNormalize(filePath, srcRoot);
    var moduleName = normalize(filePath);
    moduleName = moduleName.slice(0, -Path.extname(moduleName).length);
    if (nameList) {
        var nameList2 = nameList.split(',')
            .map(function (name) { return trim(name); })
            .map(function (name) { return trim(name, '\'"'); })
            .map(function (name) {
            if (isRelativePath(name)) {
                name = normalize(name);
            }
            return name;
        })
            .map(function (name) { return ("'" + name + "'"); })
            .join(', ');
        contents = contents.replace(fullMatch, "System.register('" + moduleName + "', [" + nameList2 + "]");
    }
    else if (nameList === '') {
        contents = contents.replace(fullMatch, "System.register('" + moduleName + "', []");
    }
    return contents;
}
exports.systemRegisterName = systemRegisterName;
;
exports.__esModule = true;
exports["default"] = systemRegisterName;
//# sourceMappingURL=index.js.map