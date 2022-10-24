<?php

namespace Studiometa\WebpackConfig;
use Studiometa\WebpackConfig\Traits\AssetsPath;

class Entry {
    use AssetsPath;

    private $entrypoint;

    public $scripts = [];

    public $styles = [];

    public $preload = [];

    public $prefetch = [];

    public function __construct(array $entrypoint, string $publicPath) {
        $this->publicPath = $publicPath;
        $this->entrypoint = $entrypoint;

        $assets = $entrypoint['assets'] ?? [];
        $preload = $entrypoint['preload'] ?? [];
        $prefetch = $entrypoint['prefetch'] ?? [];

        $this->addAssets($assets['js'] ?? null, 'scripts', function ($asset) {
            return new Script(['src' => $asset, 'defer' => true]);
        });

        $this->addAssets($assets['css'] ?? null, 'styles', function ($asset) {
            return new Link(['href' => $asset, 'rel' => 'stylesheet']);
        });

        $this->addAssets($preload['js'] ?? null, 'preload', function ($asset) {
            return new Link(['rel' => 'preload', 'href' => $asset, 'as' => 'script']);
        });

        $this->addAssets($preload['css'] ?? null, 'preload', function ($asset) {
            return new Link(['rel' => 'preload', 'href' => $asset, 'as' => 'style']);
        });

        $this->addAssets($prefetch['js'] ?? null, 'prefetch', function ($asset) {
            return new Link(['rel' => 'prefetch', 'href' => $asset, 'as' => 'script']);
        });

        $this->addAssets($prefetch['css'] ?? null, 'prefetch', function ($asset) {
            return new Link(['rel' => 'prefetch', 'href' => $asset, 'as' => 'style']);
        });
    }

    /**
     * Add assets to the manifest.
     *
     * @param array<string> $assets
     * @param 'scripts'|'styles'|'preload'|'prefetch' $type
     * @param callable $callback
     */
    private function addAssets(?array $assets, string $type, callable $callback) {
        if (empty($assets)) {
            return;
        }

        foreach ($assets as $asset) {
            if (key_exists($asset, $this->$type)) {
                continue;
            }

            $this->$type[$asset] = $callback($this->getAssetPath($asset));
        }
    }

    /**
     * Print HTML tags.
     * @return string
     */
    public function __toString():string {
        return implode(PHP_EOL, array_merge($this->preload, $this->styles, $this->scripts, $this->prefetch)) . PHP_EOL;
    }
}
