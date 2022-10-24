<?php

require __DIR__ . '/vendor/autoload.php';
use Studiometa\WebpackConfig\Manifest;

$manifest = new Manifest(__DIR__ . '/packages/demo/dist/assets-manifest.json', '/public/path');

echo $manifest->asset('vendors.js');
echo PHP_EOL;

echo $manifest;
echo PHP_EOL;
echo $manifest->entry('css/test');
echo PHP_EOL;

foreach ($manifest->entry('css/app')->styles as $style) {
    echo  $style->getAttribute('href') . PHP_EOL;
}

foreach ($manifest->entry('css/app')->scripts as $script) {
    echo  $script->getAttribute('src') . PHP_EOL;
}

echo PHP_EOL;

// [$one,$two] = [1,2];

// var_dump($one, $two);
