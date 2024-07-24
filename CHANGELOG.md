# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/), and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added

- Add support for options for the Vue 3 preset ([#95](https://github.com/studiometa/webpack-config/pull/95), [63d18d6](https://github.com/studiometa/webpack-config/commits/63d18d6))
- Add support for options for the Vue 2 preset ([#95](https://github.com/studiometa/webpack-config/pull/95), [ed94a8f](https://github.com/studiometa/webpack-config/commits/ed94a8f))

### Changed

- Update dependencies ([16ec3c4](https://github.com/studiometa/webpack-config/commits/16ec3c4))
- Replace sass with sass-embedded ([dfd955c](https://github.com/studiometa/webpack-config/commits/dfd955c))
- Replace an obsolete dependency ([ece02ae](https://github.com/studiometa/webpack-config/commits/ece02ae))
- Allow APP_URL for the devServer ([fa2fc39](https://github.com/studiometa/webpack-config/commits/fa2fc39))
- Enable experimentalInlineMatchResource by default ([#95](https://github.com/studiometa/webpack-config/pull/95), [e5ed559](https://github.com/studiometa/webpack-config/commits/e5ed559))

## [v6.0.3](https://github.com/studiometa/webpack-config/compare/6.0.2..6.0.3) (2024-05-24)

### Fixed

- Fix presets import not being resolved by ESLint ([e16e796](https://github.com/studiometa/webpack-config/commit/e16e796))
- Fix a bug where modules could not be found ([5a63267](https://github.com/studiometa/webpack-config/commit/5a63267))

## [v6.0.2](https://github.com/studiometa/webpack-config/compare/6.0.1..6.0.2) (2024-04-29)

### Fixed

- Fix a dependency conflict ([629b170](https://github.com/studiometa/webpack-config/commit/629b170))

## [v6.0.1](https://github.com/studiometa/webpack-config/compare/6.0.0..6.0.1) (2024-04-15)

### Removed

- ⚠️ Remove the `meta link` command ([d255afe](https://github.com/studiometa/webpack-config/commit/d255afe))

## [v6.0.0](https://github.com/studiometa/webpack-config/compare/5.3.0..6.0.0) (2024-04-15)

### Removed

- ⚠️ Remove the `eslint` preset ([#146](https://github.com/studiometa/webpack-config/pull/146))
- ⚠️ Remove the `stylelint` preset ([#146](https://github.com/studiometa/webpack-config/pull/146))

### Changed

- Update webpack-config major dependencies ([4d457e0](https://github.com/studiometa/webpack-config/4d457e0))
- Update preset-vue-\* dependencies ([0b3855e](https://github.com/studiometa/webpack-config/0b3855e))
- Update preset-prototyping dependencies ([5c6e5c2](https://github.com/studiometa/webpack-config/5c6e5c2))
- Update preset-markdown dependencies ([bf606cd](https://github.com/studiometa/webpack-config/bf606cd))
- Update demo dependencies ([4679a3f](https://github.com/studiometa/webpack-config/4679a3f))
- Update webpack-config dependencies ([2c2ff17](https://github.com/studiometa/webpack-config/2c2ff17))
- Update demo dependencies ([8a3dbc4](https://github.com/studiometa/webpack-config/8a3dbc4))
- Bump root dependencies ([1514df6](https://github.com/studiometa/webpack-config/1514df6))
- Use official illuminate/collections package ([01ba26d](https://github.com/studiometa/webpack-config/01ba26d))
- Update Node to >=20.11.0 ([672e450](https://github.com/studiometa/webpack-config/commit/672e450))

### Fixed

- Fix dependencies constraints ([e591a64](https://github.com/studiometa/webpack-config/commit/e591a64))

## [v5.3.0](https://github.com/studiometa/webpack-config/compare/5.2.3..5.3.0) (2023-10-26)

### Added

- Add a `meta link <path>[ --alias @]` command to easily create import aliases ([#139](https://github.com/studiometa/webpack-config/pull/139))

### Changed

- Update dependencies ([#135](https://github.com/studiometa/webpack-config/pull/135), [#136](https://github.com/studiometa/webpack-config/pull/136), [7e70fe2](https://github.com/studiometa/webpack-config/commit/7e70fe2))
- Update @studiometa/webpack-config-preset-vue-2 dependencies ([c1a4ff9](https://github.com/studiometa/webpack-config/commit/c1a4ff9))
- Update @studiometa/webpack-config-preset-vue-3 dependencies ([822af46](https://github.com/studiometa/webpack-config/commit/822af46))
- Update @studiometa/webpack-config dev dependencies ([b47b5fb](https://github.com/studiometa/webpack-config/commit/b47b5fb))
- Update @studiometa/webpack-config dependencies ([271d391](https://github.com/studiometa/webpack-config/commit/271d391))
