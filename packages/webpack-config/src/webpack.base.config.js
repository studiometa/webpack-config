import path from 'node:path';
import WebpackBar from 'webpackbar';
import glob from 'glob';
import RemoveEmptyScriptsPlugin from 'webpack-remove-empty-scripts';
import webpack from 'webpack';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import BundleAnalyzerPluginImport from 'webpack-bundle-analyzer';
import TerserPlugin from 'terser-webpack-plugin';
import commonDir from 'common-dir';
import dotenv from 'dotenv';
import WebpackAssetsManifest from 'webpack-assets-manifest';
import CssMinimizerPlugin from 'css-minimizer-webpack-plugin';

const { DefinePlugin } = webpack;
const { BundleAnalyzerPlugin } = BundleAnalyzerPluginImport;

dotenv.config();

/**
 * Get Webpack base config.
 * @param   {import('./index').MetaConfig} config
 * @param   {{ isModern?: boolean, isLegacy?: boolean }} [options]
 * @returns {import('webpack').Configuration}
 */
export default async function getWebpackBaseConfig(config, options = {}) {
  const isDev = process.env.NODE_ENV !== 'production';
  const { isModern, isLegacy } = { isModern: false, isLegacy: false, ...options };
  const src = commonDir(config.src);

  const babel = {
    loader: 'babel-loader',
    options: {
      cacheDirectory: true,
      rootMode: 'upward-optional',
      plugins: ['@babel/plugin-transform-runtime'],
      presets: [
        [
          '@babel/preset-env',
          {
            targets: '> 0.2%, last 4 versions, not dead',
            useBuiltIns: 'usage',
            corejs: '3.11',
          },
        ],
      ],
    },
  };

  const esbuild = {
    loader: 'esbuild-loader',
    options: {
      loader: 'ts',
      target: isDev ? 'es2020' : 'es2015',
      format: 'esm',
    },
  };

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
    target: ['web', isModern ? 'es6' : 'es5'],
    output: {
      path: path.resolve(
        config.context,
        config.dist,
        config.modern && config.legacy && isLegacy ? '__legacy__' : ''
      ),
      publicPath: config.public
        ? path.join(config.public, config.modern && config.legacy && isLegacy ? '__legacy__' : '')
        : 'auto',
      pathinfo: false,
      filename: `[name].js`,
      chunkFilename: isDev ? '[name].js' : '[name].[contenthash].js',
      sourceMapFilename: '[file].map',
      clean: true,
      uniqueName: process.env.BABEL_ENV,
      module: isModern || isDev,
      // Do not consider scripts to be type="module"
      scriptType: false,
      environment: {
        // The environment supports arrow functions ('() => { ... }').
        arrowFunction: isModern || isDev,
        // The environment supports const and let for variable declarations.
        const: isModern || isDev,
        // The environment supports destructuring ('{ a, b } = obj').
        destructuring: isModern || isDev,
        // The environment supports an async import() function to import EcmaScript modules.
        dynamicImport: isModern || isDev,
        // The environment supports 'for of' iteration ('for (const x of array) { ... }').
        forOf: isModern || isDev,
        // The environment supports ECMAScript Module syntax to import ECMAScript modules (import ... from '...').
        module: isModern || isDev,
      },
    },
    experiments: {
      outputModule: isModern || isDev,
      backCompat: false,
      futureDefaults: false,
    },
    cache: {
      type: 'filesystem',
      name: `${process.env.NODE_ENV}-${process.env.BABEL_ENV ?? 'default'}`,
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
          test: /\.m?(j|t)s$/,
          // Exclude all but packages from the `@studiometa/` namespace
          exclude: [/node_modules[\\/](?!@studiometa[\\/]).*/],
          type: 'javascript/auto',
          // eslint-disable-next-line no-nested-ternary
          use: isDev || isModern ? [esbuild] : [babel, esbuild],
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
          minify: TerserPlugin.esbuildMinify,
          terserOptions: {
            module: isModern,
          },
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
        { loader: 'css-loader', options: { url: { filter: (url) => !url.startsWith('/') } } },
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
    webpackBaseConfig.module.rules.push(defaultCssRule, vueCssRule);
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
    await config.webpack(webpackBaseConfig, isDev, { isModern, isLegacy });
  }

  return webpackBaseConfig;
}
