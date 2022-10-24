<?php

namespace Studiometa\WebpackConfig;

use HtmlObject\Element;

class Script extends Element {
    protected $element = 'script';

    public function __construct($value = null, $attributes = []) {
        if (is_array($value)) {
            $attributes = $value;
            $value = null;
        }
        return parent::__construct($this->element, $value, $attributes);
    }
}
