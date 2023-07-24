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

const { DefinePlugin } = webpack;
const { BundleAnalyzerPlugin } = BundleAnalyzerPluginImport;

const LEADING_SLASH_REGEXT = /^\//;

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
          file.replace(src, '').replace(path.extname(file), '').replace(LEADING_SLASH_REGEXT, ''),
          file,
        ];
      });
    }),
  );

  const webpackBaseConfig = {
    context: config.context,
    entry,
    devtool: 'source-map',
    target: ['web', 'es6'],
    output: {
      path: path.resolve(config.context, config.dist),
      publicPath: config.public ?? 'auto',
      pathinfo: false,
      filename: `[name].js`,
      chunkFilename: isDev ? '[name].js' : '[name].[contenthash].js',
      sourceMapFilename: '[file].map',
      clean: true,
      environment: {
        // The environment supports arrow functions ('() => { ... }').
        arrowFunction: true,
        // The environment supports const and let for variable declarations.
        const: true,
        // The environment supports destructuring ('{ a, b } = obj').
        destructuring: true,
        // The environment supports an async import() function to import EcmaScript modules.
        dynamicImport: true,
        // The environment supports 'for of' iteration ('for (const x of array) { ... }').
        forOf: true,
      },
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
      excludeAssets: isDev ? [/\.map$/, /hot-update/, /^manifest\.(js|json)$/] : [/\.map$/],
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
          // Exclude all but packages from the `@studiometa/` namespace
          exclude: [/node_modules[\\/](?!@studiometa[\\/]).*/],
          type: 'javascript/auto',
          use: {
            loader: 'esbuild-loader',
            options: {
              loader: 'ts',
              target: isDev ? 'es2022' : 'es2020',
              format: 'esm',
            },
          },
        },
        {
          test: /\.s(a|c)ss$/,
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
                sassOptions: config.sassOptions || {},
                sourceMap: true,
              },
            },
          ],
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
    const stylesCacheGroup = {
      name: 'styles',
      test: /\.css$/,
      chunks: 'initial',
      enforce: true,
    };

    if (typeof config.mergeCSS === 'function' || config.mergeCSS.constructor.name === 'RegExp') {
      stylesCacheGroup.test = config.mergeCSS;
    }

    webpackBaseConfig.optimization.splitChunks.cacheGroups.styles = stylesCacheGroup;
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
