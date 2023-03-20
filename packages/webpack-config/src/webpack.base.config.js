import path from 'node:path';
import WebpackBar from 'webpackbar';
import glob from 'glob';
// import RemoveEmptyScriptsPlugin from 'webpack-remove-empty-scripts';
import BundleAnalyzerPluginImport from 'webpack-bundle-analyzer';
import commonDir from 'common-dir';
import dotenv from 'dotenv';
// import WebpackAssetsManifest from 'webpack-assets-manifest';

const { BundleAnalyzerPlugin } = BundleAnalyzerPluginImport;

dotenv.config();

const LEADING_SLASH_REGEXT = /^\//;

/**
 * Get Webpack base config.
 * @param   {import('./index').MetaConfig} config
 * @param   {{ isModern?: boolean, isLegacy?: boolean }} [options]
 * @returns {import('webpack').Configuration}
 */
export default async function getWebpackBaseConfig(config) {
  const isDev = process.env.NODE_ENV !== 'production';
  const src = commonDir(config.src);

  const entry = Object.fromEntries(
    config.src.flatMap((entryGlob) => {
      return glob.sync(entryGlob, { cwd: config.context }).map((file) => {
        return [file.replace(src, '').replace(path.extname(file), ''), file];
      });
    })
  );

  const webpackBaseConfig = {
    context: config.context,
    entry,
    devtool: 'source-map',
    target: ['web', 'es2015'],
    output: {
      path: path.resolve(config.context, config.dist),
      publicPath: config.public ?? 'auto',
      pathinfo: false,
      filename: `[name].js`,
      chunkFilename: isDev ? '[name].js' : '[name].[contenthash].js',
      sourceMapFilename: '[file].map',
      clean: true,
      // Do not consider scripts to be type="module"
      scriptType: false,
    },
    builtins: {
      // progress: true,
      define: {
        __DEV__: isDev,
      },
    },
    experiments: {
      incrementalRebuild: true,
    },
    stats: {
      all: false,
      assets: true,
      cachedAssets: true,
      assetsSort: 'name',
      colors: true,
      warnings: true,
      errors: true,
      errorDetails: true,
      performance: true,
      excludeAssets: isDev ? [/\.map$/, /hot-update/, /^manifest\.(js|json)$/] : [/\.map$/],
    },
    module: {
      rules: [
        {
          resourceQuery: /raw/,
          type: 'asset/source',
        },
        {
          test: /\.(png|jpe?g|gif|webp)$/i,
          type: 'asset',
          generator: {
            filename: isDev ? 'img/[name][ext]' : 'img/[name].[contenthash][ext]',
          },
        },
        {
          test: /\.svg$/i,
          resourceQuery(input = '') {
            return !input.includes('as-vue-component');
          },
          type: 'asset',
          generator: {
            filename: isDev ? 'svg/[name][ext]' : 'svg/[name].[contenthash][ext]',
          },
        },
        {
          test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/i,
          type: 'asset/resource',
          generator: {
            filename: isDev ? 'fonts/[name][ext]' : 'fonts/[name].[contenthash][ext]',
          },
        },
        {
          test: /\.(webm|mp4|ogv)$/i,
          type: 'asset/resource',
          generator: {
            filename: isDev ? 'videos/[name][ext]' : 'videos/[name].[contenthash][ext]',
          },
        },
      ],
    },
    resolve: {
      extensions: ['.mjs', '.js', '.json', '.ts'],
      extensionAlias: {
        '.js': ['.ts', '.js'],
        '.mjs': ['.mts', '.mjs'],
      },
      modules: [
        'node_modules',
        path.join(new URL(path.dirname(import.meta.url)).pathname, '..', 'node_modules'),
        path.join(path.dirname(config.PATH), 'node_modules'),
      ],
    },
    resolveLoader: {
      modules: [
        'node_modules',
        path.join(new URL(path.dirname(import.meta.url)).pathname, '..', 'node_modules'),
        path.join(path.dirname(config.PATH), 'node_modules'),
      ],
    },

    plugins: [new WebpackBar()],
    optimization: {
      runtimeChunk: {
        name: 'manifest',
      },
      splitChunks: {
        chunks: 'all',
        cacheGroups: {
          vendors: {
            test: /[\\/]node_modules[\\/]/,
            name: 'vendors',
            chunks: 'initial',
          },
        },
      },
    },
  };

  const defaultCssRule = {
    test: /\.(sa|sc|c)ss$/,
    type: 'css',
    use: [
      {
        loader: 'postcss-loader',
        options: {
          postcssOptions: {
            plugins: ['autoprefixer'],
          },
        },
      },
      'resolve-url-loader',
      {
        loader: 'sass-loader',
        options: {
          sassOptions: config.sassOptions || {},
          sourceMap: true,
        },
      },
    ],
  };

  webpackBaseConfig.module.rules.push(defaultCssRule);

  // @todo fix merging
  // if (config.mergeCSS) {
  //   const stylesCacheGroup = {
  //     name: 'styles',
  //     chunks: 'initial',
  //     enforce: true,
  //     test: /\.css$/,
  //   };

  //   if (typeof config.mergeCSS === 'function' || config.mergeCSS.constructor.name === 'RegExp') {
  //     stylesCacheGroup.test = config.mergeCSS;
  //   }

  //   webpackBaseConfig.optimization.splitChunks.cacheGroups.styles = stylesCacheGroup;
  // }

  if (config.analyze) {
    webpackBaseConfig.plugins.push(
      new BundleAnalyzerPlugin({
        analyzerMode: isDev ? 'server' : 'static',
        excludeAssets: /hot-update/,
      })
    );
  }

  if (config.webpack && typeof config.webpack === 'function') {
    await config.webpack(webpackBaseConfig, isDev);
  }

  return webpackBaseConfig;
}
