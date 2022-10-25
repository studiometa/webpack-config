<?php

namespace Studiometa\WebpackConfig;

use HtmlObject\Element;

class Script extends Element {
    /**
     * @var string
     */
    protected $element = 'script';

    /**
     * @param string|array|null $value
     * @param array  $attributes
     */
    public function __construct($value = null, $attributes = []) {
        if (is_array($value)) {
            $attributes = $value;
            $value = null;
        }

        parent::__construct($this->element, $value, $attributes);
    }
}
