export default function vue3() {
  return {
    name: 'vue3',
    async handler(config, {extendWebpack}) {
      await extendWebpack(config, async (webpackConfig) => {
        // Do vue3 stuff here
      });
    },
  };
}
