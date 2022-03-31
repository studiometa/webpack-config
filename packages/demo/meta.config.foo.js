export default async (metaConfig, options, helpers) => {
  await helpers.extendWebpack(metaConfig, async (webpackConfig) => {
    webpackConfig.optimization.minimize = false;
  });
};
