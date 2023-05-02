/* eslint-disable */
const builder = require("slim-frontend-builder");
const fs = require("fs");
const uglifyjs = require("uglify-js");
const path = require("path");

// ROLLUP
const alias = require("@rollup/plugin-alias");
const commonjs = require("@rollup/plugin-commonjs");
const json = require("@rollup/plugin-json");
const resolve = require("@rollup/plugin-node-resolve");
const serve = require("rollup-plugin-serve");
const typescript = require("@rollup/plugin-typescript");

const rollupPluginAlias = alias({ entries: { vue: "node_modules/vue/dist/vue.esm-bundler.js" } });

const rollupPluginResolve = resolve({ mainFields: ["module", "main", "browser"] });

const rollupPluginTypescript = typescript({ typescript: require("typescript"), outputToFilesystem: true });
const rollupPluginTypescriptFailOnBuild = typescript({
  typescript: require("typescript"),
  outputToFilesystem: true,
  noEmitOnError: true,
});

const rollupPluginCommonJs = commonjs();

const rollupPluginJson = json();

function rollupWatchConfig(src, dest, port) {
  const rollupPluginServe = serve({
    contentBase: `build`,
    host: "0.0.0.0",
    port: port,
    verbose: false,
  });

  return {
    input: src,
    external: ["vue", "bootstrap"],
    output: {
      file: dest,
      format: "umd",
      globals: {
        vue: "Vue",
        bootstrap: "bootstrap",
      },
    },
    onwarn: (warning, warn) => {
      if (warning.code === "CIRCULAR_DEPENDENCY") return;
      if (warning.code === "EVAL") return;
      if (warning.code === "THIS_IS_UNDEFINED") return;
      if (!!warning.loc) {
        builder.log.warn(
          "Warning:",
          `${warning.loc.file}(${warning.loc.line}:${warning.loc.column}):`,
          warning.message
        );
      } else {
        builder.log.warn("Warning:", warning.message);
      }
    },
    plugins: [
      rollupPluginAlias,
      rollupPluginResolve,
      rollupPluginCommonJs,
      rollupPluginJson,
      rollupPluginTypescript,
      rollupPluginServe,
    ],
  };
}

function rollupInputConfig(src) {
  return {
    input: src,
    external: ["vue", "bootstrap"],
    onwarn: (warning, warn) => {
      if (warning.code === "CIRCULAR_DEPENDENCY") return;
      if (warning.code === "THIS_IS_UNDEFINED") return;
      if (!!warning.loc) {
        builder.log.warn(
          "Warning:",
          `${warning.loc.file}(${warning.loc.line}:${warning.loc.column}):`,
          warning.message
        );
      } else {
        builder.log.warn("Warning:", warning.message);
      }
    },
    plugins: [
      rollupPluginAlias,
      rollupPluginResolve,
      rollupPluginCommonJs,
      rollupPluginJson,
      rollupPluginTypescriptFailOnBuild,
    ],
  };
}

function rollupOutputConfig(dest, project) {
  return {
    file: dest,
    format: "umd",
    name: project,
    globals: {
      vue: "Vue",
      bootstrap: "bootstrap",
    },
  };
}

function copyImages(srcDirs, distDir, fileTypes) {
  fs.mkdirSync(distDir, { recursive: true });
  builder.files.copyFilesByTypeToDirectory(srcDirs, distDir, ...fileTypes);
}

function copyFiles(configs) {
  configs.forEach((config) => {
    builder.files.copy(config.inputFile, config.outputFile);
  });
}

function postProcessHtmlInjects(htmlFile, environment, i18nHash, frameUrl) {
  builder.log.action("Post processing HTML injects");

  let frameJsReplacement = `\n<script src="${frameUrl}/qnect-frame.js"></script>`;
  let frameCssReplacement = `<link rel="stylesheet" type="text/css" href="${frameUrl}/qnect-frame.css" />`;

  if (environment === "production") {
    frameJsReplacement = '\n<script src="../../qnect-frame.js"></script>';
    frameCssReplacement = '<link rel="stylesheet" type="text/css" href="../../qnect-frame.css" />';
  }

  replaceInFile(
    htmlFile,
    "<!--BUILD_BODY_INJECT-->",
    `<script>window.process.env.NODE_ENV="${environment}";window.i18nFolderHash="${i18nHash}";window.frameI18nPrefix="${frameUrl}";</script>${frameJsReplacement}`
  );
  replaceInFile(htmlFile, "<!--BUILD_HEADER_INJECT-->", frameCssReplacement);
}

