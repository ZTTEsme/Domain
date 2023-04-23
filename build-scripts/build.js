/* eslint-disable */
const builder = require("slim-frontend-builder");
const helpers = require("./helpers");
const process = require("process");

const watchPort = 8018;

async function build(project) {
  builder.log.info("Building:", project);

  const srcDir = "main";
  const libsDir = "libs";
  const distDir = "build";
  const i18nSrcDir = "libs/i18n/xliff/xml";

  try {
    builder.styles.compileSass(`${srcDir}/sass/main.scss`, `${distDir}/main.css`);
    await builder.scripts.compileTypescript(
      helpers.rollupInputConfig(`${srcDir}/ts/main.ts`),
      helpers.rollupOutputConfig(`${distDir}/main.js`, project)
    );
    await builder.xliff.compileXliff(i18nSrcDir, `${distDir}/i18n`);
    builder.files.copy(`${srcDir}/html/index.html`, `${distDir}/index.html`);
    helpers.copyAssets([srcDir, libsDir], distDir);
    await helpers.postProcessCss(`${distDir}/main.css`, `${distDir}/index.html`);
    await helpers.postProcessJavascript(
      `${distDir}/index.html`,
      `${distDir}/main.js`,
      `${distDir}/qnect-frame.js`,
      `${distDir}/vue.js`,
      `${distDir}/bootstrap.js`
    );
    const i18nHash = await helpers.postProcessI18n(i18nSrcDir, `${distDir}/i18n`);
    helpers.postProcessHtmlInjects(`${distDir}/index.html`, "production", i18nHash);
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
}

async function watch(project) {
  builder.log.info("Watching:", project);

  const srcDir = "main";
  const libsDir = "libs";
  const distDir = "build";
  const i18nSrcDir = "libs/i18n/xliff/xml";
  const i18nDistDir = `${distDir}/i18n`;

  builder.styles.compileSass(`${srcDir}/sass/main.scss`, `${distDir}/main.css`);
  await builder.xliff.compileXliff(i18nSrcDir, i18nDistDir);
  builder.files.copy(`${srcDir}/html/index.html`, `${distDir}/index.html`);
  helpers.postProcessHtmlInjects(`${distDir}/index.html`, "development", "");
  helpers.copyAssets([srcDir, libsDir], distDir);

  builder.scripts.watchTypescript(helpers.rollupWatchConfig(`${srcDir}/ts/main.ts`, `${distDir}/main.js`, watchPort));

  builder.watcher.watchProject({
    baseSourcePaths: [srcDir, libsDir],
    matchers: [
      helpers.getDummyTsMatcher(),
      helpers.getIndexMatcher(srcDir, distDir),
      helpers.getScssMatcher(srcDir, distDir),
      helpers.getI18nMatcher(i18nSrcDir, i18nDistDir),
      helpers.getImageMatcher(distDir),
    ],
  });
  builder.log.info("Serving on localhost:", watchPort);
}

const cmdArg = process.argv[2];
const projectArg = process.argv[3];

if (cmdArg === "build" || cmdArg === "watch") {
  switch (cmdArg) {
    case "build":
      build(projectArg);
      break;
    case "watch":
      watch(projectArg);
      break;
  }
} else {
  builder.log.info("usage: [build|watch] [projectName]");
}
