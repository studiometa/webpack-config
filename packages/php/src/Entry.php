<?php

namespace Studiometa\WebpackConfig;

use Studiometa\WebpackConfig\Traits\AssetsPath;
use Tightenco\Collect\Support\Collection;

class Entry
{
    use AssetsPath;

    /**
     * @var Collection<string, Script>
     */
    public $scripts;

    /**
     * @var Collection<string, Link>
     */
    public $styles;

    /**
     * @var Collection<string, Link>
     */
    public $preload;

    /**
     * @var Collection<string, Link>
     */
    public $prefetch;

    /**
     * Constructor.
     * @param array  $entrypoint
     * @param string $publicPath
     */
    public function __construct(array $entrypoint, string $publicPath)
    {
        $this->publicPath = $publicPath;
        $this->scripts = new Collection();
        $this->styles = new Collection();
        $this->preload = new Collection();
        $this->prefetch = new Collection();

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
            if ($this->$type->has($asset)) {
                continue;
            }

            $this->$type->put($asset, $callback($this->getAssetPath($asset)));
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
                $this->preload->all(),
                $this->styles->all(),
                $this->scripts->all(),
                $this->prefetch->all()
            )
        ) . PHP_EOL;
    }
}
