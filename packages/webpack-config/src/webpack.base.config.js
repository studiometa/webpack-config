import path from 'path';
import VueLoaderPlugin from 'vue-loader/lib/plugin.js';
import WebpackBar from 'webpackbar';
import entry from 'webpack-glob-entry';
import RemoveEmptyScriptsPlugin from 'webpack-remove-empty-scripts';
import webpack from 'webpack';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import StylelintPlugin from 'stylelint-webpack-plugin';
import ESLintPlugin from 'eslint-webpack-plugin';
import BundleAnalyzerPluginImport from 'webpack-bundle-analyzer';
import TerserPlugin from 'terser-webpack-plugin';
import commonDir from 'common-dir';
import dotenv from 'dotenv';
import WebpackAssetsManifest from 'webpack-assets-manifest';
import CssMinimizerPlugin from 'css-minimizer-webpack-plugin';

const { DefinePlugin } = webpack;
const { BundleAnalyzerPlugin} = BundleAnalyzerPluginImport;

dotenv.config();

export default async (config) => {
  const isDev = process.env.NODE_ENV !== 'production';
  const src = commonDir(config.src);

  const webpackBaseConfig = {
    entry: entry((filePath) => {
      const extname = path.extname(filePath);
      return filePath.replace(src, '').replace(extname, '');
    }, ...config.src),
    devtool: 'source-map',
    target: 'web',
    output: {
      path: path.resolve(path.dirname(config.PATH), config.dist),
      publicPath: config.public,
      pathinfo: false,
      filename: '[name].js',
      chunkFilename: isDev ? '[name].js' : '[name].[contenthash].js',
      sourceMapFilename: '[file].map',
      clean: true,
    },
    cache: {
      type: 'filesystem',
      name: isDev ? 'dev' : 'prod',
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
          test: /\.m?js$/,
          exclude: /node_modules/,
          type: 'javascript/auto',
          get use() {
            const babel = {
              loader: 'babel-loader',
              options: {
                cacheDirectory: true,
                rootMode: 'upward-optional',
                presets: [
                  [
                    '@babel/preset-env',
                    {
                      useBuiltIns: 'usage',
                      corejs: '3.11',
                    },
                  ],
                ],
                plugins: ['@babel/plugin-transform-runtime'],
              },
            };

            return isDev ? ['webpack-module-hot-accept', babel] : [babel];
          },
        },
        {
          test: /\.vue$/,
          use: isDev ? ['vue-loader', 'webpack-module-hot-accept'] : ['vue-loader'],
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
          resourceQuery(input) {
            return input.includes('as-vue-component');
          },
          use: ['vue-svg-loader'],
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
      extensions: ['.vue', '.mjs', '.js', '.json'],
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
    plugins: [
      new ESLintPlugin({
        context: src,
        extensions: ['js', 'vue'],
        fix: true,
        failOnError: !isDev,
        baseConfig: {
          extends: '@studiometa/eslint-config',
          globals: {
            __DEV__: false,
          },
          settings: { 'import/resolver': 'webpack' },
        },
      }),
      new StylelintPlugin({
        context: src,
        files: ['**/*.s?(a|c)ss', '**/*.vue'],
        fix: true,
        allowEmptyInput: true,
        failOnError: !isDev,
        configOverride: { extends: '@studiometa/stylelint-config/prettier' },
      }),
      new VueLoaderPlugin(),
      new WebpackBar(),
      new RemoveEmptyScriptsPlugin(),
      new MiniCssExtractPlugin({
        filename: '[name].css',
        chunkFilename: isDev ? '[name].css' : '[name].[contenthash].css',
      }),
      new DefinePlugin({
        __DEV__: JSON.stringify(isDev),
      }),
      new WebpackAssetsManifest({
        writeToDisk: true,
        entrypoints: true,
        entrypointsUseAssets: true,
      }),
    ],
    optimization: {
      minimizer: [
        new TerserPlugin({
          parallel: true,
          extractComments: true,
        }),
        new CssMinimizerPlugin(),
      ],
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
    use: [
      {
        loader: MiniCssExtractPlugin.loader,
      },
      { loader: 'css-loader', options: { url: { filter: (url) => !url.startsWith('/') } } },
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

  if (config.mergeCSS) {
    webpackBaseConfig.module.rules.push(defaultCssRule);
    const stylesCacheGroup = {
      name: 'styles',
      type: 'css/mini-extract',
      chunks: 'initial',
      enforce: true,
    };

    if (typeof config.mergeCSS === 'function' || config.mergeCSS.constructor.name === 'RegExp') {
      stylesCacheGroup.test = config.mergeCSS;
    }

    webpackBaseConfig.optimization.splitChunks.cacheGroups.styles = stylesCacheGroup;
  } else {
    defaultCssRule.test = /(?<!\.vue)\.(sa|sc|c)ss$/;
    const vueCssRule = {
      test: /\.vue\.(sa|sc|c)ss$/,
      use: [
        'style-loader',
        { loader: 'css-loader', options: { url: (url) => !url.startsWith('/') } },
        {
          loader: 'postcss-loader',
          options: {
            postcssOptions: {
              plugins: isDev ? ['postcss-preset-env'] : ['postcss-preset-env', 'autoprefixer'],
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
    webpackBaseConfig.module.rules.push(vueCssRule);
  }

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
};
