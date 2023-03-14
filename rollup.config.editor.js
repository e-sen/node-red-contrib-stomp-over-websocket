import fs from "fs";
import glob from "glob";
import path from "path";
import typescript from "@rollup/plugin-typescript";
import sucrase from '@rollup/plugin-sucrase';
import resolve from '@rollup/plugin-node-resolve';

import packageJson from "./package.json";

const allNodeTypes = Object.keys(packageJson["node-red"].nodes);

const htmlWatch = () => {
    return {
        name: "htmlWatch",
        load(id) {
            const relative = path.relative(__dirname, id);
            const htmlDir = `${path.dirname(relative).replace(/\\/g, '/')}/*.html`;
            const htmlFiles = glob.sync(htmlDir);
            htmlFiles.map((file) => this.addWatchFile(file));
        },
    };
};

const htmlBundle = () => {
    return {
        name: "htmlBundle",
        renderChunk(code, chunk, _options) {
            // const editorDir = path.dirname(chunk.facadeModuleId);
            const relative = path.relative(__dirname, chunk.facadeModuleId);
            const htmlDir = `${path.dirname(relative).replace(/\\/g, '/')}/*.html`;
            const htmlFiles = glob.sync(htmlDir);
            const htmlContents = htmlFiles.map((fPath) => fs.readFileSync(fPath));
            code =
                '<script type="text/javascript">\n' +
                code +
                "\n" +
                "</script>\n" +
                htmlContents.join("\n");

            return {
                code,
                map: {mappings: ""},
            };
        },
    };
};

const makePlugins = (nodeType) => [
    htmlWatch(),
    resolve({
        extensions: ['.js', '.ts']
    }),
    sucrase({
        exclude: ['node_modules/**'],
        transforms: ['typescript']
    }),
    // typescript({
    //     lib: ["es5", "es6", "dom"],
    //     include: [
    //         `src/nodes/${nodeType}/**/*.ts`,
    //         // `src/nodes/${nodeType}/shared/**/*.ts`,
    //         // "src/nodes/shared/**/*.ts",
    //     ],
    //     target: "es6",
    //     tsconfig: false,
    //     noEmitOnError: process.env.ROLLUP_WATCH ? false : true
    // }),
    htmlBundle(),
];

const makeConfigItem = function (nodeType) {
    const type = nodeType.replace(/_/g, "/");
    return {
        input: `src/nodes/${type}/index.ts`,
        output: {
            file: `dist/nodes/${type}.html`,
            format: "iife",
        },
        plugins: makePlugins(type),
        watch: {
            clearScreen: false,
        },
    };
};

export default allNodeTypes.map((nodeType) => makeConfigItem(nodeType));