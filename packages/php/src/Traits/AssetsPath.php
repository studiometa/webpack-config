<?php

namespace Studiometa\WebpackConfig\Traits;

trait AssetsPath {
    /**
     * @var string
     */
    public $publicPath;

    /**
     * Get an asset path.
     * @param  string $src
     * @return string
     */
    private function getAssetPath(string $src):string {
        return rtrim($this->publicPath, '/') . '/' . $src;
    }
}
