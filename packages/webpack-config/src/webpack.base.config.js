import path from 'node:path';
import 'dotenv-expand/config.js';
import WebpackBar from 'webpackbar';
import * as glob from 'glob';
import RemoveEmptyScriptsPlugin from 'webpack-remove-empty-scripts';
import webpack from 'webpack';
import BundleAnalyzerPluginImport from 'webpack-bundle-analyzer';
import TerserPlugin from 'terser-webpack-plugin';
import commonDir from 'common-dir';
import WebpackAssetsManifest from 'webpack-assets-manifest';
import CssMinimizerPlugin from 'css-minimizer-webpack-plugin';

const { DefinePlugin, ExternalsPlugin } = webpack;
const { BundleAnalyzerPlugin } = BundleAnalyzerPluginImport;

const LEADING_SLASH_REGEXP = /^\//;
const CSS_FILE_REGEXP = /\.(sa|sc|c)ss$/;

/**
 * Get Webpack base config.
 * @param   {import('./index').MetaConfig} config
 * @param   {{ mode?: 'development'|'production' }} [options]
 * @returns {import('webpack').Configuration}
 */
export default async function getWebpackBaseConfig(config, { mode = 'production' } = {}) {
  const isDev = mode !== 'production';
  const src = path.resolve(config.context, commonDir(config.src));

  const entry = Object.fromEntries(
    config.src.flatMap((entryGlob) => {
      return glob.sync(entryGlob, { cwd: config.context, absolute: true }).map((file) => {
        return [
          file.replace(src, '').replace(path.extname(file), '').replace(LEADING_SLASH_REGEXP, ''),
          file,
        ];
      });
    }),
  );

  /** @type {import('webpack').Configuration} */
  const webpackBaseConfig = {
    context: config.context,
    entry,
    devtool: 'source-map',
    target: 'browserslist:> 0.2%, last 4 versions, not dead',
    output: {
      path: path.resolve(config.context, config.dist),
      publicPath: config.public ?? 'auto',
      filename: `[name].js`,
      chunkFilename: isDev ? '[name].js' : '[name].[contenthash].js',
      sourceMapFilename: '[file].map',
      clean: true,
    },
    experiments: {
      css: true,
      backCompat: false,
      futureDefaults: false,
    },
    cache: {
      type: 'filesystem',
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
    },
    module: {
      rules: [
        {
          resourceQuery: /raw/,
          type: 'asset/source',
        },
        {
          test: /\.md?/,
          type: 'asset/source',
        },
        {
          test: /\.mjs$/,
          type: 'javascript/esm',
        },
        {
          test: /\.m?(j|t)s$/,
          type: 'javascript/auto',
          use: {
            loader: 'esbuild-loader',
            options: {
              loader: 'ts',
              target: isDev ? 'es2022' : 'es2020',
            },
          },
        },
        {
          test: /\.css$/i,
          type: 'css/global',
          use: [
            {
              loader: 'postcss-loader',
              options: {
                postcssOptions: {
                  plugins: ['autoprefixer'],
                },
              },
            },
          ],
        },
        {
          test: /\.s(a|c)ss$/i,
          type: 'css/global',
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
                sassOptions: {
                  ...config.sassOptions,
                  // This fix a strange bug where `url()` are not resolved
                  // by Webpack when the output is set to `compressed` in
                  // production mode.
                  outputStyle: 'expanded',
                },
                sourceMap: true,
              },
            },
          ],
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
    plugins: [
      new WebpackBar(),
      new RemoveEmptyScriptsPlugin(),
      new DefinePlugin({
        __DEV__: JSON.stringify(isDev),
      }),
      new WebpackAssetsManifest({
        writeToDisk: true,
        entrypoints: true,
        entrypointsUseAssets: true,
      }),
      // Do not resolve URL starting with `/` in Sass and CSS files
      new ExternalsPlugin('module', ({ request, dependencyType, contextInfo }, callback) => {
        if (
          dependencyType === 'url' &&
          request.startsWith('/') &&
          CSS_FILE_REGEXP.test(contextInfo.issuer)
        ) {
          return callback(null, `asset ${request}`);
        }

        callback();
      }),
    ],
    optimization: {
      minimizer: [
        new TerserPlugin({
          parallel: true,
          extractComments: true,
          minify: TerserPlugin.esbuildMinify,
        }),
        new CssMinimizerPlugin({
          minify: CssMinimizerPlugin.esbuildMinify,
        }),
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

  if (config.mergeCSS) {
    webpackBaseConfig.optimization.splitChunks.cacheGroups.styles = {
      name: 'styles',
      chunks: 'initial',
      test(mod, chunks) {
        const isCSS = mod.type === 'css/global';

        if (typeof config.mergeCSS === 'function') {
          return isCSS && config.mergeCSS(mod, chunks);
        }

        if (config.mergeCSS instanceof RegExp) {
          return isCSS && config.mergeCSS.test(mod.resource);
        }

        return isCSS;
      },
    };
  }

  if (config.analyze) {
    webpackBaseConfig.plugins.push(
      new BundleAnalyzerPlugin({
        analyzerMode: isDev ? 'server' : 'static',
        excludeAssets: /hot-update/,
      }),
    );
  }

  if (config.webpack && typeof config.webpack === 'function') {
    await config.webpack(webpackBaseConfig, isDev);
  }

  return webpackBaseConfig;
}
