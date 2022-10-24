<?php

namespace Studiometa\WebpackConfig;

use Exception;
use Studiometa\WebpackConfig\Traits\AssetsPath;

class Manifest {
    use AssetsPath;

    /**
     * @var string
     */
    public $manifestPath;

    /**
     * @var array
     */
    public $manifest;

    /**
     * Constructor.
     * @param string $path       The path to the manifest file.
     * @param string $publicPath The public path to the manifest folder.
     */
    public function __construct(string $path, string $publicPath) {
        if (!file_exists($path)) {
            throw new Exception(sprintf('Could not find a manifest in %s', $path));
        }

        $this->manifestPath = $path;
        $this->publicPath = $publicPath;
        $this->manifest = json_decode(file_get_contents($path), true);

        foreach ($this->manifest['entrypoints'] as $name => $entrypoint) {
            $this->entries[$name] = new Entry($entrypoint, $publicPath);
        }
    }

    /**
     * Get an entry by name.
     * @param   string $name
     * @return  Entry|null
     */
    public function entry(string $name):?Entry {
        return $this->entries[$name] ?? null;
    }

    /**
     * Get a file path based on its entry name.
     * @param  string $asset
     * @return string|null
     */
    public function asset(string $asset):?string {
        return key_exists($asset, $this->manifest) ? $this->getAssetPath($this->manifest[$asset]) : null;
    }

    /**
     * Print HTML.
     * @return string
     */
    public function __toString():string  {
        $preload = [];
        $styles = [];
        $scripts = [];
        $prefetch = [];

        // Merge all entries
        foreach ($this->entries as $entry) {
            $preload = $preload + $entry->preload;
            $styles = $styles + $entry->styles;
            $scripts = $scripts + $entry->scripts;
            $prefetch = $prefetch + $entry->prefetch;
        }

        return implode(PHP_EOL, array_merge($preload, $styles, $scripts, $prefetch)) . PHP_EOL;
    }
}