function replaceInFile(htmlFile, placeholder, replacement) {
  builder.files.replaceStringInFile(placeholder, replacement, htmlFile);
  builder.log.action("Replaced", placeholder, "in", htmlFile, "with", replacement);
}

async function postProcessJavascript(htmlFile, ...files) {
  for (const file of files) {
    builder.log.action("Post processing:", file);

    const sizeBefore = builder.files.sizeInMegaBytes(file);
    const result = uglifyjs.minify(
      { "file.js": fs.readFileSync(file, "utf8") },
      {
        compress: {
          reduce_funcs: false,
          reduce_vars: false,
        },
      }
    );

    if (result.error) {
      builder.log.error(result.error.message);
      builder.log.error("file:", result.error.filename, "at", result.error.line, ":", result.error.col);
      throw new Error(result.error);
    }

    fs.writeFileSync(file, result.code);
    const sizeAfter = builder.files.sizeInMegaBytes(file);
    builder.log.action("Minified", sizeBefore, "=>", sizeAfter);

    const hash = await builder.files.directoryHash(file);
    const filename = path.basename(file);
    const hashedName = builder.files.addSuffixToFileName(file, hash);
    const hashedFilename = path.basename(hashedName);

    builder.files.replaceStringInFile(filename, hashedFilename, htmlFile);
    builder.log.action("Renamed", file, "=>", hashedName);
  }
}

async function postProcessCss(file, htmlFile) {
  builder.log.action("Post processing:", file);
  const hash = await builder.files.directoryHash(file);
  const hashedName = builder.files.addSuffixToFileName(file, hash);
  builder.files.replaceStringInFile("main.css", `main.${hash}.css`, htmlFile);
  builder.log.action("Renamed", file, "=>", hashedName);
}

async function postProcessI18n(srcDir, destDir) {
  builder.log.action("Post processing i18n folder");

  const hash = await builder.files.directoryHash(srcDir);
  const hashedDir = `${destDir}.${hash}`;
  fs.renameSync(destDir, hashedDir);

  builder.log.action("Renamed", destDir, "=>", hashedDir);
  return hash;
}

function getDummyTsMatcher() {
  return {
    pattern: new RegExp(/.*\.ts$/, "i"),
    callback: (event, filePath) => {},
  };
}

function getIndexMatcher(config) {
  return {
    pattern: new RegExp(/index.html$/, "i"),
    callback: (event, filePath) => {
      builder.files.copy(config.templates.inputFile, config.templates.outputFile);
      postProcessHtmlInjects(config.templates.outputFile, "development", "", config.watch.frameUrl);
    },
  };
}

function getScssMatcher(config) {
  return {
    pattern: new RegExp(/.*\.scss$/, "i"),
    callback: (event, filePath) => {
      builder.styles.compileSass(config.styles.inputFile, config.styles.outputFile);
    },
  };
}

function getI18nMatcher(config) {
  return {
    pattern: new RegExp(/.*\.xlf$/, "i"),
    callback: async (event, filePath) => {
      await builder.xliff.compileXliff(config.translations.inputDirectory, config.translations.outputDirectory);
    },
  };
}

function getImageMatcher(config) {
  return {
    pattern: new RegExp(/.*\.(jpg|jpeg|png|svg)$/, "i"),
    callback: (event, filePath) => {
      if (event === "remove") {
        builder.files.removeFile(`${config.images.outputDirectory}/${path.basename(filePath)}`);
      } else {
        builder.files.copy(filePath, `${config.images.outputDirectory}/${path.basename(filePath)}`);
      }
    },
  };
}

module.exports = {
  copyFiles,
  copyImages,
  getIndexMatcher,
  getScssMatcher,
  getI18nMatcher,
  getDummyTsMatcher,
  getImageMatcher,
  postProcessCss,
  postProcessHtmlInjects,
  postProcessI18n,
  postProcessJavascript,
  rollupInputConfig,
  rollupOutputConfig,
  rollupWatchConfig,
};
