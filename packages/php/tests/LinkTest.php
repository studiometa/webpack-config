<?php

use Studiometa\WebpackConfig\Link;

it('should print an empty link if no arguments', function() {
    $script = new Link();
    expect((string)$script)->toBe('<link>');
});

it('should print a link with attributes', function() {
    $script = new Link(['href' => 'foo', 'rel' => 'stylesheet']);
    expect((string)$script)->toBe('<link href="foo" rel="stylesheet">');
});
