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
    external: ["vue"],
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
    },
  };
}

function copyQnectFrame(distDir) {
  builder.files.copy("node_modules/qnect-web-frame/build/main.js", `${distDir}/qnect-frame.js`);
  builder.files.copy("node_modules/qnect-web-frame/build/main.css", `${distDir}/qnect-frame.css`);
  builder.files.copy("node_modules/qnect-web-frame/build/i18n-qnect-frame", `${distDir}/i18n-qnect-frame`);
}

function copyVue(distDir) {
  builder.files.copy("node_modules/vue/dist/vue.global.js", `${distDir}/vue.js`);
  builder.files.copy("node_modules/bootstrap/dist/js/bootstrap.bundle.js", `${distDir}/bootstrap.js`);
}

function copyFonts(distDir) {
  // Source Sans Pro
  builder.files.copy(
    "node_modules/@fontsource/source-sans-pro/files/source-sans-pro-all-200-italic.woff",
    `${distDir}/fonts/source-sans-pro-200-italic.woff`
  );
  builder.files.copy(
    "node_modules/@fontsource/source-sans-pro/files/source-sans-pro-all-200-normal.woff",
    `${distDir}/fonts/source-sans-pro-200-normal.woff`
  );
  builder.files.copy(
    "node_modules/@fontsource/source-sans-pro/files/source-sans-pro-all-300-italic.woff",
    `${distDir}/fonts/source-sans-pro-300-italic.woff`
  );
  builder.files.copy(
    "node_modules/@fontsource/source-sans-pro/files/source-sans-pro-all-300-normal.woff",
    `${distDir}/fonts/source-sans-pro-300-normal.woff`
  );
  builder.files.copy(
    "node_modules/@fontsource/source-sans-pro/files/source-sans-pro-all-400-italic.woff",
    `${distDir}/fonts/source-sans-pro-400-italic.woff`
  );
  builder.files.copy(
    "node_modules/@fontsource/source-sans-pro/files/source-sans-pro-all-400-normal.woff",
    `${distDir}/fonts/source-sans-pro-400-normal.woff`
  );
  builder.files.copy(
    "node_modules/@fontsource/source-sans-pro/files/source-sans-pro-all-600-italic.woff",
    `${distDir}/fonts/source-sans-pro-600-italic.woff`
  );
  builder.files.copy(
    "node_modules/@fontsource/source-sans-pro/files/source-sans-pro-all-600-normal.woff",
    `${distDir}/fonts/source-sans-pro-600-normal.woff`
  );
  builder.files.copy(
    "node_modules/@fontsource/source-sans-pro/files/source-sans-pro-all-700-italic.woff",
    `${distDir}/fonts/source-sans-pro-700-italic.woff`
  );
  builder.files.copy(
    "node_modules/@fontsource/source-sans-pro/files/source-sans-pro-all-700-normal.woff",
    `${distDir}/fonts/source-sans-pro-700-normal.woff`
  );
  builder.files.copy(
    "node_modules/@fontsource/source-sans-pro/files/source-sans-pro-all-900-italic.woff",
    `${distDir}/fonts/source-sans-pro-900-italic.woff`
  );
  builder.files.copy(
    "node_modules/@fontsource/source-sans-pro/files/source-sans-pro-all-900-normal.woff",
    `${distDir}/fonts/source-sans-pro-900-normal.woff`
  );

  // Font Awesome
  builder.files.copy("node_modules/@fortawesome/fontawesome-free/webfonts", `${distDir}/fonts`);
}

function copyAssets(srcDirs, distDir) {
  // Images
  fs.mkdirSync(`${distDir}/img`, { recursive: true });
  builder.files.copyFilesByTypeToDirectory(srcDirs, `${distDir}/img`, "jpg", "jpeg", "png", "svg","gif");

  // QNECT Frame
  copyQnectFrame(distDir);

  // JS Vendor
  copyVue(distDir);

  // Fonts
  copyFonts(distDir);
}

function postProcessHtmlInjects(htmlFile, environment, i18nHash) {
  builder.log.action("Post processing HTML injects");
  //192.168.10.165
  let frameJsReplacement = '\n<script src="http://192.168.10.165:8080/qnect-frame.js"></script>';
  let frameCssReplacement =
    '<link rel="stylesheet" type="text/css" href="http://192.168.10.165:8080/qnect-frame.css" />';
  if (environment === "production") {
    frameJsReplacement = '\n<script src="../../qnect-frame.js"></script>';
    frameCssReplacement = '<link rel="stylesheet" type="text/css" href="../../qnect-frame.css" />';
  }

  replaceInFile(
    htmlFile,
    "<!--BUILD_BODY_INJECT-->",
    `<script>window.process.env.NODE_ENV="${environment}";window.i18nFolderHash="${i18nHash}";</script>${frameJsReplacement}`
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

function getIndexMatcher(srcDir, distDir) {
  return {
    pattern: new RegExp(/index.html$/, "i"),
    callback: (event, filePath) => {
      builder.files.copy(`${srcDir}/html/index.html`, `${distDir}/index.html`);
      postProcessHtmlInjects(`${distDir}/index.html`, "development", "");
    },
  };
}

function getScssMatcher(srcDir, distDir) {
  return {
    pattern: new RegExp(/.*\.scss$/, "i"),
    callback: (event, filePath) => {
      builder.styles.compileSass(`${srcDir}/sass/main.scss`, `${distDir}/main.css`);
    },
  };
}

function getI18nMatcher(srcDir, distDir) {
  return {
    pattern: new RegExp(/.*\.xlf$/, "i"),
    callback: (event, filePath) => {
      builder.xliff.compileXliff(srcDir, distDir);
    },
  };
}

function getImageMatcher(distDir) {
  return {
    pattern: new RegExp(/.*\.(jpg|jpeg|png|svg)$/, "i"),
    callback: (event, filePath) => {
      if (event === "remove") {
        builder.files.removeFile(`${distDir}/img/${path.basename(filePath)}`);
      } else {
        builder.files.copy(filePath, `${distDir}/img/${path.basename(filePath)}`);
      }
    },
  };
}

module.exports = {
  copyAssets,
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
