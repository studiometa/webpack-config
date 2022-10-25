# studiometa/webpack-config

This package contains PHP classes to easily work with Webpack assets based on the output of the [webpack-assets-manifest](https://github.com/webdeveric/webpack-assets-manifest) plugin. It uses the [html-object package](https://github.com/Anahkiasen/html-object) to generate the HTML output.

This package requires PHP 7.3 or up.

## Installation

```php
composer require studiometa/webpack-config
```

## Usage

```php
use Studiometa\WebpackConfig\Manifest;

$manifest_path = __DIR__ . '/path/to/assets-manifest.json';
$manifest_public_folder = '/path/to';
$manifest = new Manifest($manifest_path, $manifest_public_folder);

// Print all entries as HTML
echo $manifest;

// Get a specific generated asset path
$vendors = $manifest->asset('vendors.js'); // path/to/vendors.hash.js
$app = $manifest->asset('js/app.js'); // path/to/js/app.hash.js

// Get a specific entry
$main_entry = $manifest->entry('js/main');

// Print the entry as HTML
echo $main_entry;

// Get an entry assets: styles, scripts, preload links and prefetch links
$styles = $main_entry->styles; // Array<Link>
$scripts = $main_entry->scripts; // Array<Script>
$preload = $main_entry->preload; // Array<Link>
$prefetch = $main_entry->prefetch; // Array<Link>
```
