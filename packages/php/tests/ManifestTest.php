<?php

use Studiometa\WebpackConfig\Manifest;

beforeEach(function() {
    $this->manifest = new Manifest(__DIR__ . '/__stubs__/assets-manifest.json', '/public/');
});

it('should fail if no manifest file is found', function() {
    expect(function() {
        return new Manifest('/path/to/manifest.json', '/');
    })->toThrow('Could not find a manifest in /path/to/manifest.json');
});

it('should fail if the manifest file can not be read', function() {
    expect(function() {
        return new Manifest(__DIR__ . '/__stubs__/', '/');
    })->toThrow(sprintf('Could not read the manifest in %s', __DIR__ . '/__stubs__/'));
});

it('should fail if the manifest file does not follow the correct schema', function() {
    expect(function() {
        return new Manifest(__DIR__ . '/__stubs__/invalid-manifest.json', '/');
    })->toThrow('Manifest schema is not valid.');
});

it('should return the real path of an asset or null', function() {
    expect($this->manifest->asset('a.js'))->toBe('/public/a.hash.js');
    expect($this->manifest->asset('c.js'))->toBeNull();
});

it('should print HTML tags for a given entrypoint', function() {
    $entry = $this->manifest->entry('css/app');
    expect((string)$entry)->toBe('<link href="/public/styles.hash.css" rel="stylesheet">' . PHP_EOL);
});

it('should print HTML tags for all entrypoints', function() {
    expect((string)$this->manifest)->toBe('<link rel="preload" href="/public/preload.hash.js" as="script">
<link rel="preload" href="/public/preload.hash.css" as="style">
<link href="/public/a.hash.css" rel="stylesheet">
<link href="/public/b.hash.css" rel="stylesheet">
<link href="/public/styles.hash.css" rel="stylesheet">
<script src="/public/a.hash.js" defer></script>
<script src="/public/b.hash.js" defer></script>
<link rel="prefetch" href="/public/prefetch.hash.js" as="script">
<link rel="prefetch" href="/public/prefetch.hash.css" as="style">' . PHP_EOL);
});
