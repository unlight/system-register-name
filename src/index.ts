const mainRE = /System\.register\(\[(.*?)\]/;
const isRelativePath = require('is-relative-path');
const Path = require('path');
const createNormalize = function(filePath: string, srcRoot: string) {
	return (name: string): string => {
		let result = Path.resolve(filePath, name);
		result = Path.relative(srcRoot, result);
		result = unixify(result);
		return result;
	};
};
const trim = require('lodash.trim');
const unixify = require('unixify');

export function systemRegisterName(filePath: string, srcRoot: string, contents: string) {
	const matches = contents.match(mainRE) || [];
	let [fullMatch, nameList] = matches;
	const normalize = createNormalize(filePath, srcRoot);
	let moduleName = normalize(filePath);
	moduleName = moduleName.slice(0, -Path.extname(moduleName).length);
	if (nameList) {
		let nameList2 = nameList.split(',')
			.map(name => trim(name))
			.map(name => trim(name, '\'"'))
			.map((name: string) => {
				if (isRelativePath(name)) {
					name = normalize(name);
				}
				return name;
			})
			.map(name => `'${name}'`)
			.join(', ');
		contents = contents.replace(fullMatch, `System.register('${moduleName}', [${nameList2}]`);
	} else if (nameList === '') {
		contents = contents.replace(fullMatch, `System.register('${moduleName}', []`);
	}
	return contents;
};

export default systemRegisterName;
