/* eslint-disable */
const builder = require("slim-frontend-builder");
const helpers = require("./helpers");
const process = require("process");
const config = require("./config.json");

async function build(project) {
  const before = Date.now();
  builder.log.info("Building:", project);

  try {
    builder.styles.compileSass(config.styles.inputFile, config.styles.outputFile);
    await builder.scripts.compileTypescript(
      helpers.rollupInputConfig(config.scripts.inputFile),
      helpers.rollupOutputConfig(config.scripts.outputFile, project)
    );
    await builder.xliff.compileXliff(config.translations.inputDirectory, config.translations.outputDirectory);
    builder.files.copy(config.templates.inputFile, config.templates.outputFile);
    helpers.copyImages(config.images.inputDirectories, config.images.outputDirectory, config.images.types);
    helpers.copyFiles(config.fonts.files);
    helpers.copyFiles(config.scripts.vendors);
    await helpers.postProcessCss(config.styles.outputFile, config.templates.outputFile);
    await helpers.postProcessJavascript(
      config.templates.outputFile,
      config.scripts.outputFile,
      ...config.scripts.vendors.map((v) => v.outputFile)
    );
    const i18nHash = await helpers.postProcessI18n(
      config.translations.inputDirectory,
      config.translations.outputDirectory
    );
    helpers.postProcessHtmlInjects(config.templates.outputFile, "production", i18nHash, config.watch.frameUrl);
  } catch (error) {
    console.log(error);
    process.exit(1);
  }

  builder.log.info("Done in", builder.log.prettyDuration(Date.now() - before));
}

async function watch(project) {
  builder.log.info("Watching:", project);

  builder.styles.compileSass(config.styles.inputFile, config.styles.outputFile);
  await builder.xliff.compileXliff(config.translations.inputDirectory, config.translations.outputDirectory);
  builder.files.copy(config.templates.inputFile, config.templates.outputFile);
  helpers.copyImages(config.images.inputDirectories, config.images.outputDirectory, config.images.types);
  helpers.copyFiles(config.fonts.files);
  helpers.copyFiles(config.scripts.vendors);
  helpers.postProcessHtmlInjects(config.templates.outputFile, "development", "", config.watch.frameUrl);

  builder.scripts.watchTypescript(
    helpers.rollupWatchConfig(config.scripts.inputFile, config.scripts.outputFile, config.watch.port)
  );

  builder.watcher.watchProject({
    baseSourcePaths: config.watch.inputDirectories,
    matchers: [
      helpers.getDummyTsMatcher(),
      helpers.getIndexMatcher(config),
      helpers.getScssMatcher(config),
      helpers.getI18nMatcher(config),
      helpers.getImageMatcher(config),
    ],
  });
  builder.log.info("Serving on localhost:", config.watch.port);
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
