<?php

namespace Studiometa\WebpackConfig;

use Exception;
use Studiometa\WebpackConfig\Traits\AssetsPath;
use Tightenco\Collect\Support\Collection;

class Manifest
{
    use AssetsPath;

    /**
     * @var Collection<string, string>
     */
    public $manifest;

    /**
     * @var Collection<string, Entry>
     */
    public $entries;

    /**
     * Constructor.
     * @param string $path       The path to the manifest file.
     * @param string $publicPath The public path to the manifest folder.
     */
    public function __construct(string $path, string $publicPath)
    {
        if (!file_exists($path)) {
            throw new Exception(sprintf('Could not find a manifest in %s', $path));
        }

        $content = null;

        try {
            $content = file_get_contents($path);
        } catch (Exception $error) {
            throw new Exception(sprintf('Could not read the manifest in %s', $path));
        }

        if (!$content) {
            throw new Exception(sprintf('Could not read the manifest in %s', $path));
        }

        $json = json_decode($content, true);

        if (!is_array($json) || !key_exists('entrypoints', $json)) {
            throw new Exception('Manifest schema is not valid.');
        }

        $this->manifest = (new Collection($json))->except('entrypoints');
        $this->publicPath = $publicPath;
        $this->entries = new Collection();

        foreach ($json['entrypoints'] as $name => $entrypoint) {
            $this->entries->put($name, new Entry($entrypoint, $publicPath));
        }
    }

    /**
     * Get an entry by name.
     * @param   string $name
     * @return  Entry|null
     */
    public function entry(string $name):?Entry
    {
        /** @var Entry|null */
        return $this->entries->get($name);
    }

    /**
     * Get a file path based on its entry name.
     * @param  string $asset
     * @return string|null
     */
    public function asset(string $asset):?string
    {
        if (!$this->manifest->has($asset)) {
            return null;
        }

        /** @var string $filename */
        $filename = $this->manifest->get($asset);

        return $this->getAssetPath($filename);
    }

    /**
     * Print HTML.
     * @return string
     */
    public function __toString():string
    {
        $preload = [];
        $styles = [];
        $scripts = [];
        $prefetch = [];

        // Merge all entries
        foreach ($this->entries->all() as $entry) {
            $preload = $preload + $entry->preload->all();
            $styles = $styles + $entry->styles->all();
            $scripts = $scripts + $entry->scripts->all();
            $prefetch = $prefetch + $entry->prefetch->all();
        }

        return implode(PHP_EOL, array_merge($preload, $styles, $scripts, $prefetch)) . PHP_EOL;
    }
}
