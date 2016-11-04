import test from 'ava';
import lib from './';

test('smoke', t => {
    t.truthy(lib);
});

test('with dependencies', t => {
    const filePath = '/projectA/src/app/app.ts';
    const srcRoot = '/projectA/src';
    const contents = `System.register(['@angular/router', '../service'], function(exports_1, context_1)`;
    const newContents = lib(filePath, srcRoot, contents);
    t.is(newContents, `System.register('app/app', ['@angular/router', 'app/service'], function(exports_1, context_1)`)
});

test('with no dependencies', t => {
    const filePath = '/projectA/src/app/app.ts';
    const srcRoot = '/projectA/src';
    const contents = `System.register([], function(exports_1, context_1)`;
    const newContents = lib(filePath, srcRoot, contents);
    t.is(newContents, `System.register('app/app', [], function(exports_1, context_1)`)
});

