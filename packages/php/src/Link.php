<?php

namespace Studiometa\WebpackConfig;

use HtmlObject\Element;

class Link extends Element
{
    /**
     * @var string
     */
    protected $element = 'link';

    /**
     * @var boolean
     */
    protected $isSelfClosing = true;

    /**
     * @param array $attributes
     */
    public function __construct($attributes = [])
    {
        parent::__construct($this->element, null, $attributes);
    }
}
