<?php

namespace Studiometa\WebpackConfig;

use Studiometa\WebpackConfig\Traits\AssetsPath;
use Doctrine\Common\Collections\ArrayCollection;

class Entry
{
    use AssetsPath;

    /**
     * @var ArrayCollection<string, Script>
     */
    public $scripts;

    /**
     * @var ArrayCollection<string, Link>
     */
    public $styles;

    /**
     * @var ArrayCollection<string, Link>
     */
    public $preload;

    /**
     * @var ArrayCollection<string, Link>
     */
    public $prefetch;

    public function __construct(array $entrypoint, string $publicPath)
    {
        $this->publicPath = $publicPath;
        $this->scripts = new ArrayCollection();
        $this->styles = new ArrayCollection();
        $this->preload = new ArrayCollection();
        $this->prefetch = new ArrayCollection();

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
     * @return $this
     */
    private function addAssets(?array $assets, string $type, callable $callback)
    {
        if (empty($assets)) {
            return $this;
        }

        foreach ($assets as $asset) {
            if (!is_null($this->$type->get($asset))) {
                continue;
            }

            $this->$type->set($asset, $callback($this->getAssetPath($asset)));
        }

        return $this;
    }

    /**
     * Print HTML tags.
     * @return string
     */
    public function __toString():string
    {
        return implode(
            PHP_EOL,
            array_merge(
                $this->preload->toArray(),
                $this->styles->toArray(),
                $this->scripts->toArray(),
                $this->prefetch->toArray()
            )
        ) . PHP_EOL;
    }
}
