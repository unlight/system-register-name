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
    if (nameList) {
        var normalize_1 = createNormalize(filePath, srcRoot);
        var nameList2 = nameList.split(',')
            .map(function (name) { return trim(name); })
            .map(function (name) { return trim(name, '\'"'); })
            .map(function (name) {
            if (isRelativePath(name)) {
                name = normalize_1(name);
            }
            return name;
        })
            .map(function (name) { return ("'" + name + "'"); })
            .join(', ');
        var moduleName = normalize_1(filePath);
        moduleName = moduleName.slice(0, -Path.extname(moduleName).length);
        contents = contents.replace(fullMatch, "System.register('" + moduleName + "', [" + nameList2 + "]");
    }
    return contents;
}
exports.systemRegisterName = systemRegisterName;
;
exports.__esModule = true;
exports["default"] = systemRegisterName;
//# sourceMappingURL=index.js.map