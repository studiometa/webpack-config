import { describe, it } from 'node:test';
import { deepStrictEqual, equal } from 'node:assert';
import Html from './Html.js';

describe('The `Html.mergeAttributes` method', () => {
  it('should render class attribute', () => {
    const tests = [
      ['', ''],
      [null, ''],
      ['foo', 'foo'],
      [['foo'], 'foo'],
      [{ foo: true }, 'foo'],
    ];

    for (const [defs, result] of tests) {
      equal(Html.renderClass(defs), result);
    }
  });

  it('should render style attribute', () => {
    const tests = [
      ['', ''],
      [null, ''],
      [{ _keys: 'foo' }, ''],
      [{ display: false }, ''],
      [{ display: null }, ''],
      [{ display: '' }, ''],
      [{ display: 'none' }, 'display: none;'],
      [{ opacity: 0, borderColor: '#000' }, 'opacity: 0; border-color: #000;'],
    ];

    for (const [defs, result] of tests) {
      equal(Html.renderStyleAttribute(defs), result);
    }
  });

  it('should render attributes', () => {
    const tests = [
      ['', ''],
      [null, ''],
      [{ _keys: 'foo' }, ''],
      [{ dataOptionFoo: false }, ''],
      [{ dataOptionFoo: true }, ' data-option-foo'],
      [{ dataOptionFoo: 'foo' }, ' data-option-foo="foo"'],
      [{ dataOptionFoo: { foo: 'bar' } }, ' data-option-foo="{&quot;foo&quot;:&quot;bar&quot;}"'],
      [
        { dataOptionFoo: new Map([['foo', 'bar']]) },
        ' data-option-foo="{&quot;foo&quot;:&quot;bar&quot;}"',
      ],
      [{ class: ['foo'] }, ' class="foo"'],
      [{ style: { display: 'none' } }, ' style="display: none;"'],
    ];

    for (const [defs, result] of tests) {
      equal(Html.renderAttributes(defs), result);
    }
  });

  it('should render an element', () => {
    const tests = [
      [['a', { href: '#' }, 'link'], '<a href="#">\nlink\n</a>'],
      [['br', { class: 'foo' }], '<br class="foo" />'],
    ];

    for (const [defs, result] of tests) {
      equal(Html.renderTag(...defs), result);
    }
  });

  it('the mergeAttributes method should accept null parameters', () => {
    deepStrictEqual(Html.mergeAttributes(null, null, null), {});
  });

  it('the mapToObject method should map Map instances to objects', () => {
    const map = new Map([['foo', 'bar']]);
    deepStrictEqual(Html.mapToObject(map), { foo: 'bar' });
    map.set('baz', new Map([['boz', 'biz']]));
    deepStrictEqual(Html.mapToObject(map), { foo: 'bar', baz: { boz: 'biz' } });
  });
});
