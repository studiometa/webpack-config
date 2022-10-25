<?php

use Studiometa\WebpackConfig\Entry;

it('should load assets', function() {
    $entry = new Entry([
        'assets' => [
            'js' => [
                'a.js',
                'b.js'
            ],
            'css' => [
                'a.css',
                'b.css'
            ],
        ],
        'preload' => [
            'js' => ['preload.js'],
            'css' => ['preload.css'],
        ],
        'prefetch' => [
            'js' => ['prefetch.js'],
            'css' => ['prefetch.css'],
        ],
    ], '/');
    expect($entry->scripts)->toHaveLength(2);
    expect($entry->styles)->toHaveLength(2);
    expect($entry->preload)->toHaveLength(2);
    expect($entry->prefetch)->toHaveLength(2);
});

it('should not load duplicate and inexisting assets', function() {
    $entry = new Entry([
        'assets' => [
            'js' => [
                'a.js',
                'a.js',
                'b.js'
            ],
        ],
    ], '/');
    expect($entry->scripts)->toHaveLength(2);
    expect($entry->scripts->getKeys())->toEqual(['a.js', 'b.js']);
    expect($entry->styles)->toHaveLength(0);
    expect($entry->preload)->toHaveLength(0);
    expect($entry->prefetch)->toHaveLength(0);
});

it('should print HTML tags', function() {
    $entry = new Entry([
        'assets' => [
            'js' => [
                'a.js',
                'b.js'
            ],
            'css' => [
                'a.css',
                'b.css'
            ],
        ],
        'preload' => [
            'js' => ['preload.js'],
            'css' => ['preload.css'],
        ],
        'prefetch' => [
            'js' => ['prefetch.js'],
            'css' => ['prefetch.css'],
        ],
    ], '/');

    expect((string)$entry)->toBe('<link rel="preload" href="/preload.js" as="script">
<link rel="preload" href="/preload.css" as="style">
<link href="/a.css" rel="stylesheet">
<link href="/b.css" rel="stylesheet">
<script src="/a.js" defer></script>
<script src="/b.js" defer></script>
<link rel="prefetch" href="/prefetch.js" as="script">
<link rel="prefetch" href="/prefetch.css" as="style">
');
});
