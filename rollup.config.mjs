import livereload from "rollup-plugin-livereload";

import { mkdirSync, readFileSync } from "fs";
import { execFile } from "child_process";
import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import virtual from "@rollup/plugin-virtual";
import inject from "@rollup/plugin-inject";

import svelte from "rollup-plugin-svelte";
import postcss from "rollup-plugin-postcss";
import postcssImport from "postcss-import";

import { terser } from "rollup-plugin-terser";
import dev from "rollup-plugin-dev";
import consts from "rollup-plugin-consts";

const production = !process.env.ROLLUP_WATCH;
const dist = "public";
const bundlePrefix = `${dist}/bundle.`;
const port = 5000;

const { name, description, version, config } = JSON.parse(
  readFileSync("./package.json", { endoding: "utf8" })
);

const external = [];

if (!production) {
  mkdirSync("build", { recursive: true });
  const konsum = execFile(
    "node",
    ["node_modules/konsum/src/konsum-cli.mjs", "-c", "tests/config", "start"],
    (error, stdout, stderr) => {
      console.log(error, stdout, stderr);
    }
  );

  const { http } = JSON.parse(
    readFileSync("tests/config/config.json", { endoding: "utf8" })
  );

  config.proxyTarget = `http://localhost:${http.port}/`;
}

const prePlugins = [
  virtual({
    "node-fetch": "export default fetch",
    stream: "export class Readable {}"
  }),
  inject({
    Buffer: ["buffer", "Buffer"]
  }),
  consts({
    name,
    version,
    description,
    ...config
  })
];

const resolverPlugins = [
  resolve({
    browser: true,
    preferBuiltins: false,
    dedupe: importee => importee === "svelte" || importee.startsWith("svelte/")
  }),
  commonjs()
];

const output = {
  interop: false,
  sourcemap: true,
  format: "esm",
  file: `${bundlePrefix}main.mjs`,
  plugins: [production && terser()]
};

export default [
  {
    input: "src/main.mjs",
    output,
    plugins: [
      ...prePlugins,
      postcss({
        extract: true,
        sourceMap: true,
        minimize: production,
        plugins: [postcssImport]
      }),
      svelte({
        compilerOptions: {
          dev: !production
        }
      }),
      ...resolverPlugins,
      !production &&
        dev({
          port,
          dirs: [dist],
          spa: `${dist}/index.html`,
          basePath: config.base,
          proxy: {
            [`${config.api}/*`]: [
              config.proxyTarget,
              {
                https: config.proxyTarget.startsWith("https:"),
                proxyReqPathResolver: ctx =>
                  ctx.url.substring(config.api.length)
              }
            ]
          }
        })
    ],
    external,
    watch: {
      clearScreen: false
    }
  },
  {
    input: "src/service-worker/main.mjs",
    output: {
      ...output,
      file: `${bundlePrefix}service-worker.mjs`
    },
    plugins: [...prePlugins, ...resolverPlugins],
    external
  }
];
