<?php

use Studiometa\WebpackConfig\Script;

it('should print an empty script if no arguments', function() {
    $script = new Script();
    expect((string)$script)->toBe('<script></script>');
});

it('should accept an array of attributes as first argument', function() {
    $script = new Script(['src' => 'foo', 'defer' => true]);
    expect((string)$script)->toBe('<script src="foo" defer></script>');
});

it('should accept an array of attributes as second argument', function() {
    $script = new Script('console.log("foo")', ['type' => 'module']);
    expect((string)$script)->toBe('<script type="module">console.log("foo")</script>');
});
