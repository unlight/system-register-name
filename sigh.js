var merge, glob, concat, write, env, debounce, pipeline;
var ts;
var ava;
var thru;

module.exports = function (pipelines) {
    
    const types = ['node'];

    pipelines["source"] = [
        glob({ basePath: "src" }, "**/!(*.test).ts"),
        ts({declaration: true, sourceMap: true, module: "commonjs", types}),
        write("build"),
    ];

    pipelines["test"] = [
        glob({ basePath: "src" }, "**/*.test.ts"),
        thru(event => {
            event.changeFileSuffix("js");
            return event;
        }),
        write("build"),
        ava({files: "build/*.test.js", verbose: true, serial: true})
    ];

    pipelines["build"] = [
        glob({ basePath: "src" }, "**/!(*.test).ts"),
        ts({declaration: true, sourceMap: true, types}),
        write("build"),
    ];
};