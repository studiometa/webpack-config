/**
 * @returns {Promise<object>}
 */
export async function data() {
  return {
    head: {
      title: 'Home',
    },
    foo: ['foo', 'biz'],
    fn() {
      return 'this is value returned by a function';
    },
  };
}
