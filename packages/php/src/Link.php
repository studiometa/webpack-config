<?php

namespace Studiometa\WebpackConfig;

use HtmlObject\Element;

class Link extends Element {
    protected $element = 'link';
    protected $isSelfClosing = true;

    public function __construct($attributes = []) {
        return parent::__construct($this->element,  null, $attributes);
    }
}
